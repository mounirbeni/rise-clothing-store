"use client";

import Link from "next/link";
import { CheckCircle2, CreditCard, Lock, Truck } from "lucide-react";
import { MobileNav, SiteFooter, SiteHeader } from "@/components/rise-storefront";
import { products } from "@/lib/rise-data";
import { formatCurrency } from "@/lib/format";

export default function Page() {
  const sampleItems = products.slice(0, 2);
  const subtotal = sampleItems.reduce((sum, product) => sum + product.price, 0);
  const shipping = 12;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Checkout</p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Secure checkout</h1>
          <div className="mt-8 grid gap-4">
            <CheckoutStep icon={<Truck size={18} />} title="Shipping address">
              <div className="grid gap-3 sm:grid-cols-2">
                {["First name", "Last name", "Email", "Phone", "Address", "City"].map((field) => (
                  <input key={field} placeholder={field} className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35" />
                ))}
              </div>
            </CheckoutStep>
            <CheckoutStep icon={<CreditCard size={18} />} title="Payment">
              <div className="grid gap-3">
                <div className="border border-white/15 p-4 text-sm leading-7 text-white/62">
                  Stripe Checkout is integrated through <code className="text-white">/api/checkout</code>. Add live keys to use hosted payment sessions.
                </div>
                <Link href="/order-confirmation" className="grid h-12 place-items-center bg-white text-sm font-black uppercase tracking-[0.18em] text-black">
                  Place order
                </Link>
              </div>
            </CheckoutStep>
          </div>
        </div>
        <aside className="h-fit border border-white/10 p-5 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-lg font-black uppercase"><Lock size={18} /> Order summary</h2>
          <div className="mt-5 grid gap-4">
            {sampleItems.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-white/45">{product.color}</p>
                </div>
                <p className="font-bold">{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label="Shipping" value={formatCurrency(shipping)} />
            <Row label="Taxes" value="Calculated" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-xl font-black">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </aside>
      </section>
      <SiteFooter />
      <MobileNav />
    </main>
  );
}

function CheckoutStep({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="border border-white/10 p-5">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-black uppercase tracking-[0.12em]">{icon} {title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-white/62">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
