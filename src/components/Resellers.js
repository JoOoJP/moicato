import Image from "next/image";
import { waLink } from "../lib/contato";

export default function Resellers({ dict }) {
  return (
    <section id="revendedores" className="scroll-mt-24 bg-osso">
      <div className="mx-auto grid max-w-6xl border-y border-verdemoikato/15 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-12 xl:px-14">
          <p className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</p>
          <h2 className="mt-5 max-w-lg font-display text-4xl font-light leading-[1.08] text-verdemoikato sm:text-5xl">
            {dict.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-verdemoikato/65">
            {dict.intro}
          </p>

          <div className="mt-8 border-y border-verdemoikato/15 py-5">
            <p className="text-sm leading-relaxed text-verdemoikato/70">
              {dict.details}
            </p>
          </div>

          <a
            href={waLink(dict.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 bg-verdemoikato px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-osso outline-none transition-colors hover:bg-amarelomoikato hover:text-verdemoikato focus-visible:ring-2 focus-visible:ring-amarelomoikato-700 focus-visible:ring-offset-2 focus-visible:ring-offset-osso"
          >
            {dict.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative min-h-[30rem] overflow-hidden sm:min-h-[38rem]">
          <Image
            src="/event-samuel-fair.png"
            alt={dict.imageAlt}
            fill
            sizes="(min-width: 1024px) 57vw, 100vw"
            className="object-cover object-[center_28%]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-floresta-900/55 via-transparent to-transparent"
          />
          <p className="absolute bottom-7 left-6 max-w-xs text-xs font-semibold uppercase leading-relaxed tracking-[0.17em] text-osso sm:bottom-9 sm:left-9">
            {dict.imageCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
