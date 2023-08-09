"use client";

import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalState, useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Item } from "react-stately";
import Select from "@/components/Select";

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const DAYTIMES = ["morning", "afternoon", "evening", "night"] as const;

export const duration = z
  .object({
    arrival: z.union([
      z.literal("morning"),
      z.literal("afternoon"),
      z.literal("evening"),
      z.literal("night"),
    ]),
    startDate: z.string().min(1, { message: "Please fill in a startDate" }),
    endDate: z.string().min(1, { message: "Please fill in a endDate" }),
  })
  .refine(({ endDate, startDate }) => new Date(endDate) > new Date(startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type Duration = z.infer<typeof duration>;

function updateDuration(state: GlobalState, payload: any) {
  return state;
}

export default function Form() {
  const router = useRouter();

  const { actions } = useStateMachine({ updateDuration });
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Duration>({
    resolver: zodResolver(duration),
  });
  const onSubmit = (data: Duration) => {
    actions.updateDuration(data);
    router.push("/onboarding/duration");
  };

  return (
    <div className="px-8 py-12 rounded bg-white max-w-lg flex flex-col gap-8 mx-auto mt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Duration</h1>
        <p>Tell us something about the length of your trip.</p>
        <p>You are almost there!</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Select
          label="When time of day do you arrive?"
          onSelectionChange={(v) =>
            setValue("arrival", v as (typeof DAYTIMES)[number])
          }
          defaultSelectedKey={DAYTIMES[0]}
        >
          {DAYTIMES.map((daytime) => (
            <Item key={daytime}>{daytime}</Item>
          ))}
        </Select>
        <DateRangePicker
          label="Start and end date of trip"
          minValue={today(getLocalTimeZone())}
          onChange={(v) => {
            setValue("startDate", v.start.toString());
            setValue("endDate", v.end.toString());
          }}
          errorMessage={errors.startDate?.message || errors.endDate?.message}
        />

        <Button
          type="submit"
          className=" bg-indigo-500 text-white rounded p-2 flex gap-2 items-center justify-center"
        >
          Final step <ArrowRightIcon className="w-5 h-5" />
        </Button>
        <p className="text-gray-600">
          * We will fill the first 5 days of your trip.
        </p>
      </form>
    </div>
  );
}
