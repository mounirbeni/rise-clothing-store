import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { faqs } from "@/lib/content";

export const metadata = { title: "FAQ" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Support</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">FAQ</h1>
        <div className="mt-10 grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="glass rounded-[20px] px-5 py-4">
              <summary className="cursor-pointer text-base font-black uppercase">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-white/62">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </StorefrontShell>
  );
}
