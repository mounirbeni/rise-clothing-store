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
    <div className="panel flex min-h-[240px] flex-col items-center justify-center rounded-[20px] p-8 text-center">
      {icon}
      <p className="mt-4 text-base font-bold">{title}</p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-white/45">{text}</p>
    </div>
  );
}
