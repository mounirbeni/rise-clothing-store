import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "@/lib/data/customers";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Order history" };

export default async function Page() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/account/login");
  const customer = await getCustomerById(session.id);
  if (!customer) redirect("/account/login");

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Account</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl">Order history</h1>
        <div className="mt-10 grid gap-4">
          {customer.orders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={34} className="text-white/35" />}
              title="No orders yet"
              text="Your completed orders will appear here with tracking and status."
            />
          ) : (
            customer.orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="tap-scale grid gap-3 panel rounded-[20px] p-5 transition sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">{order.orderNumber}</p>
                    <span className="rounded-[20px] border border-white/15 px-2 py-1 text-xs font-black uppercase">
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/50">
                    {order.items.map((item) => item.name).join(", ")}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/40">{formatDate(order.createdAt)}</p>
                </div>
                <p className="font-black">{formatCurrency(order.total)}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </StorefrontShell>
  );
}
