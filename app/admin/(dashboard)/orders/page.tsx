import Link from "next/link";
import { Panel, AdminEmptyState, StatusBadge } from "@/components/admin/panel";
import { listOrders } from "@/lib/data/orders";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Orders" };

const statuses = ["All", "pending", "paid", "in_fulfillment", "fulfilled", "refunded", "cancelled"];

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const orders = await listOrders({ status, q });

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Fulfillment</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none">Orders</h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by order # or email"
          className="h-10 w-72 border border-black/15 bg-white px-3 text-sm outline-none"
        />
        <button className="h-10 border border-black/15 px-4 text-xs font-black uppercase tracking-[0.12em]">Search</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {statuses.map((option) => (
          <Link
            key={option}
            href={`/admin/orders?status=${option}${q ? `&q=${q}` : ""}`}
            className={`inline-flex h-9 items-center border px-3 text-xs font-black uppercase tracking-[0.1em] ${
              (status || "All") === option ? "border-black bg-black text-white" : "border-black/15 text-black/60"
            }`}
          >
            {option.replace("_", " ")}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Panel title={`${orders.length} orders`}>
          {orders.length === 0 ? (
            <AdminEmptyState title="No orders found" text="Orders will appear here as customers check out." />
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="grid gap-3 border border-black/10 bg-white p-4 transition hover:border-black/30 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black">{order.orderNumber}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-sm text-black/60">
                      {order.email} / {order.items.map((item) => item.name).join(", ")}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-black/45">
                      {formatDate(order.createdAt)} {order.trackingNumber ? `/ Tracking: ${order.trackingNumber}` : ""}
                    </p>
                  </div>
                  <p className="font-black">{formatCurrency(order.total)}</p>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
