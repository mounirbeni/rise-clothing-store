import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CollectionFeed({ items }: { items: { category: string; image: string; alt: string }[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">Shop the feed</p>
          <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">Swipe by collection</h2>
        </div>
      </div>
      <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.category}
            href={`/shop?category=${encodeURIComponent(item.category)}`}
            className="group relative aspect-[3/4] w-[62vw] shrink-0 snap-center overflow-hidden rounded-[20px] bg-zinc-900 sm:w-[300px]"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 640px) 300px, 62vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
            <div className="glass-strong absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[20px] px-4 py-3">
              <span className="text-sm font-black uppercase tracking-[0.1em]">{item.category}</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
