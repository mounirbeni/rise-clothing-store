export function Panel({
  title,
  icon,
  children,
  actions,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border border-black/10 bg-[#fbfbf8] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em]">
          {icon} {title}
        </h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function AdminEmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="grid min-h-[140px] place-items-center border border-dashed border-black/15 p-6 text-center">
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-black/50">{text}</p>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="border border-black/10 bg-white p-5">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-black/45">{label}</p>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-3xl font-black">{value}</p>
        {delta ? <span className="bg-black px-2 py-1 text-xs font-black text-white">{delta}</span> : null}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="border border-black/15 px-2 py-1 text-xs font-black uppercase tracking-[0.08em]">
      {status.replace(/_/g, " ")}
    </span>
  );
}
