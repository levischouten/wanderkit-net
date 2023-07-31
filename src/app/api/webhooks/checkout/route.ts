import { sendEmail } from "@/lib/mailersend";
import { client } from "@/lib/mongodb";
import { Recipient } from "mailersend";
import Cors from "micro-cors";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details.email) {
        throw new Error(`missing user email, ${event.id}`);
      }

      if (!event.data.object.metadata.itinerary_id) {
        throw new Error(`missing itinerary_id on metadata, ${event.id}`);
      }

      await client.connect();
      const db = client.db("wonderkit");

      await db.collection("itinerary").updateOne(
        { _id: new ObjectId(event.data.object.metadata.itinerary_id) },
        {
          $set: {
            activated: true,
          },
        }
      );

      await sendEmail(
        "Thank you for your purchase!",
        `
        <h1>Thank you for your purchase!</h1>
        <p>You can view your itinerary at the following link at any time</p>
        <a href="${process.env.URL}/itinerary/${event.data.object.metadata.itinerary_id}">${process.env.URL}/itinerary/${event.data.object.metadata.itinerary_id}</a>

        <p>Greetings, Wanderkit</p>
      `,
        [
          new Recipient(
            event.data.object.customer_details.email,
            "Thank you for your purchase - Wanderkit"
          ),
        ]
      );
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}
