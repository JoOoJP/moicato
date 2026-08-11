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

        <div className="grid grid-cols-1 items-start sm:grid-cols-[1.18fr_0.82fr] sm:gap-5">
          <figure className="mr-8 sm:mr-0">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/model-backstage.webp"
                alt={dict.backstageAlt}
                fill
                sizes="(min-width: 1024px) 39vw, (min-width: 640px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-verdemoikato/65">
              {dict.backstageCaption}
            </figcaption>
          </figure>

          <figure className="relative z-10 -mt-16 ml-auto w-[78%] sm:mt-20 sm:w-auto">
            <div className="relative aspect-[3/4] overflow-hidden ring-8 ring-osso sm:ring-0">
              <Image
                src="/model-editorial.webp"
                alt={dict.editorialAlt}
                fill
                sizes="(min-width: 1024px) 27vw, (min-width: 640px) 38vw, 78vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-verdemoikato/65">
              {dict.editorialCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
