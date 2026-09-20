import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { BrandPillars } from "@/components/storefront/brand-pillars";

export const metadata = { title: "Story" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Story</p>
        <h1 className="mt-4 max-w-5xl text-5xl font-black uppercase leading-none sm:text-7xl">
          RISE makes gear for discipline before applause.
        </h1>
        <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 text-lg leading-8 text-white/66 lg:grid-cols-2">
          <p>
            The brand is built around the private part of performance: the early alarm, the repeat set, the cold mile, and the quiet decision to show up again.
          </p>
          <p>
            Every piece uses a strict black-and-white language so cut, material, and fit carry the identity. No noise. No seasonal costume. Just durable clothing that earns space in the rotation.
          </p>
        </div>
      </section>
      <BrandPillars />
    </StorefrontShell>
  );
}
