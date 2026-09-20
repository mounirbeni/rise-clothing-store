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
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-zinc-900">
        <Image
          src={product.images[0]?.url ?? "/images/product-hoodie.jpeg"}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-black/60 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] backdrop-blur">
          {totalStock < 20 ? "Low stock" : product.collection}
        </span>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/product/${product.slug}`} className="font-bold hover:underline">
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-white/50">
            {product.category} / {product.color}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatCurrency(product.price)}</p>
          {product.compareAt ? (
            <p className="text-xs text-white/38 line-through">{formatCurrency(product.compareAt)}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <label className="relative flex h-11 items-center border border-white/15 px-3">
          <span className="sr-only">Select size for {product.name}</span>
          <select
            aria-label={`Select size for ${product.name}`}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="w-full appearance-none bg-transparent text-sm font-bold outline-none"
          >
            {product.variants.map((variant) => (
              <option key={variant.size} value={variant.size} disabled={variant.stock === 0}>
                {variant.size} {variant.stock === 0 ? "(out of stock)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3" />
        </label>
        <button
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggle(product.id)}
          className={`tap-scale grid size-11 place-items-center border text-white transition hover:bg-white hover:text-black ${
            wishlisted ? "border-white bg-white text-black" : "border-white/15"
          }`}
        >
          <Heart size={17} className={wishlisted ? "fill-current" : ""} />
        </button>
      </div>
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
        className="tap-scale mt-2 flex h-11 w-full items-center justify-center gap-2 border border-white/18 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white"
      >
        {totalStock === 0 ? "Out of stock" : "Add to bag"}
      </button>
    </article>
  );
}
