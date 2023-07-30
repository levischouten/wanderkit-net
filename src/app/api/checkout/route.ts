import { CURRENCY, formatAmountForStripe } from "@/app/lib/stripe";
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.itineraryId) {
      throw new Error("Missing itinerary_id");
    }

    const headersList = headers();
    const origin = headersList.get("origin");

    const params: Stripe.Checkout.SessionCreateParams = {
      submit_type: "pay",
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Custom amount donation",
            },
            unit_amount: 100,
          },
        },
      ],
      metadata: {
        itinerary_id: body.itineraryId,
      },
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    };

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}
