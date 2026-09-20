"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Lock, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";

export function CheckoutClient() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    name: "",
    line1: "",
    city: "",
    region: "",
    postal: "",
    country: "United States",
    discountCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimatedShipping = subtotal >= 15000 ? 0 : 1200;
  const estimatedTax = Math.round(subtotal * 0.08);
  const estimatedTotal = subtotal + estimatedShipping + estimatedTax;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({ productId: line.id, size: line.size, quantity: line.quantity })),
          email: form.email,
          discountCode: form.discountCode || undefined,
          shipping: {
            name: form.name,
            line1: form.line1,
            city: form.city,
            region: form.region,
            postal: form.postal,
            country: form.country,
          },
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Checkout failed");
      clear();
      router.push(body.checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Checkout</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Secure checkout</h1>

        {lines.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<ShoppingBag size={34} className="text-white/35" />}
              title="Your bag is empty"
              text="Add products to your bag before checking out."
            />
            <Link href="/shop" className="mt-6 inline-flex h-12 items-center bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
              Continue shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-4">
            <CheckoutStep icon={<Truck size={18} />} title="Contact & shipping">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35 sm:col-span-2"
                />
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35 sm:col-span-2"
                />
                <input
                  required
                  placeholder="Address"
                  value={form.line1}
                  onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35 sm:col-span-2"
                />
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35"
                />
                <input
                  required
                  placeholder="State / Region"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35"
                />
                <input
                  required
                  placeholder="Postal code"
                  value={form.postal}
                  onChange={(e) => setForm((f) => ({ ...f, postal: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35"
                />
                <input
                  required
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="h-12 border border-white/15 bg-transparent px-3 outline-none placeholder:text-white/35"
                />
              </div>
            </CheckoutStep>
            <CheckoutStep icon={<CreditCard size={18} />} title="Payment">
              <div className="grid gap-3">
                <input
                  placeholder="Discount code (optional)"
                  value={form.discountCode}
                  onChange={(e) => setForm((f) => ({ ...f, discountCode: e.target.value.toUpperCase() }))}
                  className="h-12 border border-white/15 bg-transparent px-3 uppercase outline-none placeholder:normal-case placeholder:text-white/35"
                />
                <div className="border border-white/15 p-4 text-sm leading-7 text-white/62">
                  Stripe Checkout is integrated through <code className="text-white">/api/checkout</code>. Without
                  live keys, orders are confirmed instantly in demo mode.
                </div>
                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                <button
                  disabled={submitting}
                  className="grid h-12 place-items-center bg-white text-sm font-black uppercase tracking-[0.18em] text-black disabled:opacity-50"
                >
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </div>
            </CheckoutStep>
          </form>
        )}
      </div>
      <aside className="h-fit border border-white/10 p-5 lg:sticky lg:top-24">
        <h2 className="flex items-center gap-2 text-lg font-black uppercase"><Lock size={18} /> Order summary</h2>
        <div className="mt-5 grid gap-4">
          {lines.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-white/45">Size {item.size} / Qty {item.quantity}</p>
              </div>
              <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-2 text-sm">
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          <Row label="Shipping" value={estimatedShipping === 0 ? "Free" : formatCurrency(estimatedShipping)} />
          <Row label="Taxes (est.)" value={formatCurrency(estimatedTax)} />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-xl font-black">
          <span>Total</span>
          <span>{formatCurrency(estimatedTotal)}</span>
        </div>
      </aside>
    </section>
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
