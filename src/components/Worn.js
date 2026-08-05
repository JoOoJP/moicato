import PlaceholderImage from "./PlaceholderImage";

// "Desenhado no Brasil. / Usado pelo mundo." — split texto + foto.
export default function Worn({ dict }) {
  return (
    <section className="bg-osso">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.1] text-verdemoikato sm:text-5xl">
            {dict.title}
          </h2>
          <a
            href="#colecao"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-amarelomoikato-700 transition-colors hover:text-amarelomoikato-800"
          >
            {dict.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <PlaceholderImage
          label="Foto — brasileira em rua de Londres, brinco dourado"
          className="aspect-[4/5] w-full"
        />
      </div>
    </section>
  );
}
