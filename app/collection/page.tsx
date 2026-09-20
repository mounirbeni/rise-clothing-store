import Image from "next/image";
import Link from "next/link";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { BrandPillars } from "@/components/storefront/brand-pillars";

export const metadata = { title: "Collection" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="relative min-h-[82svh] overflow-hidden pt-16">
        <Image src="/images/campaign.jpeg" alt="RISE campaign" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/42" />
        <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-7xl items-end px-4 pb-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-white/60">Collection</p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">More Than Yesterday</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              A tightly edited capsule of heavyweight fleece, weather shells, and recovery accessories for the next session.
            </p>
            <Link href="/shop" className="mt-8 inline-flex h-12 items-center bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
              Shop collection
            </Link>
          </div>
        </div>
      </section>
      <BrandPillars />
    </StorefrontShell>
  );
}
