export function BrandPillars() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:gap-6 lg:px-8 lg:py-28">
      {[
        ["01", "Performance weight", "Heavy enough to hold shape. Flexible enough for daily movement."],
        ["02", "Monochrome identity", "A strict black and white system keeps the product, body, and message in focus."],
        ["03", "Drop rhythm", "Small seasonal capsules built around training, recovery, and the outdoors."],
      ].map(([number, title, text]) => (
        <div key={number} className="panel rounded-[20px] p-7 sm:p-8">
          <p className="text-xs font-black text-white/40">{number}</p>
          <h3 className="mt-5 text-xl font-black uppercase sm:text-2xl">{title}</h3>
          <p className="mt-4 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">{text}</p>
        </div>
      ))}
    </section>
  );
}
