import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { input, Schema } from "../schema";
import DateRangePicker from "@/components/DateRangePicker";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import React from "react";

type FormProps = {
  onSubmit: (value: Schema) => void;
  disabled: boolean;
};

export default function Form(props: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(input),
  });

  return (
    <form
      onSubmit={handleSubmit(props.onSubmit)}
      className="flex flex-col gap-2 lg:min-w-[400px]"
    >
      <label>What city are you going to?</label>
      <input
        {...register("destination")}
        className="border border-gray-400 p-2 rounded"
        placeholder="Barcelona"
      />
      <p className="text-red-500">{errors.destination?.message}</p>
      <label>Describe the intention of your trip</label>
      <textarea
        {...register("description")}
        rows={4}
        className="border border-gray-400 p-2 rounded"
        placeholder="Romantic getaway with the misses.."
      />
      <p className="text-red-500">{errors.description?.message}</p>

      <DateRangePicker
        label="Start and end date of trip"
        minValue={today(getLocalTimeZone())}
        onChange={(v) => {
          setValue("startDate", v.start.toString());
          setValue("endDate", v.end.toString());
        }}
        errorMessage={errors.startDate?.message || errors.endDate?.message}
      />

      <input
        type="submit"
        className=" bg-indigo-500 text-white rounded p-2"
        disabled={props.disabled}
      />

      <p className="text-gray-400">* We support trips of up to 3 days</p>
    </form>
  );
}
