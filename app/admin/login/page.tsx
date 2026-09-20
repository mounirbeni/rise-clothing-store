import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function Page() {
  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 text-white">
      <section className="w-full max-w-md border border-white/10 p-6">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Secure admin login</p>
          <h1 className="mt-3 text-4xl font-black uppercase">RISE console</h1>
        </div>
        <form action="/api/auth/login" method="post" className="grid gap-4">
          <input name="email" defaultValue="owner@rise.test" className="h-12 border border-white/15 bg-transparent px-3 outline-none" />
          <input name="password" type="password" defaultValue="password" className="h-12 border border-white/15 bg-transparent px-3 outline-none" />
          <button className="flex h-12 items-center justify-center gap-2 bg-white text-sm font-black uppercase tracking-[0.18em] text-black">
            <LockKeyhole size={17} /> Login
          </button>
        </form>
        <p className="mt-5 text-sm leading-6 text-white/45">
          Demo credentials map to the owner role. Production RBAC is represented in the Prisma model and API helpers.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-black uppercase tracking-[0.16em]">Back to storefront</Link>
      </section>
    </main>
  );
}
