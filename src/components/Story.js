import Image from "next/image";

// "Nossa história" — full-bleed: foto encostada na esquerda + texto à direita,
// seção com altura de tela (sem margens brancas). Ref editorial.
export default function Story({ dict }) {
  return (
    <section id="historia" className="scroll-mt-24 bg-osso">
      <div className="grid lg:min-h-svh lg:grid-cols-2">
        <div className="relative min-h-[55svh] w-full lg:min-h-svh">
          <Image
            src="/story.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
          <p className="mt-5 max-w-xl font-display text-3xl font-light leading-snug text-verdemoikato sm:text-[2.3rem]">
            {dict.quote}
          </p>
          <a
            href="#historia"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-amarelomoikato-700 transition-colors hover:text-amarelomoikato-800"
          >
            {dict.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
