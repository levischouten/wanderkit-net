import Button from "@/components/Button";
import { Output } from "../schema";
import cn from "classnames";
import { ModalTrigger } from "@/components/ModalTrigger";
import Dialog from "@/components/Dialog";

type ItineraryProps = {
  itinerary: Output;
  onSubmit: () => void;
};

export default function Itinerary(props: ItineraryProps) {
  return (
    <div className="flex flex-col gap-4 items-start">
      <ModalTrigger
        label="Save Itinerary"
        className="px-4 py-2 text-white rounded bg-gradient-to-br from-blue-400 to-indigo-500"
      >
        {(close) => (
          <Dialog title="Save Your Itinerary!">
            <div className="flex flex-col gap-4 pt-4">
              <p>
                Congratulations on creating your perfect itinerary! To keep it
                safe and accessible anytime, simply save it to our platform for
                just $1.
              </p>
              <p className="font-bold">Benefits:</p>
              <ul className="list-disc list-inside">
                <li>Accessible from any device</li>
                <li>Seamless calendar integration</li>
                <li>Share easily with travel buddies</li>
              </ul>
              <p className="font-medium">
                Secure your itinerary now and make the most of your travels!
              </p>
              <div className="flex justify-end">
                <Button className="px-4 py-2 text-gray-600" onPress={close}>
                  Cancel
                </Button>
                <Button
                  className="px-4 py-2 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded"
                  onPress={props.onSubmit}
                >
                  Save Now!
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </ModalTrigger>
      <div className="flex flex-col gap-4 items-start lg:overflow-auto lg:max-h-[calc(100vh_-_375px)]">
        {props.itinerary.days.map((day, index) => (
          <section key={index} className="flex flex-col">
            <h3 className="text-xl font-bold pb-2">
              Day {index + 1}{" "}
              <span className="font-medium text-lg italic text-gray-700">
                {day.date}
              </span>
            </h3>
            <div className="ml-8 flex flex-col gap-1 border-l border-indigo-500 border-dashed">
              {day.activities.map((activity, index) => (
                <div
                  key={index}
                  className={cn("flex flex-col py-2 px-4", {
                    "border-b border-gray-300":
                      index < day.activities.length - 1,
                  })}
                >
                  <h4 className="font-bold">
                    {activity.title}{" "}
                    <span className="font-medium italic">{activity.time}</span>
                  </h4>
                  <p className="">{activity.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
