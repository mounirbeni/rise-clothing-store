import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { getOrderById } from "@/lib/data/orders";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Order confirmed" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const { order: orderId, session_id: stripeSessionId } = await searchParams;

  const order = orderId
    ? await getOrderById(orderId)
    : stripeSessionId
      ? await prisma.order.findFirst({ where: { stripeSession: stripeSessionId }, include: { items: true } })
      : null;

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <CheckCircle2 size={48} className="mx-auto" />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-white/45">
          {order ? order.orderNumber : "Order pending"}
        </p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">
          {order ? "Order confirmed" : "Payment processing"}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/64">
          {order
            ? "Your RISE order is queued for fulfillment. Tracking, invoice, and delivery updates will appear in your account area."
            : "We're finalizing your payment confirmation. If you paid with Stripe, this page updates automatically once the webhook is received."}
        </p>
        {order ? (
          <div className="mx-auto mt-8 grid max-w-md gap-2 glass rounded-[20px] p-5 text-left text-sm text-white/70">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} / {item.size} x{item.quantity}</span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-black text-white">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/account" className="tap-scale grid h-12 place-items-center rounded-[20px] bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
            View account
          </Link>
          <Link href="/shop" className="grid h-12 place-items-center rounded-[20px] border border-white/15 px-6 text-sm font-black uppercase tracking-[0.18em]">
            Continue shopping
          </Link>
        </div>
      </section>
    </StorefrontShell>
  );
}
