import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById, lifetimeValue } from "@/lib/data/customers";
import { CustomerEditor } from "@/components/admin/customer-editor";
import { StatusBadge, MetricCard } from "@/components/admin/panel";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Customer detail" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Customer</p>
        <h1 className="mt-2 text-4xl font-black uppercase leading-none">{customer.name}</h1>
        <p className="mt-2 text-black/60">{customer.email}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Lifetime value" value={formatCurrency(lifetimeValue(customer.orders))} />
          <MetricCard label="Orders" value={String(customer.orders.length)} />
          <MetricCard label="Wishlist items" value={String(customer.wishlist.length)} />
        </div>

        <div className="mt-6 border border-black/10 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Orders</h2>
          <div className="mt-4 grid gap-3">
            {customer.orders.length === 0 ? (
              <p className="text-sm text-black/50">No orders yet.</p>
            ) : (
              customer.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between border-b border-black/8 pb-3 hover:opacity-70"
                >
                  <div>
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="text-xs uppercase tracking-[0.1em] text-black/45">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <p className="font-bold">{formatCurrency(order.total)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 border border-black/10 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Addresses</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-black/50">No saved addresses.</p>
            ) : (
              customer.addresses.map((address) => (
                <div key={address.id} className="border border-black/10 p-3 text-sm text-black/70">
                  <p className="font-bold text-black">{address.label}</p>
                  <p>
                    {address.line1}, {address.city}, {address.region} {address.postal}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CustomerEditor customerId={customer.id} tags={customer.tags} notes={customer.notes ?? ""} />
    </div>
  );
}
