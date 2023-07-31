"use client";

import { Itinerary } from "@/app/schema";
import Button from "@/components/Button";
import { CalendarIcon } from "@heroicons/react/20/solid";
import ics, { DateArray, createEvents } from "ics";

function convertDatetoDateArray(
  date: Date,
  hour: number,
  minute: number
): DateArray {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    hour,
    minute,
  ];
}

function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

type ActionsProps = {
  itinerary: Itinerary;
};

export default function Actions(props: ActionsProps) {
  const handlePress = async () => {
    const events: ics.EventAttributes[] = [];

    props.itinerary.output.days.map((day) => {
      const date = new Date(day.date);

      day.activities.map((activity) => {
        if (activity.time.toLowerCase() === "morning") {
          const event: ics.EventAttributes = {
            start: convertDatetoDateArray(date, 9, 0),
            duration: { hours: 3 },
            title: activity.title,
            description: activity.description,
            location: capitalize(props.itinerary.input.destination),
          };

          events.push(event);
        }

        if (activity.time.toLowerCase() === "afternoon") {
          const event: ics.EventAttributes = {
            start: convertDatetoDateArray(date, 12, 0),
            duration: { hours: 5 },
            title: activity.title,
            description: activity.description,
            location: capitalize(props.itinerary.input.destination),
          };

          events.push(event);
        }

        if (activity.time.toLowerCase() === "evening") {
          const event: ics.EventAttributes = {
            start: convertDatetoDateArray(date, 17, 0),
            duration: { hours: 5 },
            title: activity.title,
            description: activity.description,
            location: capitalize(props.itinerary.input.destination),
          };

          events.push(event);
        }

        if (activity.time.toLowerCase() === "night") {
          const event: ics.EventAttributes = {
            start: convertDatetoDateArray(date, 22, 0),
            duration: { hours: 4 },
            title: activity.title,
            description: activity.description,
            location: capitalize(props.itinerary.input.destination),
          };

          events.push(event);
        }
      });
    });

    const filename =
      props.itinerary.output.title.toLowerCase().replaceAll(" ", "_") + ".ics";

    const file: File = await new Promise((resolve, reject) => {
      createEvents(events, (error, value) => {
        if (error) {
          reject(error);
        }

        resolve(new File([value], filename, { type: "plain/text" }));
      });
    });

    const url = URL.createObjectURL(file);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div>
      <Button
        className="px-4 py-2 rounded flex gap-2 bg-indigo-500 text-white items-center"
        onPress={handlePress}
      >
        Export Calendar <CalendarIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}