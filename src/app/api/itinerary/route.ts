import { Configuration, OpenAIApi } from "openai-edge";
import { NextResponse } from "next/server";
import { output, input, itinerary } from "@/app/schema";
import { client } from "@/lib/mongodb";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedInput = input.parse(body);

    await client.connect();
    const db = client.db("wanderkit");

    const { destination, startDate, endDate, description } = parsedInput;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          content: `You are a travel planner that will generate itineraries.

          name specific areas, locations, shops and restaurants. They always arrive in the morning of the first day and the departure should not be mentioned.

          always respond in the following json format, where 'time' can be 'morning', 'afternoon', 'evening' or 'night'. every day should have at least a morning, an afternoon and a night.
          {
            "title": "",
            "days": [
              {
                "date": "",
                "activities": [
                  {
                    "time": "",
                    "description": "",
                    "title": ""
                  }
                ]
              }
            ]
          }
          `,
          role: "system",
        },
        {
          content: `write me an itinerary from ${startDate} till ${endDate} (these dates are in the following format "YYYY/MM/DD") for a trip to ${destination}; The intention of the trip is ${description};`,
          role: "user",
        },
      ],
    });

    const json = await response.json();

    const rawOutput = JSON.parse(json.choices[0].message.content);
    const parsedOutput = output.parse(rawOutput);

    const { insertedId } = await db.collection("itinerary").insertOne({
      input: parsedInput,
      output: parsedOutput,
      activated: false,
    });

    const result = itinerary.parse({
      id: insertedId.toString(),
      input: parsedInput,
      output: parsedOutput,
      activated: false,
    });

    return NextResponse.json({ result, ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}
