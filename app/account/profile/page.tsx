import { redirect } from "next/navigation";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Profile settings" };

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/account/login");
  const { saved } = await searchParams;

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/account/login");

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Account</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl">Profile settings</h1>
        <form action="/api/account/profile" method="post" className="mt-10 grid gap-4 panel rounded-[20px] p-5">
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
            Full name
            <input
              name="name"
              defaultValue={user.name}
              required
              className="h-12 rounded-[20px] border border-white/15 bg-transparent px-3 text-white outline-none"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
            Email (contact support to change)
            <input
              disabled
              defaultValue={user.email}
              className="h-12 border border-white/10 bg-transparent px-3 text-white/40 outline-none"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
            Notes / preferences
            <textarea
              name="notes"
              defaultValue={user.notes ?? ""}
              rows={3}
              className="rounded-[20px] border border-white/15 bg-transparent px-3 py-2 text-white outline-none"
            />
          </label>
          {saved ? <p className="text-sm text-emerald-400">Profile updated.</p> : null}
          <button className="tap-scale h-12 rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black">Save changes</button>
        </form>
      </section>
    </StorefrontShell>
  );
}
