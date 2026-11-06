"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../ProductCard";
import { KINDS } from "../../lib/kinds";

// Catálogo-galeria. "Todas" mostra capítulos por coleção; um tipo mostra a
// grade só daquele tipo. O filtro vive na URL (?tipo=brincos) para ser
// compartilhável, sem tornar a página dinâmica.
export default function CatalogBrowser({ pieces, collections, lang, t, shop, pricing }) {
  const isEn = lang === "en";
  const kinds = useMemo(
    () =>
      KINDS.filter((kind) => pieces.some((p) => p.kind === kind.id)).map((kind) => ({
        ...kind,
        label: isEn ? kind.en : kind.pt,
        slug: isEn ? kind.slugEn : kind.slugPt,
        count: pieces.filter((p) => p.kind === kind.id).length,
      })),
    [pieces, isEn]
  );
  const [active, setActive] = useState("all");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tipo");
    const match = kinds.find((k) => k.slug === fromUrl || k.id === fromUrl);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setActive(match.id);
  }, [kinds]);

  function choose(id) {
    setActive(id);
    const url = new URL(window.location.href);
    const kind = kinds.find((k) => k.id === id);
    if (kind) url.searchParams.set("tipo", kind.slug);
    else url.searchParams.delete("tipo");
    window.history.replaceState(null, "", url);
  }

  const chapters = useMemo(() => {
    const list = collections
      .map((collection) => ({ ...collection, pieces: pieces.filter((p) => p.collection?.id === collection.id) }))
      .filter((chapter) => chapter.pieces.length > 0);
    const loose = pieces.filter((p) => !p.collection);
    if (loose.length) list.push({ id: "outras", name: isEn ? "More pieces" : "Outras peças", tagline: null, pieces: loose });
    return list;
  }, [collections, pieces, isEn]);

  const filtered = active === "all" ? null : pieces.filter((p) => p.kind === active);
  // Dentro de um capítulo a coleção já está no título: o card mostra o tipo.
  const card = (piece, index, priority = false, subline) => (
    <ProductCard key={piece.slug} piece={piece} lang={lang} label={t.viewPiece} pricing={pricing} t={shop} subline={subline} priority={priority && index < 3} />
  );
  const grid = "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3";

  return (
    <>
      <div className="sticky top-[60px] z-30 border-y border-verdemoikato/10 bg-osso/95 backdrop-blur-md md:top-[73px]">
        <nav aria-label={t.filterLabel} className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 [scrollbar-width:none] sm:gap-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          {[{ id: "all", label: t.allPieces, count: pieces.length }, ...kinds].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => choose(item.id)}
              aria-pressed={active === item.id}
              className={`inline-flex min-h-12 shrink-0 items-center gap-1.5 border-b text-[0.85rem] transition-colors ${
                active === item.id
                  ? "border-verdemoikato text-verdemoikato"
                  : "border-transparent text-verdemoikato/55 hover:text-verdemoikato"
              }`}
            >
              {item.label}
              <span className="text-[0.7rem] text-verdemoikato/35">{item.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        {filtered ? (
          <section className="pt-10 sm:pt-14">
            {filtered.length === 0 ? (
              <p className="py-20 text-center text-verdemoikato/60">{t.emptyFilter}</p>
            ) : (
              <div className={grid}>{filtered.map((piece, index) => card(piece, index, true))}</div>
            )}
          </section>
        ) : (
          chapters.map((chapter, chapterIndex) => (
            <section key={chapter.id} id={chapter.slug} className="scroll-mt-32 border-b border-verdemoikato/10 py-12 last:border-b-0 sm:py-20">
              <header className="mb-9 grid gap-2 sm:mb-12 md:grid-cols-[1fr_1fr] md:items-end md:gap-10">
                <div>
                  <p className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">
                    {t.collectionLabel.toUpperCase()} · {String(chapterIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-display text-[2.6rem] font-light leading-none text-verdemoikato sm:text-6xl">{chapter.name}</h2>
                </div>
                {chapter.tagline && (
                  <p className="max-w-md font-display text-lg italic leading-snug text-verdemoikato/65 md:justify-self-end md:text-right">
                    {chapter.tagline}
                  </p>
                )}
              </header>
              <div className={grid}>{chapter.pieces.map((piece, index) => card(piece, index, chapterIndex === 0, piece.kindName ?? null))}</div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
