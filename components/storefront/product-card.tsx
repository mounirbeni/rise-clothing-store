"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { formatCurrency } from "@/lib/format";
import { BottomSheet } from "@/components/storefront/bottom-sheet";
import type { ProductCardData } from "@/lib/types";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [loaded, setLoaded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const wishlisted = isWishlisted(product.id);

  function confirmAdd(size: string) {
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
    );
    setSheetOpen(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleAddTap() {
    if (totalStock === 0) return;
    const inStock = product.variants.filter((v) => v.stock > 0);
    if (inStock.length === 1) {
      confirmAdd(inStock[0].size);
      return;
    }
    setSheetOpen(true);
  }

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-zinc-900">
        {!loaded ? <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800 to-zinc-900" /> : null}
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]?.url ?? "/images/product-hoodie.jpeg"}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            onLoad={() => setLoaded(true)}
            className={`object-cover transition duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </Link>
        <span className="panel pointer-events-none absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
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
      <div className="mt-3.5 flex items-start justify-between gap-2">
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
      <button
        disabled={totalStock === 0}
        onClick={handleAddTap}
        className={`tap-scale mt-3 flex h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-[20px] text-[11px] font-black uppercase tracking-[0.1em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
          added ? "bg-white text-black" : "bg-white text-black"
        }`}
      >
        {totalStock === 0 ? (
          "Sold out"
        ) : added ? (
          <>
            <Check size={14} /> Added
          </>
        ) : (
          <>
            <Plus size={14} /> Add to bag
          </>
        )}
      </button>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Select size / ${product.name}`}>
        <div className="grid grid-cols-4 gap-2.5">
          {product.variants.map((variant) => (
            <button
              key={variant.size}
              disabled={variant.stock === 0}
              onClick={() => confirmAdd(variant.size)}
              className="tap-scale glass flex h-14 flex-col items-center justify-center rounded-[20px] text-sm font-black uppercase disabled:cursor-not-allowed disabled:opacity-30"
            >
              {variant.size}
              {variant.stock === 0 ? <span className="text-[9px] font-bold normal-case text-white/40">Sold out</span> : null}
            </button>
          ))}
        </div>
      </BottomSheet>
    </article>
  );
}
