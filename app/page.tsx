import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { FeaturedProductRail } from "@/components/storefront/featured-product-rail";
import { BrandPillars } from "@/components/storefront/brand-pillars";
import { CampaignCarousel } from "@/components/storefront/campaign-carousel";
import { CollectionFeed } from "@/components/storefront/collection-feed";
import { HeroCarousel } from "@/components/storefront/hero-carousel";
import { categoryShowcase, featuredProducts, toCardData } from "@/lib/data/products";
import { listActiveBanners } from "@/lib/data/marketing";

const HERO_IMAGES = [
  "/images/hero/hero-hoodie-summit.png",
  "/images/hero/hero-mens-training.png",
  "/images/hero/hero-womens-training.jpg",
  "/images/hero/hero-product-flatlay.png",
];

export default async function HomePage() {
  const [featured, banners, collections] = await Promise.all([
    featuredProducts(4),
    listActiveBanners(),
    categoryShowcase(),
  ]);
  const cards = featured.map(toCardData);
  const slides = banners
    .filter((banner) => banner.imageUrl)
    .map((banner) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      ctaLabel: banner.ctaLabel || "Shop now",
      ctaHref: banner.ctaHref || "/shop",
    }));

  return (
    <StorefrontShell>
      <HeroCarousel images={HERO_IMAGES}>
        <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-7xl items-end px-4 pb-16 pt-24 sm:px-6 sm:pb-20 lg:min-h-[88svh] lg:px-8 lg:pb-24">
          <div className="max-w-md">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/70">
              Fall training collection
            </p>
            <h1 className="text-5xl font-black uppercase leading-[0.84] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              More Than Yesterday
            </h1>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/66 sm:text-base">
              Discipline-built essentials for training, recovery, and everything after.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="tap-scale inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-white px-6 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200"
              >
                Shop drop <ChevronRight size={16} />
              </Link>
              <Link
                href="/collection"
                className="glass tap-scale inline-flex h-12 items-center justify-center gap-2 rounded-[20px] px-5 text-xs font-black uppercase tracking-[0.18em] text-white"
              >
                View campaign
              </Link>
            </div>
          </div>
        </div>
      </HeroCarousel>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">
              New arrivals
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
              Featured drop
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]"
          >
            All products <ChevronRight size={16} />
          </Link>
        </div>
        <FeaturedProductRail products={cards} />
      </section>

      <CollectionFeed items={collections} />

      <CampaignCarousel slides={slides} />

      <section className="grid min-h-[520px] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[360px]">
          <Image
            src="/images/campaign.jpeg"
            alt="RISE black and white campaign scene"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="glass-strong flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">
              Discipline collection
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase leading-none sm:text-4xl">
              Quiet gear for loud effort
            </h2>
            <p className="mt-6 text-base leading-7 text-white/65">
              RISE is designed around sharp silhouettes, heavy contrast, and durable layers that
              move from training to street without losing the discipline of the brand.
            </p>
            <Link
              href="/collection"
              className="tap-scale mt-8 inline-flex h-11 items-center justify-center rounded-[20px] bg-white px-6 text-xs font-black uppercase tracking-[0.18em] text-black"
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
