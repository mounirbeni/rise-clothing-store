"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { formatCurrency } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [size, setSize] = useState(product.variants[0]?.size ?? "OS");
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-zinc-900">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]?.url ?? "/images/product-hoodie.jpeg"}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        <span className="glass pointer-events-none absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
          {totalStock < 20 ? "Low stock" : product.collection}
        </span>
        <button
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggle(product.id)}
          className={`glass tap-scale absolute right-2 top-2 grid size-8 place-items-center rounded-full text-white ${
            wishlisted ? "bg-white text-black" : ""
          }`}
        >
          <Heart size={14} className={wishlisted ? "fill-current" : ""} />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/product/${product.slug}`} className="block truncate text-sm font-bold hover:underline">
            {product.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-white/45">
            {product.category} / {product.color}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold">{formatCurrency(product.price)}</p>
          {product.compareAt ? (
            <p className="text-[11px] text-white/38 line-through">{formatCurrency(product.compareAt)}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-[1fr_auto] gap-1.5">
        <label className="relative flex h-9 items-center rounded-[20px] border border-white/12 px-2.5">
          <span className="sr-only">Select size for {product.name}</span>
          <select
            aria-label={`Select size for ${product.name}`}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="w-full appearance-none bg-transparent text-xs font-bold outline-none"
          >
            {product.variants.map((variant) => (
              <option key={variant.size} value={variant.size} disabled={variant.stock === 0}>
                {variant.size} {variant.stock === 0 ? "(out of stock)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2" />
        </label>
        <button
          disabled={totalStock === 0}
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
              size,
            )
          }
          className="tap-scale flex h-9 items-center justify-center whitespace-nowrap rounded-[20px] bg-white px-3 text-[10px] font-black uppercase tracking-[0.1em] text-black transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {totalStock === 0 ? "Sold out" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}
