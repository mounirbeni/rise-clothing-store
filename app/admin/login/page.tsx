import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { getSession, isStaffRole } from "@/lib/auth";

export const metadata = { title: "Admin login" };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getSession();
  if (session && isStaffRole(session.role)) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 text-white">
      <section className="w-full max-w-md panel rounded-[20px] p-6">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Secure admin login</p>
          <h1 className="mt-3 text-2xl font-black uppercase">RISE console</h1>
        </div>
        <form action="/api/auth/login" method="post" className="grid gap-4">
          <input name="email" type="email" required defaultValue="owner@rise.test" placeholder="Email" className="h-12 rounded-[20px] border border-white/15 bg-transparent px-3 outline-none" />
          <input name="password" type="password" required defaultValue="password" placeholder="Password" className="h-12 rounded-[20px] border border-white/15 bg-transparent px-3 outline-none" />
          {error ? <p className="text-sm text-red-400">Invalid email or password.</p> : null}
          <button className="tap-scale flex h-12 items-center justify-center gap-2 rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black">
            <LockKeyhole size={17} /> Login
          </button>
        </form>
        <p className="mt-5 text-sm leading-6 text-white/45">
          Demo accounts (seeded): owner@rise.test, admin@rise.test, staff@rise.test / password: password
        </p>
        <a href="/" className="mt-6 inline-block text-sm font-black uppercase tracking-[0.16em]">Back to storefront</a>
      </section>
    </main>
  );
}
