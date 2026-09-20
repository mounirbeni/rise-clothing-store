import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { products } from "@/lib/rise-data";

const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive(), size: z.string() })).min(1),
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      mode: "demo",
      checkoutUrl: "/order-confirmation",
      message: "Set STRIPE_SECRET_KEY to create a live Stripe Checkout session.",
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    line_items: parsed.data.items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) {
        throw new Error(`Unknown product ${item.productId}`);
      }
      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.price * 100,
          product_data: {
            name: `${product.name} / ${item.size}`,
            images: [`${origin}${product.images[0]}`],
          },
        },
      };
    }),
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
