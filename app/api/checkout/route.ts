import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createOrder, priceCart } from "@/lib/data/checkout";

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), size: z.string(), quantity: z.number().int().positive() }))
    .min(1),
  email: z.string().email(),
  discountCode: z.string().optional(),
  shipping: z.object({
    name: z.string().min(2),
    line1: z.string().min(3),
    city: z.string().min(1),
    region: z.string().min(1),
    postal: z.string().min(1),
    country: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const session = await getSession();
  const userId = session?.role === "customer" ? session.id : null;

  let priced;
  try {
    priced = await priceCart(parsed.data.items, parsed.data.discountCode);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to price cart" }, { status: 409 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    const order = await createOrder({
      items: parsed.data.items,
      email: parsed.data.email,
      userId,
      shipping: parsed.data.shipping,
      discountCode: parsed.data.discountCode,
      status: "paid",
    });

    return NextResponse.json({
      mode: "demo",
      checkoutUrl: `/order-confirmation?order=${order.id}`,
      orderId: order.id,
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: parsed.data.email,
    success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    line_items: priced.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        unit_amount: line.product.price,
        product_data: {
          name: `${line.product.name} / ${line.variant.size}`,
        },
      },
    })),
    metadata: {
      items: JSON.stringify(parsed.data.items),
      email: parsed.data.email,
      userId: userId ?? "",
      discountCode: parsed.data.discountCode ?? "",
      shipping: JSON.stringify(parsed.data.shipping),
    },
  });

  return NextResponse.json({ mode: "stripe", checkoutUrl: stripeSession.url });
}
