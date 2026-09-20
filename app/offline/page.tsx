export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 text-center text-white">
      <section>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Offline</p>
        <h1 className="mt-4 text-5xl font-black uppercase">No connection</h1>
        <p className="mx-auto mt-4 max-w-sm text-white/60">
          You&apos;re offline. Reconnect to keep browsing RISE, or check your bag once you&apos;re back online.
        </p>
      </section>
    </main>
  );
}
