import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { FeaturedRail } from "@/components/storefront/featured-rail";
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
        <div className="relative z-10 mx-auto flex min-h-[94svh] max-w-7xl flex-col justify-end px-5 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-8 lg:pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/72">
            Fall training collection
          </p>
          <h1 className="mt-3 text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            More
            <br />
            Than
            <br />
            Yesterday
          </h1>
          <p className="mt-4 text-sm font-bold uppercase leading-6 tracking-[0.14em] text-white/75">
            Discipline
            <br />
            Builds Different
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="tap-scale inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-white px-6 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200"
            >
              Shop drop <ChevronRight size={16} />
            </Link>
            <Link
              href="/collection"
              className="glass tap-scale inline-flex h-12 items-center justify-center gap-2 rounded-[20px] px-6 text-xs font-black uppercase tracking-[0.18em] text-white"
            >
              View campaign
            </Link>
          </div>
        </div>
      </HeroCarousel>

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">
              Featured drop
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-black uppercase tracking-[0.14em] text-white/80"
          >
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <FeaturedRail products={cards} />
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <Link
          href="/story"
          className="group relative flex h-56 items-end overflow-hidden rounded-[20px] bg-zinc-900 sm:h-72"
        >
          <Image
            src="/images/hero/hero-mens-training.png"
            alt="RISE athlete training in the dark"
            fill
            sizes="100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative flex w-full items-end justify-between p-5 sm:p-7">
            <p className="max-w-[70%] text-xl font-black uppercase leading-[1.05] sm:text-2xl">
              Built for a higher standard
            </p>
            <span className="tap-scale glass-strong grid size-12 shrink-0 place-items-center rounded-full">
              <Play size={18} className="ml-0.5 fill-white" />
            </span>
          </div>
        </Link>
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
