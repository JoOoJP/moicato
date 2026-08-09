import Image from "next/image";

export default function Events({ dict }) {
  const [nextEvent, ...pastEvents] = dict.events;

  return (
    <section id="feiras" className="scroll-mt-24 bg-osso-100">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-8 border-t border-floresta/20 pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight text-floresta sm:text-5xl">
              {dict.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-floresta/65">
            {dict.intro}
          </p>
        </div>

        <article className="mt-12 grid overflow-hidden bg-floresta text-osso lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative min-h-[25rem] lg:min-h-[34rem]">
            <Image
              src={nextEvent.image}
              alt={nextEvent.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover brightness-[0.82] saturate-[0.78]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-floresta-900/55 via-transparent to-transparent"
            />
            <span className="absolute left-5 top-5 bg-osso px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-floresta">
              {dict.nextLabel}
            </span>
          </div>

          <div className="flex flex-col justify-between px-7 py-9 sm:px-10 sm:py-12">
            <div>
              <div className="flex items-end gap-4 border-b border-osso/20 pb-7">
                <span className="font-display text-6xl font-light leading-none text-amarelomoikato-300 sm:text-7xl">
                  {nextEvent.day}
                </span>
                <span className="pb-1 text-sm font-semibold uppercase tracking-[0.15em] text-osso/65">
                  {nextEvent.month}<br />{nextEvent.year}
                </span>
              </div>
              <h3 className="mt-8 font-display text-3xl font-light text-osso sm:text-4xl">
                {nextEvent.name}
              </h3>
              <p className="mt-3 text-base text-osso/75">{nextEvent.place}</p>
              <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="eyebrow text-amarelomoikato-300">{dict.when}</dt>
                  <dd className="mt-2 text-osso/80">{nextEvent.schedule}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-amarelomoikato-300">{dict.where}</dt>
                  <dd className="mt-2 text-osso/80">{nextEvent.address}</dd>
                </div>
              </dl>
            </div>
            <a
              href={nextEvent.mapUrl}
              className="mt-10 inline-flex min-h-11 w-fit items-center border-b border-amarelomoikato-300/60 text-sm font-semibold uppercase tracking-[0.14em] text-amarelomoikato-300 outline-none transition-colors hover:border-osso hover:text-osso focus-visible:ring-2 focus-visible:ring-amarelomoikato-300"
            >
              {dict.routeCta} <span aria-hidden="true" className="ml-2">→</span>
            </a>
          </div>
        </article>

        <div className="mt-14 flex items-baseline justify-between border-b border-floresta/20 pb-4">
          <h3 className="font-display text-2xl font-light text-floresta">
            {dict.previousTitle}
          </h3>
          <span className="text-[0.65rem] uppercase tracking-[0.15em] text-floresta/45">
            {dict.demoNote}
          </span>
        </div>

        <div className="grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <article key={event.name} className="group">
              <div className="relative aspect-[16/10] overflow-hidden bg-floresta-200">
                <Image
                  src={event.image}
                  alt={event.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover saturate-[0.72] transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                  style={{ objectPosition: event.imagePosition ?? "center" }}
                />
              </div>
              <div className="mt-5 grid grid-cols-[4.5rem_1fr] gap-5 border-b border-floresta/20 pb-5">
                <p className="font-display text-2xl italic text-amarelomoikato-700">
                  {event.day} {event.monthShort}
                </p>
                <div>
                  <h4 className="font-display text-xl font-light text-floresta">
                    {event.name}
                  </h4>
                  <p className="mt-1 text-sm text-floresta/60">{event.place}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
