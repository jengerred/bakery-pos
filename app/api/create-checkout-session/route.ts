import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "POS Order" },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost/pos?success=true",
    cancel_url: "http://localhost/pos?canceled=true",
  });

  return NextResponse.json({ url: session.url });
}
