import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { faqs } from "@/lib/content";

export const metadata = { title: "FAQ" };

export default function Page() {
  return (
    <StorefrontShell>
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
    </StorefrontShell>
  );
}
