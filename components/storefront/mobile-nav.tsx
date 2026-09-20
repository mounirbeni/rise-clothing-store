"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Layers, Shirt, User } from "lucide-react";

export function MobileNav({ authed }: { authed?: boolean }) {
  const pathname = usePathname();

  const items: { icon: typeof Home; label: string; href: string }[] = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Shirt, label: "Shop", href: "/shop" },
    { icon: Layers, label: "Collection", href: "/collection" },
    { icon: BookOpen, label: "Story", href: "/story" },
    { icon: User, label: "Account", href: authed ? "/account" : "/account/login" },
  ];

  return (
    <nav
      aria-label="Primary"
      className="safe-bottom safe-x fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 lg:hidden"
    >
      <div className="glass-strong flex w-full max-w-md items-center justify-between rounded-[20px] px-1.5 py-1.5">
        {items.map(({ icon: Icon, label, href }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link key={label} href={href} aria-label={label} aria-current={active ? "page" : undefined}>
              <span
                className={`tap-scale flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-[20px] text-[10px] font-bold transition-colors ${
                  active ? "bg-white text-black" : "text-white/75"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
