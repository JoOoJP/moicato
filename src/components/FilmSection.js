import Divider from "./Divider";
import PlaceholderImage from "./PlaceholderImage";

// Manifesto central + divisor de espiga + banda de 3 fotos edge-to-edge com
// botão de play ("Assista ao filme") sobreposto no centro.
export default function FilmSection({ dict }) {
  return (
    <section className="bg-osso">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
        <p className="font-display text-3xl leading-snug text-verdemoikato sm:text-4xl">
          {dict.line}
        </p>
        <Divider className="mt-8" />
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-3">
        <PlaceholderImage
          tone="dark"
          label="Foto — mãos tecendo o capim"
          className="aspect-[4/3]"
        />
        <PlaceholderImage
          tone="dark"
          label="Filme — campo de capim ao vento"
          className="aspect-[4/3]"
        />
        <PlaceholderImage
          tone="light"
          label='Foto — xícara "Brasil" na mesa'
          className="aspect-[4/3]"
        />

        <button
          type="button"
          aria-label={dict.film}
          className="group absolute inset-0 z-10 m-auto flex h-fit w-fit flex-col items-center gap-3 text-osso outline-none"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-osso/70 bg-floresta-900/30 backdrop-blur transition group-hover:bg-floresta-900/55 group-focus-visible:ring-2 group-focus-visible:ring-osso">
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="currentColor"
              aria-hidden="true"
              className="ml-1"
            >
              <path d="M2 2l16 9-16 9V2z" />
            </svg>
          </span>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
            {dict.film}
          </span>
        </button>
      </div>
    </section>
  );
}
