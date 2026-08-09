import Image from "next/image";
import { waLink } from "../lib/contato";

export default function EventInvitation({ dict }) {
  return (
    <section aria-labelledby="event-invitation-title" className="bg-osso py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative min-h-[32rem] overflow-hidden sm:min-h-[38rem] lg:min-h-[42rem]">
          <Image
            src="/samuel-hat.jpeg"
            alt={dict.imageAlt}
            fill
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover object-center"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-floresta-900/85 via-floresta-900/15 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 sm:pb-10 lg:px-12 lg:pb-12">
            <p className="eyebrow text-amarelomoikato-300">{dict.eyebrow}</p>
            <h2
              id="event-invitation-title"
              className="mt-4 max-w-3xl font-display text-4xl font-light leading-[1.06] text-osso sm:text-5xl lg:text-6xl"
            >
              {dict.title}
            </h2>
          </div>
        </div>

        <div className="grid border-x border-b border-verdemoikato/15 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex items-center border-b border-verdemoikato/15 px-6 py-7 sm:px-8 lg:border-b-0 lg:border-r">
            <p className="max-w-md text-sm leading-relaxed text-verdemoikato/65 sm:text-base">
              {dict.intro}
            </p>
          </div>

          <div className="grid sm:grid-cols-2">
            {dict.options.map((option, index) => (
              <a
                key={option.title}
                href={waLink(option.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex min-h-32 items-center justify-between gap-5 px-6 py-6 outline-none transition-colors hover:bg-amarelomoikato/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amarelomoikato-700 sm:px-7 ${
                  index === 0
                    ? "border-b border-verdemoikato/15 sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                <span>
                  <span className="eyebrow text-amarelomoikato-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="mt-2 block font-display text-xl font-light leading-snug text-verdemoikato sm:text-2xl">
                    {option.title}
                  </strong>
                  <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-amarelomoikato-700">
                    {option.cta}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-xl text-amarelomoikato-700 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
