"use client";

import { Destination, destination } from "@/app/schema";
import Button from "@/components/Button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalState, useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

function updateDestination(state: GlobalState, destination: Destination) {
  return { ...state, destination };
}

export default function Form() {
  const router = useRouter();

  const { actions, state } = useStateMachine({ updateDestination });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Destination>({
    resolver: zodResolver(destination),
    defaultValues: state.destination,
  });

  const onSubmit = (data: Destination) => {
    actions.updateDestination(data);
    router.push(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL!);
  };

  return (
    <div className="px-8 py-12 rounded bg-white max-w-lg flex flex-col gap-8 mx-auto mt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Destination</h1>
        <p>
          We will use AI to generate a starting point for your itinerary, for
          this we need some information.
        </p>
        <p>Not to worry, there are only 3 steps!</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
          placeholder="Family trip with lots of nice dinners"
        />
        <p className="text-red-500">{errors.description?.message}</p>

        <Button
          type="submit"
          className=" bg-indigo-500 text-white rounded p-2 flex gap-2 items-center justify-center"
        >
          Next step <ArrowRightIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
