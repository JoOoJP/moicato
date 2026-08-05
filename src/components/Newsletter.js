import PlaceholderImage from "./PlaceholderImage";

// "Continue perto do Brasil." — captura de e-mail (visual; ligar a Brevo/
// Mailchimp depois) + foto de detalhe na borda.
export default function Newsletter({ dict }) {
  return (
    <section className="border-t border-verdemoikato/10 bg-osso">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-3xl font-light text-verdemoikato sm:text-4xl">
            {dict.title}
          </h2>
          <div className="mt-6 flex items-center gap-3 border-b border-verdemoikato/25 pb-2">
            <input
              type="email"
              placeholder={dict.placeholder}
              aria-label={dict.title}
              className="w-full bg-transparent text-sm text-verdemoikato outline-none placeholder:text-verdemoikato/45"
            />
            <button
              type="button"
              aria-label={dict.cta}
              className="shrink-0 text-lg text-amarelomoikato-700 outline-none transition-colors hover:text-amarelomoikato-800 focus-visible:text-amarelomoikato-800"
            >
              →
            </button>
          </div>
          <p className="mt-3 text-xs text-verdemoikato/55">{dict.note}</p>
        </div>
        <PlaceholderImage
          label="Foto — orelha com brinco de capim dourado"
          className="hidden aspect-[3/2] w-full lg:block"
        />
      </div>
    </section>
  );
}
