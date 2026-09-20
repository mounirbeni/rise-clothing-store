import Link from "next/link";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Sign in" };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getSession();
  if (session && session.role === "customer") redirect("/account");
  const { error } = await searchParams;

  return (
    <StorefrontShell hideFooter>
      <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-24 sm:px-6">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Customer account</p>
        <h1 className="mt-3 text-4xl font-black uppercase">Sign in</h1>
        <form action="/api/auth/login" method="post" className="mt-8 grid gap-4">
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
            Email
            <input name="email" type="email" required className="h-12 border border-white/15 bg-transparent px-3 outline-none" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
            Password
            <input name="password" type="password" required minLength={6} className="h-12 border border-white/15 bg-transparent px-3 outline-none" />
          </label>
          {error ? <p className="text-sm text-red-400">Invalid email or password.</p> : null}
          <button className="mt-2 flex h-12 items-center justify-center gap-2 bg-white text-sm font-black uppercase tracking-[0.18em] text-black">
            <LogIn size={17} /> Sign in
          </button>
        </form>
        <p className="mt-6 text-sm leading-6 text-white/50">
          New to RISE?{" "}
          <Link href="/account/register" className="font-bold text-white underline">
            Create an account
          </Link>
        </p>
      </section>
    </StorefrontShell>
  );
}
