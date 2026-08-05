import PlaceholderImage from "./PlaceholderImage";
import { waLink, whatsappReady } from "../lib/contato";

const external = whatsappReady
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

// Grade de coleção: cabeçalho (Coleção / Ver todas) + 3 produtos com foto,
// nome e preço em £. Compra via WhatsApp (só aparência de loja).
export default function Collection({ dict }) {
  return (
    <section id="colecao" className="scroll-mt-24 bg-osso">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-4 sm:pb-24">
        <div className="flex items-center justify-between border-t border-verdemoikato/15 pt-6">
          <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
          <a
            href="#colecao"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-verdemoikato/70 transition-colors hover:text-amarelomoikato-700"
          >
            {dict.viewAll} →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
          {dict.pieces.map((p, i) => (
            <a
              key={i}
              href={waLink(
                dict.waPiece.replace("{name}", p.name).replace("{price}", p.price)
              )}
              {...external}
              className="group block outline-none"
            >
              <PlaceholderImage
                label={`Foto produto — ${p.name}`}
                className="aspect-[4/5] w-full transition-opacity group-hover:opacity-90"
              />
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg text-verdemoikato">
                  {p.name}
                </h3>
                <span className="text-sm text-verdemoikato/70">{p.price}</span>
              </div>
              <span className="mt-1 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-amarelomoikato-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {dict.order} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
