export function EmptyState({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center border border-white/10 p-8 text-center">
      {icon}
      <p className="mt-4 text-lg font-bold">{title}</p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-white/45">{text}</p>
    </div>
  );
}
