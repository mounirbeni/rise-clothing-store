import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { MobileNav, SiteFooter, SiteHeader } from "@/components/rise-storefront";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <CheckCircle2 size={48} className="mx-auto" />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-white/45">Order RSE-1049</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Order confirmed</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/64">
          Your RISE order is queued for fulfillment. Tracking, invoice, and delivery updates will appear in your account area.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/account" className="grid h-12 place-items-center bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
            View account
          </Link>
          <Link href="/shop" className="grid h-12 place-items-center border border-white/15 px-6 text-sm font-black uppercase tracking-[0.18em]">
            Continue shopping
          </Link>
        </div>
      </section>
      <SiteFooter />
      <MobileNav />
    </main>
  );
}
