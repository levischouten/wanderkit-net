"use client";

import {
  Itinerary as ItineraryResponse,
  itinerary as itinerarySchema,
  Schema,
} from "./schema";
import React from "react";
import Form from "./components/Form";
import Itinerary from "./components/Itinerary";
// import Background from "@/app/assets/lisbon.svg";

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [itinerary, setItinerary] = React.useState<ItineraryResponse | null>(
    null
  );

  const getItinirary = async (data: Schema) => {
    setIsLoading(true);
    setItinerary(null);

    const response = await fetch("http://localhost:3000/api/itinerary/", {
      method: "post",
      body: JSON.stringify({ ...data }),
    });

    const json = await response.json();

    setIsLoading(false);
    setItinerary(itinerarySchema.parse(json.result));
  };

  // background image
  // before:bg-[url('./assets/topography.svg')] before:z-[-10] before:w-full before:h-full before:absolute before:opacity-5 before:top-0 before:right-0 before:bg-[size:100px] before:fill-indigo-500 before:text-red-600

  return (
    <main className="flex flex-col w-full p-6 lg:p-12 md:max-w-xl lg:max-w-7xl mx-auto pb-24 stretch gap-12 ">
      <header>
        <h2 className="font-bold text-xl">Tripwise</h2>
      </header>
      <section className="flex flex-col gap-2">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Your Smart Travel{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-500">
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
          <Form onSubmit={getItinirary} disabled={isLoading} />
        </section>
        {isLoading && (
          <p className="mx-auto lg:mx-0">
            Preparing Your Perfect Adventure, Just a Moment...
          </p>
        )}
        {itinerary && <Itinerary itinerary={itinerary.itinerary} />}
      </div>
    </main>
  );
}
