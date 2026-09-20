import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { ProductGrid } from "@/components/storefront/product-card";
import { BrandPillars } from "@/components/storefront/brand-pillars";
import { featuredProducts, toCardData } from "@/lib/data/products";

export default async function HomePage() {
  const featured = await featuredProducts(4);
  const cards = featured.map(toCardData);

  return (
    <StorefrontShell>
      <section className="relative min-h-[94svh] overflow-hidden">
        <Image
          src="/images/hero.jpeg"
          alt="RISE athlete wearing black performance clothing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/48" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[94svh] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-white/72">
              Fall training collection
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.88] sm:text-7xl lg:text-8xl">
              More Than Yesterday
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200"
              >
                Shop drop <ChevronRight size={17} />
              </Link>
              <Link
                href="/collection"
                className="inline-flex h-12 items-center justify-center border border-white/25 px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                View campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/50">
              New arrivals
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              Built for motion
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]"
          >
            All products <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid products={cards} />
      </section>

      <section className="grid min-h-[620px] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[420px]">
          <Image
            src="/images/campaign.jpeg"
            alt="RISE black and white campaign scene"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center bg-[#101010] px-4 py-12 sm:px-10 lg:px-14">
          <div className="max-w-lg">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">
              Discipline collection
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
              Quiet gear for loud effort
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/65">
              RISE is designed around sharp silhouettes, heavy contrast, and durable layers that
              move from training to street without losing the discipline of the brand.
            </p>
            <Link
              href="/collection"
              className="mt-8 inline-flex h-12 items-center justify-center bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>

      <BrandPillars />
    </StorefrontShell>
  );
}
