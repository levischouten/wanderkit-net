import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { itinerary, schema } from "@/app/schema";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = schema.parse(body);

    const { destination, startDate, endDate, description } = parsedBody;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          content: `write me a detailed itinerary from ${startDate} till ${endDate} (these dates are in the following format "YYYY/MM/DD") for a trip to ${destination}; The intention of the trip is ${description};

          be descriptive and recommend specific areas for activities.
          
          always respond in the following json format, where 'time' is either morning, afternoon, or evening:
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
          role: "user",
        },
      ],
    });

    const json = await response.json();

    const rawResult = json.choices[0];
    const parsedItinerary = JSON.parse(rawResult.message.content);

    const result = itinerary.parse(parsedItinerary);

    return NextResponse.json({ result, status: "ok" });
  } catch (error) {
    return NextResponse.json({ result: error, status: "error" });
  }
}
