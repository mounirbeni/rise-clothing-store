"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

export function MobileNav({ authed }: { authed?: boolean }) {
  const { count, setBagOpen } = useCart();
  const pathname = usePathname();

  const items: { icon: typeof Home; label: string; href?: string; onClick?: () => void; badge?: number }[] = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/shop" },
    { icon: ShoppingBag, label: "Bag", onClick: () => setBagOpen(true), badge: count },
    { icon: Heart, label: "Saved", href: authed ? "/account/wishlist" : "/account/login" },
    { icon: User, label: "Account", href: authed ? "/account" : "/account/login" },
  ];

  return (
    <nav
      aria-label="Primary"
      className="safe-bottom safe-x fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 lg:hidden"
    >
      <div className="glass-strong flex w-full max-w-md items-center justify-between rounded-[20px] px-1.5 py-1.5">
        {items.map(({ icon: Icon, label, href, onClick, badge }) => {
          const active = href ? (href === "/" ? pathname === "/" : pathname?.startsWith(href)) : false;
          const content = (
            <span
              className={`tap-scale flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-[20px] text-[10px] font-bold transition-colors ${
                active ? "bg-white text-black" : "text-white/75"
              }`}
            >
              <span className="relative">
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {badge ? (
                  <span className="absolute -right-2.5 -top-2 grid size-4 place-items-center rounded-full bg-white text-[9px] font-black text-black ring-2 ring-black">
                    {badge}
                  </span>
                ) : null}
              </span>
              {label}
            </span>
          );

          return href ? (
            <Link key={label} href={href} aria-label={label} aria-current={active ? "page" : undefined}>
              {content}
            </Link>
          ) : (
            <button key={label} onClick={onClick} aria-label={label}>
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
