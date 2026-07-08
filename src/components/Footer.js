import Logo from "./Logo";
import {
  waLink,
  whatsappReady,
  INSTAGRAM,
  INSTAGRAM_URL,
} from "../lib/contato";

const external = whatsappReady
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

// Créditos das fotos da seção "Do Cerrado à joia" (Wikimedia Commons).
// CC BY / CC BY-SA exigem atribuição visível. Trocar quando entrarem fotos próprias.
const CREDITS = [
  { scene: "01", title: "Capim Dourado", author: "Daniel Zilenovski", source: "https://commons.wikimedia.org/wiki/File:Capim_Dourado.JPG", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0" },
  { scene: "02", title: "Golden Grass Harvest, Jalapão", author: "Guilherme Moura Fagundes", source: "https://commons.wikimedia.org/wiki/File:Golden_Grass_Harvest_Jalapao_Guilherme_Fagundes.jpg", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0" },
  { scene: "03", title: "Jalapão", author: "MACRIMM", source: "https://commons.wikimedia.org/wiki/File:Jalap%C3%A3o_4.JPG", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0" },
  { scene: "04", title: "Artesanato capim dourado", author: "Mrpiccin", source: "https://commons.wikimedia.org/wiki/File:Artesanato_capim_dourado.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" },
  { scene: "05", title: "Brincos de Capim Dourado", author: "Vchoi", source: "https://commons.wikimedia.org/wiki/File:Brincos_de_Capim_Dourado.jpg", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5" },
  { scene: "★", title: "Comunidade quilombola de Mumbuca", author: "Alexandre Marino", source: "https://commons.wikimedia.org/wiki/File:Capim_Dourado_-_Comunidade_quilombola_de_Mumbuca_-_Mateiros_TO_(4)_(53037300634).jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" },
];

export default function Footer({ dict }) {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="scroll-mt-24">
      {/* Chamada de contato */}
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="border border-amarelomoikato/30 bg-gradient-to-br from-white to-amarelomoikato/10 px-8 py-16 text-center sm:px-14">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
            <span className="eyebrow text-amarelomoikato-700">{dict.eyebrow}</span>
            <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
          </div>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
            {dict.title}
          </h2>
          <p className="lead mx-auto mt-4 max-w-xl">{dict.lead}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waLink(dict.waFooter)}
              {...external}
              className="bg-verdemoikato px-8 py-4 text-sm font-medium text-white outline-none ring-amarelomoikato/60 ring-offset-2 transition-colors hover:bg-verdemoikato-600 focus-visible:ring-2"
            >
              {dict.whatsapp}
            </a>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="border-t border-verdemoikato/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <Logo />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-verdemoikato-800/70">
            <a href="#colecao" className="hover:text-verdemoikato">
              {dict.nav.colecao}
            </a>
            <a href="#jornada" className="hover:text-verdemoikato">
              {dict.nav.jornada}
            </a>
            <a href="#sustentabilidade" className="hover:text-verdemoikato">
              {dict.nav.sustentabilidade}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-verdemoikato"
            >
              {INSTAGRAM}
            </a>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-verdemoikato-800/60">
          <p className="text-center sm:text-left">
            {dict.copyright.replace("{year}", String(year))}
          </p>
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-center text-verdemoikato-700/55 transition-colors hover:text-verdemoikato sm:text-left">
              {dict.imageCredits} ↓
            </summary>
            <ul className="mt-2 space-y-1 text-[0.7rem] leading-relaxed text-verdemoikato-700/55">
              {CREDITS.map((c) => (
                <li key={c.title}>
                  <span className="text-verdemoikato-700/50">{c.scene}</span> “{c.title}” — {c.author} ·{" "}
                  <a
                    href={c.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:text-verdemoikato"
                  >
                    Wikimedia Commons
                  </a>{" "}
                  ·{" "}
                  <a
                    href={c.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:text-verdemoikato"
                  >
                    {c.license}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
