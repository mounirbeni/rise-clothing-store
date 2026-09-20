import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { getSession, isStaffRole, type AdminRole } from "@/lib/auth";
import { OrderUpdateForm } from "@/components/admin/order-update-form";
import { StatusBadge } from "@/components/admin/panel";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Order detail" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !isStaffRole(session.role)) redirect("/admin/login");

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Order</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-black uppercase leading-none">{order.orderNumber}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-3 text-black/60">
          {order.email} / Placed {formatDate(order.createdAt)}
        </p>

        <div className="mt-6 border border-black/10 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Items</h2>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-black/8 pb-3">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-black/50">Size {item.size} / Qty {item.quantity}</p>
                </div>
                <p className="font-bold">{formatCurrency(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-sm text-black/70">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            <Row label="Shipping" value={formatCurrency(order.shipping)} />
            <Row label="Tax" value={formatCurrency(order.tax)} />
            {order.discountAmount ? (
              <Row label={`Discount (${order.discountCode})`} value={`-${formatCurrency(order.discountAmount)}`} />
            ) : null}
            <div className="flex justify-between border-t border-black/10 pt-2 text-lg font-black text-black">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-black/10 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Shipping address</h2>
          <p className="mt-3 leading-7 text-black/70">
            {order.shippingName}
            <br />
            {order.shippingLine1}
            <br />
            {order.shippingCity}, {order.shippingRegion} {order.shippingPostal}
            <br />
            {order.shippingCountry}
          </p>
        </div>

        {order.customerNotes ? (
          <div className="mt-6 border border-black/10 bg-white p-5">
            <h2 className="text-sm font-black uppercase tracking-[0.14em]">Customer notes</h2>
            <p className="mt-3 leading-7 text-black/70">{order.customerNotes}</p>
          </div>
        ) : null}
      </div>

      <OrderUpdateForm
        orderId={order.id}
        status={order.status}
        trackingNumber={order.trackingNumber ?? ""}
        carrier={order.carrier ?? ""}
        internalNote={order.internalNote ?? ""}
        role={session.role as AdminRole}
      />
    </div>
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
