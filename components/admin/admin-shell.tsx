"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  LogOut,
  Megaphone,
  PackageCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { AdminRole } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Products", href: "/admin/products", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: PackageCheck },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: ShieldCheck },
];

export function AdminShell({
  role,
  name,
  children,
}: {
  role: AdminRole;
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="border-b border-black/10 bg-black p-5 text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center border border-white/20 font-black">R</div>
            <div>
              <p className="font-black tracking-[0.22em]">RISE</p>
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">{role} console</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-1 text-sm font-bold uppercase tracking-[0.12em] text-white/62">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex h-11 items-center gap-3 px-3 ${
                    active ? "bg-white text-black" : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={17} /> {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-white/10 pt-4">
            <p className="px-3 text-xs uppercase tracking-[0.14em] text-white/40">Signed in as</p>
            <p className="px-3 text-sm font-bold text-white">{name}</p>
            <form action="/api/auth/logout?redirect=/admin/login" method="post" className="mt-3">
              <button className="flex h-10 w-full items-center gap-3 px-3 text-sm font-bold uppercase tracking-[0.12em] text-white/60 hover:text-white">
                <LogOut size={16} /> Sign out
              </button>
            </form>
          </div>
        </aside>
        <section className="p-4 sm:p-6 lg:p-8">{children}</section>
      </div>
    </main>
  );
}
