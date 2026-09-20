"use client";

import Image from "next/image";
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
    <header className="safe-top fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <nav className="glass mx-auto flex h-14 max-w-7xl items-center justify-between rounded-[20px] px-3 sm:px-5">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="tap-scale grid size-10 place-items-center rounded-full text-white lg:hidden"
        >
          <Menu size={19} />
        </button>
        <Link href="/" aria-label="RISE home" className="shrink-0">
          <Image src="/brand/rise-logo-wordmark.png" alt="RISE" width={144} height={38} className="h-7 w-auto sm:h-8" priority />
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
            className="tap-scale grid size-10 place-items-center rounded-full text-white/85 hover:bg-white/10"
          >
            <Search size={19} />
          </button>
          <Link
            aria-label={authed ? "Account" : "Sign in"}
            href={authed ? "/account" : "/account/login"}
            className="tap-scale hidden size-10 place-items-center rounded-full text-white/85 hover:bg-white/10 md:grid"
          >
            <User size={19} />
          </Link>
          <button
            aria-label="Open shopping bag"
            onClick={() => setBagOpen(true)}
            className="tap-scale relative grid size-10 place-items-center rounded-full text-white hover:bg-white/10"
          >
            <ShoppingBag size={19} />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-white text-[11px] font-black text-black">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </nav>
      {searchOpen ? (
        <div className="safe-top fixed inset-0 z-50 bg-black/60 px-4 pt-24 backdrop-blur-xl">
          <div className="glass-strong mx-auto max-w-2xl rounded-[20px] p-4">
            <form onSubmit={submitSearch} className="glass flex h-14 items-center gap-3 rounded-[20px] px-4">
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
                className="tap-scale grid size-9 place-items-center rounded-full text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </form>
            <button
              onClick={submitSearch}
              className="tap-scale mt-4 inline-flex h-11 items-center gap-2 rounded-[20px] bg-white px-5 text-sm font-black uppercase tracking-[0.16em] text-black"
            >
              Search <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
      {menuOpen ? (
        <div className="safe-top safe-bottom fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl lg:hidden">
          <div className="glass mx-3 mt-3 flex h-14 items-center justify-between rounded-[20px] px-4">
            <Image src="/brand/rise-logo-wordmark.png" alt="RISE" width={144} height={38} className="h-7 w-auto" />
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="tap-scale grid size-10 place-items-center rounded-full text-white"
            >
              <X size={19} />
            </button>
          </div>
          <div className="mx-3 mt-3 grid gap-2">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="glass tap-scale rounded-[20px] px-5 py-5 text-3xl font-black uppercase"
              >
                {label}
              </Link>
            ))}
            <Link
              href={authed ? "/account" : "/account/login"}
              onClick={() => setMenuOpen(false)}
              className="glass tap-scale rounded-[20px] px-5 py-5 text-3xl font-black uppercase"
            >
              {authed ? "Account" : "Sign in"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
