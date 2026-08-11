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
              src="/tecendo.webp"
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

          <div className="relative min-h-[28rem] overflow-hidden sm:min-h-[34rem]">
            <Image
              src="/mesa.webp"
              alt={dict.tableAlt}
              fill
              sizes="(min-width: 1024px) 22vw, 30vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[28%] via-floresta/75 via-[58%] to-floresta to-[78%]"
            />

            <div className="absolute inset-x-0 bottom-0 flex min-h-52 flex-col justify-between p-5 text-osso sm:min-h-60 sm:p-7">
              <span className="eyebrow text-amarelomoikato-300">
                {dict.detailLabel}
              </span>
              <div>
                <span aria-hidden="true" className="mb-5 block h-px w-10 bg-amarelomoikato-300" />
                <p className="max-w-xs font-display text-xl font-light leading-snug text-osso/80 sm:text-2xl">
                  {dict.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
