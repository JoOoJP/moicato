import Image from "next/image";
import { waLink, whatsappReady } from "../lib/contato";

// O catálogo se comporta como uma galeria editorial: a forma orgânica vem da
// própria joia e da fotografia, não de recortes decorativos na interface.

const external = whatsappReady
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

export default function Catalog({ dict }) {
  return (
    <section id="colecao" className="scroll-mt-24 bg-areia-50">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-14 sm:pb-28 sm:pt-16">
        <div className="grid gap-8 border-b border-verdemoikato/15 pb-10 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
              <span className="eyebrow text-amarelomoikato-800">
                {dict.eyebrow}
              </span>
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl">{dict.title}</h2>
          </div>
          <p className="lead max-w-xl md:justify-self-end">{dict.lead}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-24">
          {dict.pieces.map((p, i) => {
            const featured = i % 3 === 2;

            return (
              <article
                key={i}
                className={`group ${
                  featured
                    ? "sm:col-span-2 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.45fr)] lg:items-end lg:gap-10"
                    : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-areia-200 ${
                    featured
                      ? "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/9]"
                      : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={p.image}
                    alt={`${p.name} — ${p.material} · ${dict.altSuffix}`}
                    fill
                    sizes={
                      featured
                        ? "(min-width: 1024px) 62vw, (min-width: 640px) 90vw, 100vw"
                        : "(min-width: 1024px) 42vw, (min-width: 640px) 46vw, 100vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                  <span className="absolute left-4 top-4 bg-areia/90 px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-verdemoikato backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className={`border-b border-verdemoikato/20 pb-5 ${
                    featured ? "mt-5 lg:mt-0 lg:pb-7" : "mt-5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3
                        className={
                          featured
                            ? "text-2xl leading-tight lg:text-3xl"
                            : "text-xl leading-tight"
                        }
                      >
                        {p.name}
                      </h3>
                      <p className="mt-2 text-sm text-verdemoikato-700/70">
                        {p.material}
                        {p.tag ? ` · ${p.tag}` : ""}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-verdemoikato-700/55">
                        {dict.availability}
                      </p>
                    </div>
                    <a
                      href={waLink(
                        dict.waPiece
                          .replace("{name}", p.name)
                          .replace("{material}", p.material)
                      )}
                      {...external}
                      className="inline-flex min-h-11 shrink-0 items-center border-b border-verdemoikato/40 text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-4 ring-offset-areia-50 transition-colors hover:border-terra-600 hover:text-terra-600 focus-visible:ring-2"
                    >
                      {dict.order}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center sm:justify-start">
          <a
            href={waLink(dict.waCatalog)}
            {...external}
            className="inline-flex border border-verdemoikato/40 px-8 py-4 text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors hover:bg-verdemoikato hover:text-white focus-visible:ring-2"
          >
            {dict.seeAll}
          </a>
        </div>
      </div>
    </section>
  );
}
