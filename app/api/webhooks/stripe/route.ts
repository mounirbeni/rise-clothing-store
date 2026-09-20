import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { createOrder } from "@/lib/data/checkout";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;

  if (!secret || !key) {
    return NextResponse.json({ received: true, mode: "demo" });
  }

  const stripe = new Stripe(key);
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const metadata = checkoutSession.metadata;

    if (metadata?.items) {
      const existing = await prisma.order.findFirst({ where: { stripeSession: checkoutSession.id } });
      if (!existing) {
        await createOrder({
          items: JSON.parse(metadata.items),
          email: metadata.email || checkoutSession.customer_email || "unknown@rise.test",
          userId: metadata.userId || null,
          shipping: JSON.parse(metadata.shipping || "{}"),
          discountCode: metadata.discountCode || null,
          stripeSession: checkoutSession.id,
          status: "paid",
        });
      }
    }
  }

  return NextResponse.json({ received: true, type: event.type });
}
