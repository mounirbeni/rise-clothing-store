import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-28 pt-16 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
      <div className="glass mx-auto grid max-w-7xl gap-10 rounded-[20px] p-8 sm:p-10 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:p-14">
        <div>
          <Image src="/brand/rise-logo-full.png" alt="RISE / More than yesterday" width={244} height={82} className="h-12 w-auto sm:h-14" />
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/45">
            Worldwide performance clothing
          </p>
        </div>
        <div className="grid gap-4 text-sm uppercase tracking-[0.16em] text-white/56 sm:grid-cols-4 sm:gap-6 lg:items-start lg:pt-1">
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/shipping-returns" className="hover:text-white">Shipping & Returns</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/story" className="hover:text-white">Our Story</Link>
        </div>
      </div>
    </footer>
  );
}
