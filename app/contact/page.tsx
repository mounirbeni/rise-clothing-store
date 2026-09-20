import { Mail, MapPin, MessageSquare } from "lucide-react";
import { MobileNav, SiteFooter, SiteHeader } from "@/components/rise-storefront";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Contact</p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Talk to RISE</h1>
          <div className="mt-8 grid gap-4 text-white/64">
            <p className="flex items-center gap-3"><Mail size={18} /> support@rise.test</p>
            <p className="flex items-center gap-3"><MapPin size={18} /> 184 Mercer St, New York, NY</p>
            <p className="flex items-center gap-3"><MessageSquare size={18} /> Response target: 1 business day</p>
          </div>
        </div>
        <form className="grid gap-4 border border-white/10 p-5">
          {["Name", "Email", "Order number"].map((label) => (
            <label key={label} className="grid gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/55">
              {label}
              <input className="h-12 border border-white/15 bg-transparent px-3 text-base text-white outline-none" />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/55">
            Message
            <textarea rows={6} className="border border-white/15 bg-transparent p-3 text-base text-white outline-none" />
          </label>
          <button className="h-12 bg-white text-sm font-black uppercase tracking-[0.18em] text-black">Send message</button>
        </form>
      </section>
      <SiteFooter />
      <MobileNav />
    </main>
  );
}
