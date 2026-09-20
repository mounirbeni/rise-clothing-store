"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, HelpCircle, Lock, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";

const STEPS = ["Shipping", "Review", "Payment"] as const;
type StepIndex = 0 | 1 | 2;

function deliveryEstimate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

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

  function validateShipping() {
    if (!form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.region.trim() || !form.postal.trim()) {
      return "Fill in your full delivery address to continue.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Enter a valid email address.";
    }
    return null;
  }

  function goToReview() {
    const message = validateShipping();
    if (message) {
      setStepError(message);
      return;
    }
    setStepError(null);
    setStep(1);
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
    <section className="relative mx-auto max-w-2xl pb-40">
      {step === 1 ? (
        <div className="absolute inset-x-0 top-0 z-0 h-64 overflow-hidden">
          <Image src="/images/hero/hero-hoodie-summit.png" alt="" fill sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[#050505]" />
          <p className="absolute right-4 top-1/2 -translate-y-1/2 text-right text-[10px] font-black uppercase leading-[1.15] tracking-[0.08em] text-white/25">
            More
            <br />
            Than
            <br />
            Yesterday
          </p>
        </div>
      ) : null}

      <div className="relative z-10 px-4 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              aria-label="Back"
              onClick={() => setStep((s) => (s > 0 ? ((s - 1) as StepIndex) : s))}
              className="tap-scale grid size-10 shrink-0 place-items-center rounded-full text-white"
            >
              <ChevronLeft size={22} />
            </button>
          ) : (
            <Link href="/" aria-label="Cancel checkout" className="tap-scale grid size-10 shrink-0 place-items-center rounded-full text-white">
              <ChevronLeft size={18} />
            </Link>
          )}
          <Image src="/brand/rise-logo-wordmark.png" alt="RISE" width={110} height={29} className="h-6 w-auto" />
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/55">
            <Lock size={13} /> Secure checkout
          </span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`grid size-8 place-items-center rounded-full text-xs font-black transition-colors ${
                    index < step ? "bg-white text-black" : index === step ? "border-2 border-white text-white" : "border border-white/25 text-white/40"
                  }`}
                >
                  {index < step ? <Check size={14} /> : index + 1}
                </span>
                <span className={`text-xs font-semibold ${index <= step ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 ? (
                <div className={`mb-4 h-px w-10 ${index < step ? "bg-white" : "bg-white/20"}`} />
              ) : null}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
          {step === 0 ? (
            <>
              <h1 className="text-3xl font-black uppercase leading-[0.95]">Shipping details</h1>
              <p className="mt-2 text-sm leading-6 text-white/55">Where should we send your order?</p>
              <div className="glass mt-6 grid gap-3 rounded-[20px] p-5">
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  {...field("email")}
                  className="h-12 rounded-[20px] border border-white/15 bg-transparent px-4 outline-none placeholder:text-white/35"
                />
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
            </>
          ) : null}

          {step === 1 ? (
            <>
              <h1 className="text-3xl font-black uppercase leading-[0.95]">
                Review
                <br />
                Your Order
              </h1>
              <p className="mt-2.5 text-sm leading-6 text-white/60">
                Almost there. Confirm your details and place your order.
              </p>

              <div className="mt-5 grid gap-3.5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    <span>Order item{lines.length > 1 ? "s" : ""}</span>
                    <Link href="/shop" className="tap-scale text-white/50">
                      Edit
                    </Link>
                  </div>
                  <div className="glass grid gap-3.5 rounded-[20px] p-4">
                    {lines.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[20px] bg-zinc-900">
                          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold">{item.name}</p>
                              <p className="text-xs text-white/45">
                                {item.color} / {item.size}
                              </p>
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
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    <span>Delivery method</span>
                    <button onClick={() => setStep(0)} className="tap-scale text-white/50">
                      Edit
                    </button>
                  </div>
                  <div className="glass flex items-center gap-3 rounded-[20px] p-3.5">
                    <span className="glass grid size-10 shrink-0 place-items-center rounded-full">
                      <Truck size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">Standard Shipping</p>
                      <p className="truncate text-xs text-white/50">
                        Arrives {deliveryEstimate()} · {estimatedShipping === 0 ? "Free shipping on all orders" : formatCurrency(estimatedShipping)}
                      </p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-white/35" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    <span>Payment method</span>
                    <button onClick={() => setStep(2)} className="tap-scale text-white/50">
                      Edit
                    </button>
                  </div>
                  <div className="glass flex items-center gap-3 rounded-[20px] p-3.5">
                    <span className="grid h-10 w-14 shrink-0 place-items-center rounded-[8px] border border-white/25 text-[10px] font-black italic tracking-wide">
                      VISA
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">Visa ending in 4242</p>
                      <p className="truncate text-xs text-white/50">Expires 04/28 · Stripe test mode</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-white/35" />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-white/45">Order summary</p>
                  <div className="glass grid gap-1.5 rounded-[20px] p-4 text-sm">
                    <Row label="Subtotal" value={formatCurrency(subtotal)} />
                    <Row label="Shipping" value={estimatedShipping === 0 ? "Free" : formatCurrency(estimatedShipping)} />
                    <Row
                      label={
                        <span
                          className="inline-flex items-center gap-1.5"
                          title="Calculated at checkout based on your delivery address"
                        >
                          Estimated Tax <HelpCircle size={13} className="text-white/35" />
                        </span>
                      }
                      value={formatCurrency(estimatedTax)}
                    />
                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3 text-lg font-black">
                      <span>Total</span>
                      <span>{formatCurrency(estimatedTotal)}</span>
                    </div>
                  </div>
                </div>

                {error ? <p className="text-sm text-red-400">{error}</p> : null}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h1 className="text-3xl font-black uppercase leading-[0.95]">Payment</h1>
              <p className="mt-2 text-sm leading-6 text-white/55">
                RISE checkout is powered by Stripe. Card details are entered on Stripe&apos;s secure page after you place your order.
              </p>
              <div className="glass mt-6 rounded-[20px] p-5">
                <div className="flex h-14 items-center justify-between rounded-[20px] border border-white bg-white/5 px-4">
                  <span className="text-sm font-bold">Card / Stripe secure checkout</span>
                  <span className="grid size-5 place-items-center rounded-full bg-white">
                    <Check size={13} className="text-black" />
                  </span>
                </div>
              </div>
              <div className="glass mt-4 rounded-[20px] p-5">
                <p className="mb-3 text-sm font-black uppercase tracking-[0.12em]">Discount code</p>
                <input
                  placeholder="Optional"
                  value={form.discountCode}
                  onChange={(e) => setForm((f) => ({ ...f, discountCode: e.target.value.toUpperCase() }))}
                  className="h-12 w-full rounded-[20px] border border-white/15 bg-transparent px-4 uppercase outline-none placeholder:normal-case placeholder:text-white/35"
                />
              </div>
              <button
                onClick={() => setStep(1)}
                className="tap-scale mt-5 grid h-12 w-full place-items-center rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black"
              >
                Save and review order
              </button>
            </>
          ) : null}

          {stepError ? <p className="mt-3 text-sm text-red-400">{stepError}</p> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {step !== 2 ? (
        <div className="safe-bottom safe-x fixed inset-x-0 bottom-0 z-30 px-3 pb-3">
          <div className="glass-strong mx-auto flex w-full max-w-2xl items-center gap-3 rounded-[20px] p-3">
            {step === 0 ? (
              <button
                onClick={goToReview}
                className="tap-scale grid h-12 w-full place-items-center rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black"
              >
                Continue to review
              </button>
            ) : (
              <button
                disabled={submitting}
                onClick={placeOrder}
                className="tap-scale flex h-12 w-full items-center justify-center gap-2 rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black disabled:opacity-50"
              >
                {submitting ? "Placing order..." : "Place order"}
                {!submitting ? <ChevronRight size={16} /> : null}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex justify-between text-white/62">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
