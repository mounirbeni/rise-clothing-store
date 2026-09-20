import { MobileNav, SiteFooter, SiteHeader } from "@/components/rise-storefront";

const faqs = [
  ["How does RISE fit?", "Most products fit true to size with structured athletic room. Size up for an oversized training look."],
  ["When do drops ship?", "In-stock products usually leave the warehouse within two business days."],
  ["Can I change an order?", "Contact support before fulfillment starts and the operations team can adjust size, address, or cancellation status."],
  ["Do you ship internationally?", "Yes. Shipping zones are configured for the US, Canada, and EU in the admin dashboard."],
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Support</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">FAQ</h1>
        <div className="mt-10">
          {faqs.map(([question, answer]) => (
            <details key={question} className="border-b border-white/10 py-5">
              <summary className="cursor-pointer text-xl font-black uppercase">{question}</summary>
              <p className="mt-4 leading-7 text-white/62">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
      <MobileNav />
    </main>
  );
}
