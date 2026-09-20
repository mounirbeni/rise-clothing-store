import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, LogOut, MapPin, ShoppingBag, User } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { getSession } from "@/lib/auth";
import { getCustomerById, lifetimeValue } from "@/lib/data/customers";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "My account" };

export default async function Page() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/account/login");

  const customer = await getCustomerById(session.id);
  if (!customer) redirect("/account/login");

  const links = [
    ["Order history", ShoppingBag, "/account/orders"],
    ["Saved addresses", MapPin, "/account/addresses"],
    ["Wishlist", Heart, "/account/wishlist"],
    ["Profile settings", User, "/account/profile"],
  ] as const;

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Customer account</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">{customer.name}</h1>
        <p className="mt-3 text-white/50">{customer.email}</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit panel rounded-[20px] p-5">
            {links.map(([label, Icon, href]) => (
              <Link
                key={label}
                href={href}
                className="flex h-12 items-center gap-3 border-b border-white/10 text-sm font-black uppercase tracking-[0.12em] text-white/66 hover:text-white"
              >
                <Icon size={17} /> {label}
              </Link>
            ))}
            <form action="/api/auth/logout" method="post">
              <button className="flex h-12 w-full items-center gap-3 pt-3 text-sm font-black uppercase tracking-[0.12em] text-white/45 hover:text-white">
                <LogOut size={17} /> Sign out
              </button>
            </form>
          </aside>
          <div className="grid gap-5">
            <section className="panel rounded-[20px] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase">Overview</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Stat label="Orders" value={String(customer.orders.length)} />
                <Stat label="Lifetime value" value={formatCurrency(lifetimeValue(customer.orders))} />
                <Stat label="Wishlist items" value={String(customer.wishlist.length)} />
              </div>
            </section>
            <section className="panel rounded-[20px] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase">Recent orders</h2>
                <Link href="/account/orders" className="text-sm font-black uppercase tracking-[0.12em] text-white/60 hover:text-white">
                  View all
                </Link>
              </div>
              <div className="mt-5 grid gap-3">
                {customer.orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="grid gap-2 panel rounded-[20px] p-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-black">
                        {order.orderNumber} / {order.status.replace("_", " ")}
                      </p>
                      <p className="mt-1 text-sm text-white/50">{formatDate(order.createdAt)}</p>
                    </div>
                    <p className="font-black">{formatCurrency(order.total)}</p>
                  </div>
                ))}
                {customer.orders.length === 0 ? (
                  <p className="text-white/50">No orders yet. Your purchases will appear here.</p>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel rounded-[20px] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
