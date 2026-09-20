"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 text-center text-white">
      <section>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Error</p>
        <h1 className="mt-4 text-5xl font-black uppercase">Something slipped</h1>
        <button onClick={reset} className="mt-8 h-12 rounded-[20px] bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black">
          Try again
        </button>
      </section>
    </main>
  );
}
