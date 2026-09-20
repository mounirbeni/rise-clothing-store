import { ArrowUpRight } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { journalPosts } from "@/lib/content";

export const metadata = { title: "Journal" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Journal</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Field notes</h1>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {journalPosts.map((post) => (
            <article key={post.title} className="border border-white/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">{post.date}</p>
              <h2 className="mt-12 text-3xl font-black uppercase leading-tight">{post.title}</h2>
              <p className="mt-4 leading-7 text-white/60">{post.excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-white/60">
                Coming soon <ArrowUpRight size={16} />
              </span>
            </article>
          ))}
        </div>
      </section>
    </StorefrontShell>
  );
}
