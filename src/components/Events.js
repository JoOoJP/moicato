import Image from "next/image";

export default function Events({ dict }) {
  return (
    <section id="feiras" className="scroll-mt-24 overflow-hidden bg-osso-100">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <header className="grid gap-7 border-t border-floresta/20 pt-7 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight text-floresta sm:text-5xl">
              {dict.title}
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-floresta/65 md:justify-self-end">
            {dict.intro}
          </p>
        </header>

        <div className="mt-10 flex items-center justify-between gap-6 border-t border-floresta/20 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-floresta/55">
            {dict.archiveLabel}
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-amarelomoikato-700">
            {dict.scrollHint} <span aria-hidden="true">→</span>
          </p>
        </div>

        <div className="-mx-6 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 sm:gap-6 md:mx-0 md:px-0">
          {dict.events.map((event, index) => (
            <article
              key={`${event.date}-${event.name}`}
              className="w-[82vw] max-w-[22rem] shrink-0 snap-start sm:w-[46vw] md:w-[31%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-floresta-200">
                <Image
                  src={event.image}
                  alt={event.alt}
                  fill
                  sizes="(min-width: 1024px) 350px, (min-width: 640px) 46vw, 82vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.015] motion-reduce:transition-none"
                  style={{ objectPosition: event.imagePosition ?? "center" }}
                />
                <span className="absolute left-3 top-3 bg-osso/90 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-floresta backdrop-blur-sm">
                  {event.date}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-[2.25rem_1fr] gap-3 border-b border-floresta/20 pb-5">
                <span className="font-display text-lg italic text-amarelomoikato-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-light leading-snug text-floresta sm:text-2xl">
                    {event.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-floresta/60">{event.place}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 max-w-2xl border-l border-amarelomoikato-700 pl-5 text-sm leading-relaxed text-floresta/65">
          {dict.closing}
        </p>
      </div>
    </section>
  );
}
