import Image from "next/image";

export default function Events({ dict }) {
  return (
    <section id="feiras" className="scroll-mt-24 bg-osso-100">
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

        <div className="mt-12 grid gap-x-7 gap-y-10 md:grid-cols-12">
          {dict.events.map((event, index) => (
            <article
              key={event.name}
              className={index === 0 ? "md:col-span-7" : "md:col-span-5"}
            >
              <div className={`relative overflow-hidden bg-floresta-200 ${index === 0 ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
                <Image
                  src={event.image}
                  alt={event.alt}
                  fill
                  sizes={index === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
                  className="object-cover transition-transform duration-700 hover:scale-[1.015] motion-reduce:transition-none"
                  style={{ objectPosition: event.imagePosition ?? "center" }}
                />
              </div>
              <div className="mt-5 grid grid-cols-[2.5rem_1fr] gap-4 border-b border-floresta/20 pb-5">
                <span className="font-display text-xl italic text-amarelomoikato-700">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-2xl font-light text-floresta">{event.name}</h3>
                  <p className="mt-1.5 text-sm text-floresta/60">{event.place}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-2xl border-l border-amarelomoikato-700 pl-5 text-sm leading-relaxed text-floresta/65">
          {dict.closing}
        </p>
      </div>
    </section>
  );
}
