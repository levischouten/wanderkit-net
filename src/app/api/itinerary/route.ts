import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { itinerary, schema } from "@/app/schema";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  // return NextResponse.json({
  //   result: {
  //     itinerary: {
  //       title: "Romantic Getaway in Rome",
  //       days: [
  //         {
  //           date: "Sun, Jul 30 2023",
  //           activities: [
  //             {
  //               time: "17:00",
  //               description: "Arrive in Rome",
  //               title: "Arrival",
  //             },
  //             {
  //               time: "19:00",
  //               description:
  //                 "Enjoy a romantic dinner at a local Italian restaurant",
  //               title: "Dinner",
  //             },
  //             {
  //               time: "21:00",
  //               description: "Go for a leisurely stroll in the city center",
  //               title: "City Stroll",
  //             },
  //           ],
  //         },
  //         {
  //           date: "Mon, Jul 31 2023",
  //           activities: [
  //             {
  //               time: "09:00",
  //               description: "Savor a delightful breakfast at a charming cafe",
  //               title: "Breakfast",
  //             },
  //             {
  //               time: "10:00",
  //               description:
  //                 "Embark on a shopping spree in the fashionable boutiques",
  //               title: "Shopping",
  //             },
  //             {
  //               time: "13:00",
  //               description:
  //                 "Indulge in a traditional Italian lunch at a trattoria",
  //               title: "Lunch",
  //             },
  //             {
  //               time: "15:00",
  //               description:
  //                 "Visit the iconic Colosseum and explore the Roman Forum",
  //               title: "Sightseeing",
  //             },
  //             {
  //               time: "19:00",
  //               description:
  //                 "Dine at a rooftop restaurant with panoramic views of the city",
  //               title: "Dinner",
  //             },
  //             {
  //               time: "21:00",
  //               description:
  //                 "Take a romantic evening walk along the Tiber River",
  //               title: "River Walk",
  //             },
  //           ],
  //         },
  //         {
  //           date: "Tue, Aug 01 2023",
  //           activities: [
  //             {
  //               time: "09:00",
  //               description: "Enjoy a leisurely breakfast at a local cafe",
  //               title: "Breakfast",
  //             },
  //             {
  //               time: "11:00",
  //               description:
  //                 "Explore the Vatican Museums and St. Peter's Basilica",
  //               title: "Sightseeing",
  //             },
  //             {
  //               time: "13:00",
  //               description:
  //                 "Have a romantic lunch at a charming Italian bistro",
  //               title: "Lunch",
  //             },
  //             {
  //               time: "15:00",
  //               description:
  //                 "Indulge in some retail therapy at the high-end fashion stores",
  //               title: "Shopping",
  //             },
  //             {
  //               time: "18:00",
  //               description: "Relax and unwind with a couples spa treatment",
  //               title: "Spa",
  //             },
  //             {
  //               time: "20:00",
  //               description: "Enjoy a candlelit dinner at a cozy trattoria",
  //               title: "Dinner",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  //   status: "ok",
  // });

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
            "itinerary": {
              "title": "",
              "days": [
                {
                  "date": "",
                  "activities": [
                    {
                      "time": "",
                      "description": "",
                      title: ""
                    }
                  ]
                }
              ]
            }
          }
          `,
          role: "user",
        },
      ],
    });

    const json = await response.json();

    console.log({ json });

    const rawResult = json.choices[0];
    const parsedResult = JSON.parse(rawResult.message.content);

    const result = itinerary.parse(parsedResult);

    return NextResponse.json({ result, status: "ok" });
  } catch (error) {
    return NextResponse.json({ result: error, status: "error" });
  }
}
