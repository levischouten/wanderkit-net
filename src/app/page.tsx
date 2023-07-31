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

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [itinerary, setItinerary] = React.useState<ItineraryType | null>(null);

  const handleSubmit = (input: Input) => {
    getItinerary(input);
  };

  const handlePayment = async () => {
    if (!itinerary) {
      return;
    }

    const response = await fetch(`${process.env.URL}/api/checkout/`, {
      method: "post",
      body: JSON.stringify({ itineraryId: itinerary.id }),
    });

    const json = await response.json();

    if (!json.ok) {
      return;
    }

    const stripe = await getStripe();

    if (!stripe) {
      return;
    }

    await stripe.redirectToCheckout({ sessionId: json.result.id });
  };

  const getItinerary = async (data: Input) => {
    setIsLoading(true);
    setItinerary(null);

    const response = await fetch(`${process.env.URL}/api/itinerary/`, {
      method: "post",
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (json.ok) {
      setItinerary(itinerarySchema.parse(json.result));
    }

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
        <section className="p-6 rounded-lg shadow-md border-indigo-500 mask relative z-10 backdrop-blur-2xl after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-br after:from-indigo-500/80 after:via-indigo-500/40 after:to-indigo-500/80 after:p-[3px]">
          <Form onSubmit={handleSubmit} disabled={isLoading} />
        </section>
        {isLoading && (
          <div className="flex flex-col gap-4">
            <p className="mx-auto lg:mx-0">
              Preparing Your Perfect Trip, This may take a moment...
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 relative">
                <div className="w-1/2 h-5 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
                <div className="w-full h-16 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
              </div>
              <div className="flex flex-col gap-2 relative">
                <div className="w-1/2 h-5 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
                <div className="w-full h-28 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
              </div>
              <div className="flex flex-col gap-2 relative">
                <div className="w-1/2 h-5 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
                <div className="w-full h-8 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
                <div className="w-full h-16 bg-gray-100 rounded relative overflow-hidden rounded-2x before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent"></div>
              </div>
            </div>
          </div>
        )}
        {itinerary && (
          <Itinerary itinerary={itinerary.output} onSubmit={handlePayment} />
        )}
      </div>
    </main>
  );
}
