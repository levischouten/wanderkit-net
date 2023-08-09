"use client";

import React from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start justify-center">
      <section className="flex flex-col gap-8 max-w-lg items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl lg:text-4xl font-bold">
            Elevate Your Travels with Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-indigo-500">
              Advanced Itinerary Builder
            </span>
          </h1>
          <p>
            Craft Your Perfect Trip - Effortlessly plan and personalize your
            journey with our Advanced Itinerary Builder. Unveil a new way to
            travel, enriched by AI-driven insights
          </p>
        </div>
        <Link
          href="/onboarding/destination"
          className=" bg-indigo-500 text-white rounded py-2 px-4 flex gap-2 items-center justify-center"
        >
          Get Started <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </section>
      <section>
        <Image
          src="/travelers.svg"
          alt="travelers"
          width={500}
          height={500}
          className="mt-6"
          priority
        />
      </section>
    </div>
  );
}
