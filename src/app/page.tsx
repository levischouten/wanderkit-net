"use client";

import {
  Itinerary as ItineraryType,
  Input,
  itinerary as itinerarySchema,
} from "./schema";
import React from "react";
import Form from "./components/Form";
import Itinerary from "./components/Itinerary";
import Button from "@/components/Button";
import { getStripe } from "./lib/stripe";
import { it } from "node:test";

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

    const response = await fetch("http://localhost:3000/api/checkout/", {
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

    const response = await fetch("http://localhost:3000/api/itinerary/", {
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
    <main className="flex flex-col w-full p-6 lg:p-12 md:max-w-xl lg:max-w-7xl mx-auto pb-24 stretch gap-12 ">
      <header>
        <h2 className="font-bold text-xl">Tripwise</h2>
      </header>
      <section className="flex flex-col gap-2">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Your Smart Travel{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-500">
            Itinerary Generator
          </span>
        </h1>
        <p>
          Unlock Adventure with Tripwise AI! Personalized Travel Itineraries
          Made Easy.
        </p>
      </section>
      <div className="flex flex-col gap-16 lg:flex-row w-full lg:items-start">
        <section className="border-2 p-4 rounded-lg shadow-md border-indigo-500 bg-white">
          <Form onSubmit={handleSubmit} disabled={isLoading} />
        </section>
        {isLoading && (
          <p className="mx-auto lg:mx-0">
            Preparing Your Perfect Trip, This may take a moment...
          </p>
        )}
        {itinerary && (
          <Itinerary itinerary={itinerary.output} onSubmit={handlePayment} />
        )}
      </div>
    </main>
  );
}
