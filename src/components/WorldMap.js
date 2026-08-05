import PlaceholderImage from "./PlaceholderImage";

// "Encontrados pelo mundo" — banda verde-floresta com retratos de 6 cidades.
export default function WorldMap({ dict }) {
  return (
    <section id="pelo-mundo" className="scroll-mt-24 bg-floresta text-osso">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex items-center justify-between border-t border-osso/15 pt-6">
          <span className="eyebrow text-amarelomoikato-300">{dict.eyebrow}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-osso/60">
            {dict.viewAll} →
          </span>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
          {dict.cities.map((c, i) => (
            <li key={i}>
              <PlaceholderImage
                tone="dark"
                label={c.city}
                className="aspect-[3/4] w-full"
              />
              <p className="mt-3 text-sm font-semibold text-osso">{c.city}</p>
              <p className="font-display text-sm italic text-osso/60">
                {c.country}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
