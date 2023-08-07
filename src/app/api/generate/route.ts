import { Configuration, OpenAIApi } from "openai-edge";
import { NextResponse } from "next/server";
import { output, input, createItineraries } from "@/app/schema";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { description, destination, endDate, startDate } = input.parse(body);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
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
          content: `write me an itinerary from ${startDate} till ${endDate} (these dates are in the following format "YYYY/MM/DD") for a trip to ${destination}; The intention of the trip is ${description}`,
          role: "user",
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion: string) {
        const parsedCompletion = output.parse(JSON.parse(completion));

        const createInput = createItineraries.parse({
          title: parsedCompletion.title,
          days: parsedCompletion.days,
          startDate,
          endDate,
          description,
          destination,
          activated: false,
        });

        fetch(`${process.env.URL}/api/itinerary`, {
          method: "POST",
          body: JSON.stringify(createInput),
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}
