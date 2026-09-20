import { Heart, MapPin, Settings, ShoppingBag, User } from "lucide-react";
import { MobileNav, SiteFooter, SiteHeader } from "@/components/rise-storefront";
import { orders, products } from "@/lib/rise-data";
import { formatCurrency } from "@/lib/format";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Customer account</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Maya Chen</h1>
        <div className="mt-10 grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit border border-white/10 p-5">
            {[
              ["Profile settings", User],
              ["Order history", ShoppingBag],
              ["Saved addresses", MapPin],
              ["Wishlist", Heart],
              ["Preferences", Settings],
            ].map(([label, Icon]) => (
              <a key={label as string} href={`#${String(label).toLowerCase().replaceAll(" ", "-")}`} className="flex h-12 items-center gap-3 border-b border-white/10 text-sm font-black uppercase tracking-[0.12em] text-white/66">
                <Icon size={17} /> {label as string}
              </a>
            ))}
          </aside>
          <div className="grid gap-5">
            <section id="order-history" className="border border-white/10 p-5">
              <h2 className="text-2xl font-black uppercase">Order history</h2>
              <div className="mt-5 grid gap-3">
                {orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="grid gap-2 border border-white/10 p-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-black">{order.id} / {order.status}</p>
                      <p className="mt-1 text-sm text-white/50">{order.items}</p>
                    </div>
                    <p className="font-black">{formatCurrency(order.total)}</p>
                  </div>
                ))}
              </div>
            </section>
            <section id="wishlist" className="border border-white/10 p-5">
              <h2 className="text-2xl font-black uppercase">Wishlist</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="border border-white/10 p-4">
                    <p className="font-black">{product.name}</p>
                    <p className="mt-2 text-sm text-white/50">{formatCurrency(product.price)} / {product.color}</p>
                  </div>
                ))}
              </div>
            </section>
            <section id="saved-addresses" className="border border-white/10 p-5">
              <h2 className="text-2xl font-black uppercase">Saved addresses</h2>
              <p className="mt-4 leading-7 text-white/62">184 Mercer St, New York, NY / Default shipping address</p>
            </section>
            <section id="profile-settings" className="border border-white/10 p-5">
              <h2 className="text-2xl font-black uppercase">Profile settings</h2>
              <p className="mt-4 leading-7 text-white/62">Maya Chen / maya@example.com / SMS fulfillment alerts enabled</p>
            </section>
          </div>
        </div>
      </section>
      <SiteFooter />
      <MobileNav />
    </main>
  );
}
