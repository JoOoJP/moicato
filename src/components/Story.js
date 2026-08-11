import Image from "next/image";

// "Nossa história" — full-bleed: foto encostada na esquerda + texto à direita,
// seção com altura de tela (sem margens brancas). Ref editorial.
export default function Story({ dict }) {
  return (
    <section id="historia" className="scroll-mt-24 bg-floresta">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src="/story-samuel.webp"
            alt={dict.imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
          <span className="eyebrow text-amarelomoikato-300">{dict.eyebrow}</span>
          <p className="mt-5 max-w-xl font-display text-3xl font-light leading-snug text-osso sm:text-[2.3rem]">
            {dict.quote}
          </p>
        </div>
      </div>
    </section>
  );
}
