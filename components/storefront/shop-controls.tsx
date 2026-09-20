"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ShopControls({
  categories,
  activeCategory,
  activeSort,
  activeQuery,
  resultCount,
}: {
  categories: string[];
  activeCategory: string;
  activeSort: string;
  activeQuery: string;
  resultCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(activeQuery);

  function pushParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "All") params.set(key, value);
      else params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">Catalog</p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none sm:text-7xl">
            Performance clothing
          </h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px] lg:w-[520px]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              pushParams({ q: query });
            }}
            className="flex h-12 items-center gap-3 border border-white/15 px-4"
          >
            <Search size={18} className="text-white/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search RISE"
              aria-label="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </form>
          <label className="relative flex h-12 items-center border border-white/15 px-4">
            <span className="sr-only">Sort products</span>
            <select
              value={activeSort}
              onChange={(event) => pushParams({ sort: event.target.value })}
              className="w-full appearance-none bg-transparent text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price low</option>
              <option value="price-desc">Price high</option>
              <option value="rating">Top rated</option>
              <option value="stock">Stock</option>
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4" />
          </label>
        </div>
      </div>
      <div className="my-6 flex gap-2 overflow-x-auto pb-1">
        {["All", ...categories].map((item) => (
          <button
            key={item}
            onClick={() => pushParams({ category: item })}
            className={`h-10 shrink-0 border px-4 text-xs font-black uppercase tracking-[0.16em] ${
              activeCategory === item ? "border-white bg-white text-black" : "border-white/15 text-white/65"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-5 flex items-center justify-between text-sm text-white/50">
        <span>{resultCount} products</span>
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters live
        </span>
      </div>
    </>
  );
}
