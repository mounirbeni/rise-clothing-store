"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import { BottomSheet } from "@/components/storefront/bottom-sheet";
import type { ProductCardData } from "@/lib/types";

export function FeaturedRail({ products }: { products: ProductCardData[] }) {
  return (
    <div className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <RailCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function RailCard({ product }: { product: ProductCardData }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

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

  function handleQuickAdd() {
    if (totalStock === 0) return;
    const inStock = product.variants.filter((v) => v.stock > 0);
    if (inStock.length === 1) {
      confirmAdd(inStock[0].size);
      return;
    }
    setSheetOpen(true);
  }

  return (
    <div className="w-[42vw] shrink-0 snap-start sm:w-[220px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-zinc-900">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]?.url ?? "/images/product-hoodie.jpeg"}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(min-width: 640px) 220px, 42vw"
            className="object-cover"
          />
        </Link>
        <span className="panel pointer-events-none absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
          Rise Originals
        </span>
        <button
          aria-label={added ? `${product.name} added to bag` : `Quick add ${product.name} to bag`}
          onClick={handleQuickAdd}
          disabled={totalStock === 0}
          className="tap-scale absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-white text-black disabled:opacity-40"
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>
      <Link href={`/product/${product.slug}`} className="mt-2.5 block truncate text-xs font-black uppercase tracking-[0.06em]">
        {product.name}
      </Link>
      <p className="text-sm font-bold">{formatCurrency(product.price)}</p>

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
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
