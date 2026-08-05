import PlaceholderImage from "./PlaceholderImage";

// Hero cinematográfico: foto full-bleed (placeholder), headline serifada branca,
// botão dourado. Ref: modelo de costas em rua de Londres.
export default function Hero({ dict }) {
  return (
    <section
      id="topo"
      className="relative flex min-h-[92svh] items-end overflow-hidden"
    >
      <PlaceholderImage
        tone="dark"
        label="Foto hero — modelo de costas, rua de Londres"
        className="absolute inset-0 h-full w-full"
      />
      {/* escurecedor à esquerda pra legibilidade do texto */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-floresta-900/75 via-floresta-900/30 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-floresta-900/60 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 sm:pb-28">
        <h1 className="max-w-2xl font-display text-5xl font-light leading-[1.04] text-osso sm:text-6xl lg:text-[4.75rem]">
          {dict.title}
        </h1>
        <p className="mt-5 font-display text-xl italic text-osso/85 sm:text-2xl">
          {dict.sub}
        </p>
        <a
          href="#colecao"
          className="mt-9 inline-flex items-center bg-amarelomoikato-600 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white outline-none ring-amarelomoikato/50 ring-offset-2 ring-offset-transparent transition-colors hover:bg-amarelomoikato-700 focus-visible:ring-2"
        >
          {dict.cta}
        </a>
      </div>
    </section>
  );
}
