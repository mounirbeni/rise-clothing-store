import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 pb-28 sm:px-6 lg:px-8 lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-3xl font-black tracking-[0.28em]">RISE</p>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/45">
            Worldwide performance clothing
          </p>
        </div>
        <div className="grid gap-3 text-sm uppercase tracking-[0.16em] text-white/56 sm:grid-cols-4">
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/shipping-returns" className="hover:text-white">Shipping & Returns</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/admin/login" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
