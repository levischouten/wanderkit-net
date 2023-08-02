"use client";

import {
  Itinerary as ItineraryType,
  Input,
  itinerary as itinerarySchema,
} from "./schema";
import React from "react";
import Form from "./components/Form";
import Itinerary from "./components/Itinerary";
import { getStripe } from "@/lib/stripe";
import Image from "next/image";
import ProgressBar from "@/components/ProgressBar";
import cn from "classnames";
import { toasts } from "@/components/Toast";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

function addErrorToast(title: string, description: string) {
  toasts.add(
    <div className="flex gap-4 items-center">
      <div className="rounded-full bg-red-200 p-2">
        <ExclamationTriangleIcon className="text-red-400 h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <h3 className="">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [itinerary, setItinerary] = React.useState<ItineraryType | null>(null);
  const [progress, setProgress] = React.useState(0);

  const handleSubmit = (input: Input) => {
    getItinerary(input);
  };

  const handlePayment = async () => {
    try {
      if (!itinerary) {
        throw new Error("Something went wrong");
      }

      const response = await fetch("api/checkout/", {
        method: "post",
        body: JSON.stringify({ itineraryId: itinerary.id }),
      });

      const json = await response.json();

      if (!json.ok) {
        throw new Error("Something went wrong");
      }

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error("Something went wrong");
      }

      await stripe.redirectToCheckout({ sessionId: json.result.id });
    } catch (error) {
      addErrorToast("Failed to start stransaction", "Please try again.");
    }
  };

  const getItinerary = async (data: Input) => {
    setIsLoading(true);
    setItinerary(null);

    // progress bar simulation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 30) {
          return p + 1;
        }
        return 30;
      });
    }, 1000);

    try {
      const response = await fetch("api/itinerary/", {
        method: "post",
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!json.ok) {
        throw new Error("Something went wrong");
      }

      if (json.ok) {
        setItinerary(itinerarySchema.parse(json.result));
      }
    } catch (error) {
      addErrorToast("Failed to create itinerary", "Please try again.");
    }

    setProgress(0);
    clearInterval(interval);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col w-full stretch gap-12">
      <section className="flex flex-col gap-2">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Your Smart Travel{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-500">
            Itinerary Generator
          </span>
        </h1>
        <p>
          Explore with WanderKit AI: Your Custom Travel Planner! Personalized
          Itineraries Made Simple.
        </p>
      </section>
      <div className="flex flex-col gap-16 lg:flex-row w-full lg:items-start">
        <section
          className={cn(
            "p-6 rounded-lg shadow-md border-indigo-500 mask relative backdrop-blur-2xl after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-br after:from-indigo-500/80 after:via-indigo-500/40 after:to-indigo-500/80 after:p-[3px]",
            {
              "hidden md:block": isLoading || !!itinerary,
            }
          )}
        >
          <Form onSubmit={handleSubmit} disabled={isLoading} />
        </section>

        <section
          className={cn(
            "w-full h-full flex flex-col gap-6 flex-1 items-center",
            {
              hidden: itinerary,
            }
          )}
        >
          <Image
            src="/travelers.svg"
            alt="travelers"
            width={500}
            height={0}
            className="mt-6"
          />
          {isLoading && (
            <div className="flex flex-col gap-2">
              <div className="">
                <ProgressBar value={progress} maxValue={31} />
              </div>
              <p className="mx-auto lg:mx-0 font-medium">
                Preparing Your Perfect Trip, This may take a moment...
              </p>
            </div>
          )}
        </section>
        {itinerary && (
          <Itinerary itinerary={itinerary.output} onSubmit={handlePayment} />
        )}
      </div>
    </main>
  );
}
