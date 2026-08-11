"use client";

import Image from "next/image";
import { useState } from "react";
import { waLink, whatsappReady } from "../lib/contato";

const external = whatsappReady
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

export default function Collection({ dict }) {
  const [activePiece, setActivePiece] = useState(null);
  const active = activePiece === null ? null : dict.pieces[activePiece];
  const showWatermark =
    activePiece === null ? dict.featuredWatermark : active?.watermark;

  return (
    <section id="colecao" className="scroll-mt-24 bg-osso">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <header className="grid gap-7 border-t border-verdemoikato/20 pt-7 md:grid-cols-[1fr_0.9fr] md:items-end">
          <div>
            <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] text-verdemoikato sm:text-6xl">
              {dict.title}
            </h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-verdemoikato/70 md:justify-self-end">
            {dict.intro}
          </p>
        </header>

        <div className="mt-10 grid gap-9 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:items-start md:gap-10 lg:mt-12 lg:gap-14">
          <figure className="md:sticky md:top-24">
            <div className="relative aspect-[4/5] overflow-hidden bg-areia-200">
              {[
                {
                  image: dict.featuredImage,
                  imageAlt: dict.featuredAlt,
                  imagePosition: dict.featuredImagePosition,
                },
                ...dict.pieces,
              ].map(
                (piece, index) => {
                  const visible = activePiece === null ? index === 0 : index === activePiece + 1;
                  return (
                    <Image
                      key={`${piece.image}-${index}`}
                      src={piece.image}
                      alt={visible ? piece.imageAlt : ""}
                      fill
                      sizes="(min-width: 1024px) 42vw, (min-width: 768px) 44vw, 100vw"
                      className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                        visible ? "scale-100 opacity-100" : "pointer-events-none scale-[1.015] opacity-0"
                      }`}
                      style={{ objectPosition: piece.imagePosition ?? "center" }}
                    />
                  );
                }
              )}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-3 right-3 h-14 w-[18%] min-w-20 max-w-28 transition-opacity duration-500 motion-reduce:transition-none sm:bottom-5 sm:right-5 ${
                  showWatermark ? "opacity-55" : "opacity-0"
                }`}
              >
                <Image
                  src="/logo-moikato-header.png"
                  alt=""
                  fill
                  sizes="112px"
                  className="object-contain brightness-0 invert"
                />
              </span>
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 border-b border-verdemoikato/20 pb-4 text-xs uppercase tracking-[0.14em] text-verdemoikato/65">
              <span>{active ? active.name : dict.featuredCaption}</span>
              <span className="text-amarelomoikato-700">01</span>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-center">
            <p className="eyebrow text-verdemoikato/55">{dict.selectionLabel}</p>
            <div className="mt-5 border-t border-verdemoikato/20">
              {dict.pieces.map((piece, index) => (
                <div
                  key={piece.name}
                  onMouseEnter={() => setActivePiece(index)}
                  onMouseLeave={() => setActivePiece(null)}
                  className={`group grid min-h-32 grid-cols-[1fr_auto] items-stretch border-b py-3 transition-colors sm:min-h-28 sm:py-2 ${
                    activePiece === index
                      ? "border-amarelomoikato-700"
                      : "border-verdemoikato/20 hover:border-amarelomoikato-700"
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={activePiece === index}
                    aria-label={`${dict.previewLabel}: ${piece.name}`}
                    onClick={() => setActivePiece(index)}
                    onFocus={() => setActivePiece(index)}
                    className="grid min-h-24 grid-cols-[4.25rem_1fr] items-center gap-3 py-3 pr-3 text-left outline-none ring-inset ring-amarelomoikato/60 focus-visible:ring-2 sm:grid-cols-[3rem_1fr] sm:gap-4"
                  >
                    <span className="relative block h-20 w-16 overflow-hidden bg-areia-200 sm:hidden">
                      <Image
                        src={piece.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        style={{ objectPosition: piece.imagePosition ?? "center" }}
                      />
                      <span className="absolute left-1.5 top-1.5 bg-osso/90 px-1.5 py-0.5 font-display text-sm italic text-amarelomoikato-700">
                        0{index + 1}
                      </span>
                    </span>
                    <span className="hidden font-display text-xl italic text-amarelomoikato-700 sm:block">
                      0{index + 1}
                    </span>
                    <span>
                      <span className="block font-display text-xl text-verdemoikato sm:text-2xl">
                        {piece.name}
                      </span>
                      <span className="mt-1.5 block text-xs uppercase tracking-[0.12em] text-verdemoikato/55">
                        {dict.handmade}
                      </span>
                    </span>
                  </button>

                  <a
                    href={waLink(
                      dict.waPiece
                        .replace("{name}", piece.name)
                        .replace(
                          "{price}",
                          piece.priceNote
                            ? `${piece.price} · ${piece.priceNote}`
                            : piece.price
                        )
                    )}
                    {...external}
                    className="flex min-h-24 min-w-[6.5rem] flex-col items-end justify-center py-3 pl-3 text-right outline-none ring-inset ring-amarelomoikato/60 focus-visible:ring-2"
                  >
                    <span className="block text-sm text-verdemoikato/75">{piece.price}</span>
                    {piece.priceNote && (
                      <span className="mt-0.5 block max-w-28 text-[0.65rem] leading-tight text-verdemoikato/55">
                        {piece.priceNote}
                      </span>
                    )}
                    <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.12em] text-amarelomoikato-700 transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                      {dict.order} →
                    </span>
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 border-l border-amarelomoikato-700 pl-5">
              <p className="text-sm leading-relaxed text-verdemoikato/65">
                {active?.description ?? dict.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
