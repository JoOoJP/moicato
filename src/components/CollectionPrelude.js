import Image from "next/image";

export default function CollectionPrelude({ dict }) {
  const selection = dict.pieces.slice(-3);
  const featured = selection[selection.length - 1];
  const supporting = selection.slice(0, 2);

  return (
    <section
      aria-labelledby="destaque-colecao-titulo"
      className="border-t border-verdemoikato/10 bg-areia-50"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-8 border-b border-verdemoikato/15 pb-10 md:grid-cols-2 md:items-end">
          <div>
            <span className="eyebrow text-amarelomoikato-800">
              {dict.previewEyebrow}
            </span>
            <h2
              id="destaque-colecao-titulo"
              className="mt-4 max-w-xl text-4xl leading-tight sm:text-5xl"
            >
              {dict.previewTitle}
            </h2>
          </div>
          <p className="lead max-w-xl md:justify-self-end">{dict.previewLead}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <article className="group">
            <div className="relative aspect-[4/5] overflow-hidden bg-areia-200 sm:aspect-[16/11] lg:aspect-[4/5]">
              <Image
                src={featured.image}
                alt={`${featured.name} — ${featured.material} · ${dict.altSuffix}`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-3 border border-areia/25"
              />
              <span className="absolute left-4 top-4 bg-areia/90 px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-verdemoikato backdrop-blur-sm">
                {dict.previewNumber}
              </span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-5 border-b border-verdemoikato/20 pb-5">
              <div>
                <h3 className="text-2xl leading-tight">{featured.name}</h3>
                <p className="mt-2 text-sm text-verdemoikato-700/70">
                  {featured.material} · {dict.availability}
                </p>
              </div>
              <span className="font-display text-3xl italic text-amarelomoikato-700">
                06
              </span>
            </div>
          </article>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-1 lg:gap-8">
            {supporting.map((piece, index) => (
              <article key={piece.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-areia-200 lg:aspect-[16/10]">
                  <Image
                    src={piece.image}
                    alt={`${piece.name} — ${piece.material} · ${dict.altSuffix}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                  <span className="absolute left-3 top-3 bg-areia/90 px-2.5 py-1.5 text-[0.6rem] font-medium tracking-[0.16em] text-verdemoikato">
                    0{index + 4}
                  </span>
                </div>
                <div className="mt-4 border-b border-verdemoikato/20 pb-4">
                  <h3 className="text-lg leading-tight">{piece.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-verdemoikato-700/70">
                    {piece.material}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-l border-amarelomoikato-600 pl-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <p className="max-w-2xl text-sm leading-relaxed text-verdemoikato-700/75">
            {dict.previewNote}
          </p>
          <a
            href="#colecao"
            className="group inline-flex min-h-12 items-center gap-4 border-b border-verdemoikato/40 text-sm font-medium tracking-wide text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-4 ring-offset-areia-50 transition-colors hover:border-terra-600 hover:text-terra-600 focus-visible:ring-2"
          >
            {dict.previewCta}
            <span
              aria-hidden
              className="text-xl transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
