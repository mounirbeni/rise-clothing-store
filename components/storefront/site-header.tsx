"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";

const links: [string, string][] = [
  ["Shop", "/shop"],
  ["Collection", "/collection"],
  ["Story", "/story"],
  ["Journal", "/journal"],
];

export function SiteHeader({ authed }: { authed?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count, setBagOpen } = useCart();
  const router = useRouter();

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    setSearchOpen(false);
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/72 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center border border-white/10 text-white lg:hidden"
        >
          <Menu size={19} />
        </button>
        <Link href="/" className="text-xl font-black tracking-[0.28em]">
          RISE
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.18em] text-white/70 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="hidden size-10 place-items-center text-white/80 transition hover:bg-white/10 hover:text-white sm:grid"
          >
            <Search size={19} />
          </button>
          <Link
            aria-label={authed ? "Account" : "Sign in"}
            href={authed ? "/account" : "/account/login"}
            className="hidden size-10 place-items-center text-white/80 transition hover:bg-white/10 hover:text-white sm:grid"
          >
            <User size={19} />
          </Link>
          <button
            aria-label="Open shopping bag"
            onClick={() => setBagOpen(true)}
            className="relative grid size-10 place-items-center text-white/90 transition hover:bg-white/10"
          >
            <ShoppingBag size={19} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[11px] font-black text-black">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </nav>
      {searchOpen ? (
        <div className="fixed inset-0 z-50 bg-black/95 px-4 pt-28">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={submitSearch} className="flex h-14 items-center gap-3 border border-white/20 px-4">
              <Search size={20} className="text-white/50" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search hoodies, training, outerwear..."
                className="w-full bg-transparent text-lg outline-none placeholder:text-white/35"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="grid size-9 place-items-center text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </form>
            <button
              onClick={submitSearch}
              className="mt-4 inline-flex h-11 items-center gap-2 bg-white px-5 text-sm font-black uppercase tracking-[0.16em] text-black"
            >
              Search <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-black lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <span className="font-black tracking-[0.28em]">RISE</span>
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="grid size-10 place-items-center border border-white/10"
            >
              <X size={19} />
            </button>
          </div>
          <div className="grid gap-1 p-4">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-5 text-3xl font-black uppercase"
              >
                {label}
              </Link>
            ))}
            <Link
              href={authed ? "/account" : "/account/login"}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-5 text-3xl font-black uppercase"
            >
              {authed ? "Account" : "Sign in"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
