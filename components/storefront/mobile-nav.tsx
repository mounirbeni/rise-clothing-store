"use client";

import Link from "next/link";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

export function MobileNav({ authed }: { authed?: boolean }) {
  const { count, setBagOpen } = useCart();

  const items: { icon: typeof Home; label: string; href?: string; onClick?: () => void; badge?: number }[] = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/shop" },
    { icon: ShoppingBag, label: "Bag", onClick: () => setBagOpen(true), badge: count },
    { icon: Heart, label: "Saved", href: authed ? "/account/wishlist" : "/account/login" },
    { icon: User, label: "Account", href: authed ? "/account" : "/account/login" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-black/88 px-2 py-2 backdrop-blur-xl lg:hidden">
      {items.map(({ icon: Icon, label, href, onClick, badge }) => {
        const content = (
          <>
            <span className="relative">
              <Icon size={18} />
              {badge ? (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-white text-[9px] font-black text-black">
                  {badge}
                </span>
              ) : null}
            </span>
            {label}
          </>
        );
        const className = "flex h-12 flex-col items-center justify-center gap-1 text-[11px] font-bold text-white/70";

        return href ? (
          <Link key={label} href={href} className={className}>
            {content}
          </Link>
        ) : (
          <button key={label} onClick={onClick} className={className}>
            {content}
          </button>
        );
      })}
    </div>
  );
}
