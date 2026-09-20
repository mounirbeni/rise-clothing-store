"use client";

import { Check, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/storefront/bottom-sheet";

const SORT_OPTIONS: [string, string][] = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating", "Top rated"],
  ["stock", "Stock"],
];

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  function pushParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "All") params.set(key, value);
      else params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  }

  const activeFilterCount = (activeCategory !== "All" ? 1 : 0) + (activeSort !== "featured" ? 1 : 0);

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">Catalog</p>
          <h1 className="mt-3 text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">
            Performance clothing
          </h1>
        </div>
        <div className="flex gap-3 lg:w-[420px]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              pushParams({ q: query });
            }}
            className="glass flex h-12 flex-1 items-center gap-3 rounded-[20px] px-4"
          >
            <Search size={16} className="text-white/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search RISE"
              aria-label="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </form>
          <button
            aria-label="Filters"
            onClick={() => setFiltersOpen(true)}
            className="tap-scale glass relative flex h-12 shrink-0 items-center gap-2 rounded-[20px] px-4 text-sm font-bold"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-white text-[10px] font-black text-black">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
      <div className="my-6 flex items-center justify-between text-sm text-white/50">
        <span>{resultCount} products</span>
        {activeCategory !== "All" ? (
          <span className="inline-flex items-center gap-2">
            <button onClick={() => pushParams({ category: "All" })} className="tap-scale glass rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-white">
              {activeCategory} ✕
            </button>
          </span>
        ) : null}
      </div>

      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="grid gap-6">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white/45">Category</p>
            <div className="flex flex-wrap gap-2">
              {["All", ...categories].map((item) => (
                <button
                  key={item}
                  onClick={() => pushParams({ category: item })}
                  className={`tap-scale h-10 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-[0.1em] ${
                    activeCategory === item ? "bg-white text-black" : "glass text-white/70"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white/45">Sort by</p>
            <div className="grid gap-2">
              {SORT_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => pushParams({ sort: value })}
                  className={`tap-scale flex h-12 items-center justify-between rounded-[20px] px-4 text-sm font-bold ${
                    activeSort === value ? "bg-white text-black" : "glass text-white"
                  }`}
                >
                  {label}
                  {activeSort === value ? <Check size={16} /> : null}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setFiltersOpen(false)}
            className="tap-scale grid h-12 place-items-center rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black"
          >
            Show {resultCount} results
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
