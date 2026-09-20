import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata = { title: "Shipping & Returns" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Logistics</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">Shipping & Returns</h1>
        <div className="mt-10 grid gap-5">
          {[
            ["Shipping", "US orders ship from the RISE warehouse within two business days. International duties are calculated at checkout."],
            ["Returns", "Unworn products can be returned within 30 days. Staff can create refunds and notes in the admin order view."],
            ["Tracking", "Tracking numbers are attached to the customer order history as soon as fulfillment starts."],
          ].map(([title, text]) => (
            <section key={title} className="glass rounded-[20px] p-5">
              <h2 className="text-lg font-black uppercase">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/62">{text}</p>
            </section>
          ))}
        </div>
      </section>
    </StorefrontShell>
  );
}
