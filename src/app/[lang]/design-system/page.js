import Reveal from "../../../components/Reveal";
import Logo from "../../../components/Logo";
import CapimFlor from "../../../components/CapimFlor";
import Folhagem from "../../../components/Folhagem";
import Tucano from "../../../components/Tucano";
import BandeiraBR from "../../../components/BandeiraBR";

// Página interna (não indexar) — catálogo vivo da identidade visual da Moikato.
// Sem tabela/formulário/dialog: o site é institucional, sem esses componentes.
export const metadata = {
  title: "Design System — Moikato",
  robots: { index: false, follow: false },
};

const VERDE = [
  ["bg-verdemoikato-50", "50"],
  ["bg-verdemoikato-100", "100"],
  ["bg-verdemoikato-200", "200"],
  ["bg-verdemoikato-300", "300"],
  ["bg-verdemoikato-400", "400"],
  ["bg-verdemoikato", "DEFAULT"],
  ["bg-verdemoikato-600", "600"],
  ["bg-verdemoikato-700", "700"],
  ["bg-verdemoikato-800", "800"],
  ["bg-verdemoikato-900", "900"],
];

const AMARELO = [
  ["bg-amarelomoikato-50", "50"],
  ["bg-amarelomoikato-100", "100"],
  ["bg-amarelomoikato-200", "200"],
  ["bg-amarelomoikato-300", "300"],
  ["bg-amarelomoikato-400", "400"],
  ["bg-amarelomoikato", "DEFAULT"],
  ["bg-amarelomoikato-600", "600"],
  ["bg-amarelomoikato-700", "700"],
  ["bg-amarelomoikato-800", "800"],
  ["bg-amarelomoikato-900", "900"],
];

const AREIA = [
  ["bg-areia-50", "50"],
  ["bg-areia-100", "100"],
  ["bg-areia-200", "200"],
  ["bg-areia-300", "300"],
  ["bg-areia-400", "400"],
  ["bg-areia", "DEFAULT"],
  ["bg-areia-600", "600"],
  ["bg-areia-700", "700"],
];

const TERRA = [
  ["bg-terra-50", "50"],
  ["bg-terra-100", "100"],
  ["bg-terra-200", "200"],
  ["bg-terra-300", "300"],
  ["bg-terra-400", "400"],
  ["bg-terra", "DEFAULT"],
  ["bg-terra-600", "600"],
  ["bg-terra-700", "700"],
];

function Secao({ titulo, descricao, children }) {
  return (
    <section className="border-t border-verdemoikato/10 py-14">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl text-verdemoikato">{titulo}</h2>
        {descricao ? <p className="lead mt-2">{descricao}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Escala({ nome, tokenBase, tons }) {
  return (
    <div>
      <div className="eyebrow mb-3 text-verdemoikato-700/70">{nome}</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {tons.map(([classe, rotulo]) => (
          <div key={classe} className="flex flex-col gap-1.5">
            <div
              className={`h-14 border border-verdemoikato/10 ${classe}`}
            />
            <div className="text-xs">
              <div className="font-medium text-verdemoikato-700">
                {rotulo}
              </div>
              <div className="font-mono text-[10px] text-verdemoikato/50">
                {classe}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1 font-mono text-[11px] text-verdemoikato/40">
        {tokenBase}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="relative z-10 min-h-svh bg-areia pt-24 pb-24">
      <header
        id="topo-design-system"
        className="mx-auto flex max-w-5xl items-center justify-between px-6"
      >
        <Logo />
        <span className="eyebrow rounded-none border border-verdemoikato/15 bg-white/50 px-3 py-1.5 text-verdemoikato-700">
          Design System
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <Secao
          titulo="Identidade"
          descricao="Verde Moikato + capim dourado + areia do Cerrado + terracota. Site institucional sem biblioteca de componentes — tudo bespoke em Tailwind. Fonte da verdade: nunca cor crua fora daqui, sempre a paleta nomeada (verdemoikato / amarelomoikato / areia / terra) já em tailwind.config.cjs."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-16 border border-verdemoikato/10 bg-verdemoikato" />
              <div className="text-xs font-medium text-verdemoikato-700">
                Verde principal
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-16 border border-verdemoikato/10 bg-amarelomoikato" />
              <div className="text-xs font-medium text-verdemoikato-700">
                Dourado (capim)
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-16 border border-verdemoikato/10 bg-areia" />
              <div className="text-xs font-medium text-verdemoikato-700">
                Areia (fundo)
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-16 border border-verdemoikato/10 bg-terra" />
              <div className="text-xs font-medium text-verdemoikato-700">
                Terra (terracota)
              </div>
            </div>
          </div>
        </Secao>

        <Secao titulo="Escalas de cor" descricao="tailwind.config.cjs — 4 famílias nomeadas, cada uma com DEFAULT + tons.">
          <div className="space-y-10">
            <Escala nome="Verde Moikato" tokenBase="verdemoikato" tons={VERDE} />
            <Escala nome="Amarelo (capim dourado)" tokenBase="amarelomoikato" tons={AMARELO} />
            <Escala nome="Areia (Cerrado)" tokenBase="areia" tons={AREIA} />
            <Escala nome="Terra (terracota)" tokenBase="terra" tons={TERRA} />
          </div>
        </Secao>

        <Secao
          titulo="Tipografia"
          descricao="Jost (font-display) para títulos — stand-in gratuito da Century Gothic do manual de marca. Geist (font-sans) para corpo. Kaushan Script (font-logo) só no wordmark do logo — stand-in gratuito da Mistral (+efeito pincelado), sem licença/arte vetorial ainda. Duas classes utilitárias próprias: .eyebrow e .lead."
        >
          <div className="space-y-6">
            <p className="font-logo text-6xl leading-none text-verdemoikato">
              moikato · font-logo
            </p>
            <p className="font-display text-6xl leading-[1.0] text-verdemoikato">
              Título <span className="italic text-amarelomoikato-700">em destaque</span>
            </p>
            <p className="font-display text-3xl text-verdemoikato">
              Título de seção · font-display text-3xl
            </p>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-amarelomoikato-700" />
              <span className="eyebrow text-amarelomoikato-700">
                Rótulo eyebrow · .eyebrow
              </span>
            </div>
            <p className="lead max-w-xl">
              Texto lead (subtítulo) · .lead — usado logo abaixo dos títulos de
              seção para o parágrafo de apoio.
            </p>
            <p className="max-w-xl font-sans">
              Corpo de texto padrão · font-sans (Geist) text-base, a cor
              herdada do <span className="font-mono text-xs">{"<p>"}</span> em
              globals.css.
            </p>
          </div>
        </Secao>

        <Secao
          titulo="Motivos de marca"
          descricao="Elementos do manual de marca oficial ainda não usados nas telas do site: tucano, folhagem tropical (palmeira + monstera) e o badge da bandeira do Brasil que acompanha 'Oficina de Artesanato Sustentável' em todo material impresso (cartão, tag, tote bag, parede). Line-art em currentColor — mesmo tratamento de traço do CapimFlor e dos ícones de Values.js, não clip-art flat colorido."
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-2">
              <CapimFlor className="h-12 text-verdemoikato" />
              <span className="text-xs font-medium text-verdemoikato-700">
                CapimFlor
              </span>
              <span className="font-mono text-[10px] text-verdemoikato/50">
                components/CapimFlor.js
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Folhagem className="h-12 w-12 text-verdemoikato-600" />
              <span className="text-xs font-medium text-verdemoikato-700">
                Folhagem
              </span>
              <span className="font-mono text-[10px] text-verdemoikato/50">
                components/Folhagem.js
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Tucano className="h-12 w-12 text-verdemoikato" />
              <span className="text-xs font-medium text-verdemoikato-700">
                Tucano
              </span>
              <span className="font-mono text-[10px] text-verdemoikato/50">
                components/Tucano.js
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BandeiraBR className="h-8 w-12" />
              <span className="text-xs font-medium text-verdemoikato-700">
                BandeiraBR
              </span>
              <span className="font-mono text-[10px] text-verdemoikato/50">
                components/BandeiraBR.js
              </span>
            </div>
          </div>

          <div className="gradiente-dourado mt-10 max-w-sm border border-verdemoikato/10 p-6">
            <div className="eyebrow text-verdemoikato-900/70">Exemplo</div>
            <p className="font-display mt-2 text-xl text-verdemoikato-900">
              Superfície .gradiente-dourado
            </p>
            <p className="mt-2 text-sm text-verdemoikato-900/70">
              #d5a84c para #b48332 — fundo do cartão de visita/crachá do
              manual.
            </p>
          </div>
        </Secao>

        <Secao
          titulo="Botões e links"
          descricao="Sem componente de Button — cada CTA é um <a>/<button> estilado direto. Recorte de foco padrão em todos: ring-amarelomoikato/60 ring-offset-2 ring-offset-areia. Cantos sempre retos (rounded-none) — assinatura editorial do site."
        >
          <div className="flex flex-wrap items-center gap-8">
            <a
              href="#topo-design-system"
              className="bg-verdemoikato px-8 py-4 text-sm font-medium tracking-wide text-white outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-all duration-300 hover:-translate-y-0.5 hover:bg-verdemoikato-600 hover:shadow-[0_10px_30px_-12px_rgba(26,67,40,0.5)] focus-visible:ring-2 active:translate-y-0"
            >
              CTA primário
            </a>

            <a
              href="#topo-design-system"
              className="group inline-flex items-center gap-2 text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia focus-visible:ring-2"
            >
              <span className="relative">
                CTA secundário
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-amarelomoikato transition-transform duration-300 group-hover:scale-x-100"
                />
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center border border-verdemoikato/15 bg-white/50 px-5 text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition hover:bg-white/80 focus-visible:ring-2"
            >
              Contorno
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-1">
            <a
              href="#topo-design-system"
              aria-current="page"
              className="relative rounded-none px-3 py-2 text-sm font-medium text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia focus-visible:ring-2"
            >
              Nav ativo
              <span aria-hidden className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-amarelomoikato to-amarelomoikato-600" />
            </a>
            <a
              href="#topo-design-system"
              className="group relative rounded-none px-3 py-2 text-sm font-medium text-verdemoikato-700/80 outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors hover:text-verdemoikato focus-visible:ring-2"
            >
              Nav inativo
              <span aria-hidden className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-amarelomoikato to-amarelomoikato-600 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          </div>
        </Secao>

        <Secao
          titulo="Superfícies"
          descricao="A única superfície nomeada é .card-bg — gradiente sutil dourado→branco pra destacar um bloco sobre o fundo areia."
        >
          <div className="card-bg max-w-sm border border-verdemoikato/10 p-6">
            <div className="eyebrow text-amarelomoikato-700">Exemplo</div>
            <p className="font-display mt-2 text-xl text-verdemoikato">
              Cartão com .card-bg
            </p>
            <p className="lead mt-2">
              Gradiente de rgba(212,175,55,.12) para branco — uso: destacar um
              bloco de conteúdo sem competir com o fundo areia.
            </p>
          </div>
        </Secao>

        <Secao
          titulo="Movimento"
          descricao="Reveal (fade-up on-scroll, respeita prefers-reduced-motion) é o único padrão de animação de entrada reutilizável. Role até aqui pra ver — os 3 blocos abaixo usam o mesmo componente com delays diferentes."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Reveal className="card-bg border border-verdemoikato/10 p-5" delay={0}>
              <span className="eyebrow text-amarelomoikato-700">delay 0ms</span>
            </Reveal>
            <Reveal className="card-bg border border-verdemoikato/10 p-5" delay={120}>
              <span className="eyebrow text-amarelomoikato-700">delay 120ms</span>
            </Reveal>
            <Reveal className="card-bg border border-verdemoikato/10 p-5" delay={240}>
              <span className="eyebrow text-amarelomoikato-700">delay 240ms</span>
            </Reveal>
          </div>
          <p className="lead mt-6 max-w-xl">
            <strong className="font-medium text-verdemoikato">
              GoldenThread
            </strong>{" "}
            e <strong className="font-medium text-verdemoikato">LivingBackground</strong>{" "}
            já estão ativos nesta própria página (montados no RootLayout) — são
            os efeitos de fundo "vivo" da marca, não componentes de UI
            reutilizáveis em telas isoladas.
          </p>
        </Secao>

        <Secao
          titulo="Foco e acessibilidade"
          descricao="Toda superfície interativa usa a mesma receita de foco — copie este trio de classes em qualquer elemento novo."
        >
          <code className="block whitespace-pre-wrap border border-verdemoikato/10 bg-white/60 p-4 font-mono text-xs text-verdemoikato-700">
            {"outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia focus-visible:ring-2"}
          </code>
          <p className="lead mt-4 max-w-xl">
            Skip-link no topo de toda página (WCAG 2.4.1), `prefers-reduced-motion`
            respeitado em Hero/Reveal/scroll, contraste de texto sobre fundos
            escuros tratado via `@layer base` (ver comentário em globals.css).
          </p>
        </Secao>
      </main>
    </div>
  );
}
