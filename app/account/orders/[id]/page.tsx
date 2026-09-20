import { notFound, redirect } from "next/navigation";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/data/orders";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Order detail" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/account/login");

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order || order.userId !== session.id) notFound();

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Order detail</p>
        <h1 className="mt-4 text-2xl font-black uppercase leading-none sm:text-3xl">{order.orderNumber}</h1>
        <p className="mt-3 text-white/50">
          Placed {formatDate(order.createdAt)} / Status {order.status.replace("_", " ")}
        </p>
        {order.trackingNumber ? (
          <p className="mt-1 text-sm text-white/50">Tracking: {order.trackingNumber}{order.carrier ? ` via ${order.carrier}` : ""}</p>
        ) : null}
        <div className="mt-8 grid gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between panel rounded-[20px] p-4">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-white/45">Size {item.size} / Qty {item.quantity}</p>
              </div>
              <p className="font-bold">{formatCurrency(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-2 border-t border-white/10 pt-6 text-sm text-white/70">
          <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
          <Row label="Shipping" value={formatCurrency(order.shipping)} />
          <Row label="Tax" value={formatCurrency(order.tax)} />
          {order.discountAmount ? <Row label={`Discount (${order.discountCode})`} value={`-${formatCurrency(order.discountAmount)}`} /> : null}
          <div className="flex justify-between border-t border-white/10 pt-3 text-xl font-black text-white">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
