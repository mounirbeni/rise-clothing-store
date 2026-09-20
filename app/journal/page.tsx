import { ArrowUpRight } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { journalPosts } from "@/lib/content";

export const metadata = { title: "Journal" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Journal</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">Field notes</h1>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {journalPosts.map((post) => (
            <article key={post.title} className="panel rounded-[20px] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">{post.date}</p>
              <h2 className="mt-8 text-xl font-black uppercase leading-tight">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{post.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/60">
                Coming soon <ArrowUpRight size={16} />
              </span>
            </article>
          ))}
        </div>
      </section>
    </StorefrontShell>
  );
}
