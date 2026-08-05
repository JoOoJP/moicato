import PlaceholderImage from "./PlaceholderImage";

// "Nossa história" — split: foto P&B do fundador + citação serifada grande.
export default function Story({ dict }) {
  return (
    <section id="historia" className="scroll-mt-24 bg-osso">
      <div className="mx-auto grid max-w-6xl items-stretch lg:grid-cols-2">
        <PlaceholderImage
          tone="dark"
          label="Foto P&B — fundador no ateliê"
          className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[28rem]"
        />
        <div className="flex flex-col justify-center px-6 py-16 lg:pl-14">
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
          <p className="mt-5 font-display text-3xl font-light leading-snug text-verdemoikato sm:text-[2.15rem]">
            {dict.quote}
          </p>
          <a
            href="#historia"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-amarelomoikato-700 transition-colors hover:text-amarelomoikato-800"
          >
            {dict.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
