import Image from "next/image";
import Divider from "./Divider";

export default function FilmSection({ dict }) {
  return (
    <section className="bg-osso">
      <div className="mx-auto grid max-w-6xl border-y border-verdemoikato/12 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:pr-16">
          <span className="eyebrow text-amarelomoikato-700">
            {dict.eyebrow}
          </span>
          <p className="mt-5 max-w-lg font-display text-3xl font-light leading-snug text-verdemoikato sm:text-4xl">
            {dict.line}
          </p>
          <Divider className="mt-8" />
        </div>

        <div className="grid min-h-[28rem] grid-cols-[1.45fr_0.75fr] sm:min-h-[34rem]">
          <div className="relative">
            <Image
              src="/tecendo.jpg"
              alt={dict.craftAlt}
              fill
              sizes="(min-width: 1024px) 42vw, 70vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-floresta-900/15 via-transparent to-transparent"
            />
          </div>

          <div className="grid grid-rows-[1fr_auto]">
            <div className="relative min-h-56">
              <Image
                src="/mesa.jpg"
                alt={dict.tableAlt}
                fill
                sizes="(min-width: 1024px) 22vw, 30vw"
                className="object-cover"
              />
            </div>

            <div className="flex min-h-44 flex-col justify-between bg-floresta p-5 text-osso sm:min-h-52 sm:p-7">
              <span className="eyebrow text-amarelomoikato-300">
                {dict.film}
              </span>
              <div>
                <span
                  aria-hidden="true"
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-osso/40"
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 20 22"
                    fill="currentColor"
                    className="ml-0.5"
                  >
                    <path d="M2 2l16 9-16 9V2z" />
                  </svg>
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-osso/65">
                  {dict.filmStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
