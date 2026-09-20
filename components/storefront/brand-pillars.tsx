export function BrandPillars() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-24">
      {[
        ["01", "Performance weight", "Heavy enough to hold shape. Flexible enough for daily movement."],
        ["02", "Monochrome identity", "A strict black and white system keeps the product, body, and message in focus."],
        ["03", "Drop rhythm", "Small seasonal capsules built around training, recovery, and the outdoors."],
      ].map(([number, title, text]) => (
        <div key={number} className="border-t border-white/15 pt-6">
          <p className="text-sm font-black text-white/35">{number}</p>
          <h3 className="mt-8 text-2xl font-black uppercase">{title}</h3>
          <p className="mt-4 leading-7 text-white/60">{text}</p>
        </div>
      ))}
    </section>
  );
}
