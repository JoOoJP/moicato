import Image from "next/image";

export default function Worn({ dict }) {
  return (
    <section className="bg-osso">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
          <h2 className="mt-4 max-w-md font-display text-4xl font-light leading-[1.1] text-verdemoikato sm:text-5xl">
            {dict.title}
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-verdemoikato/60">
            {dict.caption}
          </p>
          <a
            href="#colecao"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-amarelomoikato-700 transition-colors hover:text-amarelomoikato-800"
          >
            {dict.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="grid grid-cols-[1.18fr_0.82fr] items-start gap-3 sm:gap-5">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/model-backstage.png"
                alt={dict.backstageAlt}
                fill
                sizes="(min-width: 1024px) 39vw, 58vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-verdemoikato/45">
              {dict.backstageCaption}
            </figcaption>
          </figure>

          <figure className="mt-14 sm:mt-20">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/model-editorial.png"
                alt={dict.editorialAlt}
                fill
                sizes="(min-width: 1024px) 27vw, 38vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-verdemoikato/45">
              {dict.editorialCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
