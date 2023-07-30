import { client } from "@/app/lib/mongodb";
import {
  schema as inputSchema,
  itinerary as itinerarySchema,
} from "@/app/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await client.connect();
    const db = client.db("tripwire");

    const { input, itinerary } = await req.json();

    const parsedInput = inputSchema.parse(input);
    const parsedItinerary = itinerarySchema.parse(itinerary);

    const result = await db.collection("itinerary").insertOne({
      input: parsedInput,
      itinerary: parsedItinerary,
    });

    return NextResponse.json({ result, status: "ok" });
  } catch (error) {
    return NextResponse.json({ result: error, status: "error" });
  }
}
