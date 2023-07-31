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
      console.log(event.data.object);

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

      const email = await sendEmail(
        "Test",
        "<strong>some html</strong>",
        "some text",
        [new Recipient("MS_nV2Fmw@wanderkit.net", "Info")]
      );

      console.log({ email });
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
