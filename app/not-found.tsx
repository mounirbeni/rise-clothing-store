import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 text-center text-white">
      <section>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">404</p>
        <h1 className="mt-4 text-5xl font-black uppercase">Page not found</h1>
        <Link href="/" className="mt-8 inline-grid h-12 place-items-center rounded-[20px] bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
          Return home
        </Link>
      </section>
    </main>
  );
}
