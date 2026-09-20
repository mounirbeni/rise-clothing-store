"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, Lock, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";

const STEPS = ["Delivery", "Contact", "Payment", "Review"] as const;
type StepIndex = 0 | 1 | 2 | 3;

export function CheckoutClient() {
  const { lines, subtotal, clear, updateQuantity } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<StepIndex>(0);
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
  const [stepError, setStepError] = useState<string | null>(null);

  const estimatedShipping = subtotal >= 15000 ? 0 : 1200;
  const estimatedTax = Math.round(subtotal * 0.08);
  const estimatedTotal = subtotal + estimatedShipping + estimatedTax;

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  function validateStep(current: StepIndex) {
    if (current === 0) {
      if (!form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.region.trim() || !form.postal.trim()) {
        return "Fill in your full delivery address to continue.";
      }
    }
    if (current === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        return "Enter a valid email address.";
      }
    }
    return null;
  }

  function goNext() {
    const message = validateStep(step);
    if (message) {
      setStepError(message);
      return;
    }
    setStepError(null);
    setStep((s) => (s < 3 ? ((s + 1) as StepIndex) : s));
  }

  function goBack() {
    setStepError(null);
    setStep((s) => (s > 0 ? ((s - 1) as StepIndex) : s));
  }

  async function placeOrder() {
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

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Checkout</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl">Secure checkout</h1>
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingBag size={34} className="text-white/35" />}
            title="Your bag is empty"
            text="Add products to your bag before checking out."
          />
          <Link href="/shop" className="tap-scale mt-6 inline-flex h-12 items-center rounded-[20px] bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 pb-40 pt-24 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button
            aria-label="Back"
            onClick={goBack}
            className="tap-scale glass grid size-10 shrink-0 place-items-center rounded-full"
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <Link href="/" aria-label="Cancel checkout" className="tap-scale glass grid size-10 shrink-0 place-items-center rounded-full">
            <ChevronLeft size={18} />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
            Step {step + 1} of {STEPS.length}
          </p>
          <h1 className="text-xl font-black uppercase leading-none">{STEPS[step]}</h1>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${index <= step ? "bg-white" : "bg-white/15"}`} />
          </div>
        ))}
      </div>

      <div key={step} className="step-in mt-8">
        {step === 0 ? (
          <div className="glass grid gap-3 rounded-[20px] p-5">
            <input
              required
              placeholder="Full name"
              {...field("name")}
              className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
            />
            <input
              required
              placeholder="Address"
              {...field("line1")}
              className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="City"
                {...field("city")}
                className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
              />
              <input
                required
                placeholder="State / Region"
                {...field("region")}
                className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Postal code"
                {...field("postal")}
                className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
              />
              <input
                required
                placeholder="Country"
                {...field("country")}
                className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="glass grid gap-3 rounded-[20px] p-5">
            <p className="text-sm text-white/55">We'll send your order confirmation and shipping updates here.</p>
            <input
              required
              type="email"
              placeholder="Email address"
              {...field("email")}
              className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4">
            <div className="glass rounded-[20px] p-5">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em]">
                <CreditCard size={16} /> Payment method
              </div>
              <div className="mt-4 flex h-14 items-center justify-between rounded-[20px] border border-white bg-white/5 px-4">
                <span className="text-sm font-bold">Card / Stripe secure checkout</span>
                <span className="grid size-5 place-items-center rounded-full bg-white">
                  <Check size={13} className="text-black" />
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Enter your card details on the next secure screen. No card data is stored on RISE servers.
              </p>
            </div>
            <div className="glass rounded-[20px] p-5">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.12em]">Discount code</p>
              <input
                placeholder="Optional"
                value={form.discountCode}
                onChange={(e) => setForm((f) => ({ ...f, discountCode: e.target.value.toUpperCase() }))}
                className="h-12 w-full rounded-[20px] border border-white/15 bg-transparent px-4 uppercase outline-none placeholder:normal-case placeholder:text-white/35"
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4">
            <div className="glass grid gap-4 rounded-[20px] p-5">
              {lines.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[20px] bg-zinc-900">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-xs text-white/45">Size {item.size}</p>
                      </div>
                      <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Remove one ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.size, -1)}
                        className="glass tap-scale grid size-7 place-items-center rounded-full"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        aria-label={`Add one ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.size, 1)}
                        className="glass tap-scale grid size-7 place-items-center rounded-full"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(0)} className="glass flex items-center justify-between rounded-[20px] p-5 text-left">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-white/45">Deliver to</p>
                <p className="mt-1 text-sm font-bold">{form.name}</p>
                <p className="text-sm text-white/60">
                  {form.line1}, {form.city}, {form.region} {form.postal}
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.1em] text-white/50">Edit</span>
            </button>

            <button onClick={() => setStep(1)} className="glass flex items-center justify-between rounded-[20px] p-5 text-left">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-white/45">Contact</p>
                <p className="mt-1 text-sm font-bold">{form.email}</p>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.1em] text-white/50">Edit</span>
            </button>

            <div className="glass rounded-[20px] p-5">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em]">
                <Lock size={15} /> Order total
              </h2>
              <div className="mt-4 grid gap-2 text-sm">
                <Row label="Subtotal" value={formatCurrency(subtotal)} />
                <Row label="Shipping" value={estimatedShipping === 0 ? "Free" : formatCurrency(estimatedShipping)} />
                <Row label="Taxes (est.)" value={formatCurrency(estimatedTax)} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-black">
                <span>Total</span>
                <span>{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>
        ) : null}

        {stepError ? <p className="mt-3 text-sm text-red-400">{stepError}</p> : null}
      </div>

      <div className="safe-bottom safe-x fixed inset-x-0 bottom-0 z-30 px-3 pb-3">
        <div className="glass-strong mx-auto flex w-full max-w-2xl items-center gap-3 rounded-[20px] p-3">
          {step < 3 ? (
            <button
              onClick={goNext}
              className="tap-scale grid h-12 w-full place-items-center rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              Continue
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={placeOrder}
              className="tap-scale grid h-12 w-full place-items-center rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black disabled:opacity-50"
            >
              {submitting ? "Placing order..." : `Place order / ${formatCurrency(estimatedTotal)}`}
            </button>
          )}
        </div>
      </div>
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
