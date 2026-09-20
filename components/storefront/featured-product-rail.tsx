"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";

export function FeaturedProductRail({ products }: { products: ProductCardData[] }) {
  const { addItem } = useCart();

  return (
    <div className="-mr-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mr-6 sm:pr-6 lg:mr-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pr-0 [&::-webkit-scrollbar]:hidden">
      {products.map((product) => {
        const defaultSize = product.variants[0]?.size ?? "OS";
        const stock = product.variants.reduce((total, variant) => total + variant.stock, 0);

        return (
          <article key={product.id} className="w-[43vw] shrink-0 snap-start sm:w-[210px] lg:w-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-zinc-900">
              <Link href={`/product/${product.slug}`} className="absolute inset-0">
                <Image
                  src={product.images[0]?.url ?? "/images/product-hoodie.jpeg"}
                  alt={product.images[0]?.alt ?? product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 43vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </Link>
              <button
                aria-label={`Add ${product.name} to bag`}
                disabled={stock === 0}
                onClick={() =>
                  addItem(
                    {
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.images[0]?.url ?? "/images/product-hoodie.jpeg",
                      color: product.color,
                    },
                    defaultSize,
                  )
                }
                className="tap-scale glass-strong absolute bottom-2 right-2 grid size-9 place-items-center rounded-full text-white disabled:opacity-35"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="mt-3 min-w-0">
              <Link href={`/product/${product.slug}`} className="block truncate text-sm font-bold uppercase tracking-[0.02em] hover:underline">
                {product.name}
              </Link>
              <p className="mt-1 text-sm font-semibold text-white/70">{formatCurrency(product.price)}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
