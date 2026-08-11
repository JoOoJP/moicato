"use client";

const options = [
  { code: "pt-BR", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
];

// Seções-âncora na ordem do documento — pra preservar "onde estou" ao trocar idioma.
const SECTION_IDS = [
  "topo",
  "colecao",
  "historia",
  "feiras",
  "revendedores",
  "contato",
];

// Descobre a seção atual (âncora explícita ganha; senão, a última acima do topo
// da viewport) pra manter o contexto ao recarregar no outro idioma.
function currentHash() {
  if (typeof window === "undefined") return "";
  if (window.location.hash) return window.location.hash;
  const y = window.scrollY + 120; // logo abaixo do header fixo
  let current = "";
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top + window.scrollY <= y) current = id;
  }
  return current ? `#${current}` : "";
}

// Troca de idioma: grava a preferência num cookie e navega para o outro locale,
// preservando a seção atual (em vez de voltar sempre ao topo).
// Fica FORA do componente: o lint do React Compiler (react-hooks/immutability)
// não permite atribuição em globais (document/window) dentro do corpo dele.
function goToLocale(code) {
  document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
  window.location.href = `/${code}${currentHash()}`;
}

export default function LanguageSwitcher({ lang, className = "" }) {
  const choose = (code) => {
    if (code === lang) return;
    goToLocale(code);
  };

  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className={`flex items-center text-xs uppercase tracking-[0.08em] md:text-sm md:tracking-normal ${className}`}
    >
      {options.map((o, i) => (
        <span key={o.code} className="flex items-center">
          <button
            type="button"
            onClick={() => choose(o.code)}
            aria-current={lang === o.code ? "true" : undefined}
            aria-label={o.name}
            className={`relative grid h-11 min-w-10 place-items-center outline-none ring-amarelomoikato/60 ring-offset-1 ring-offset-transparent transition-opacity focus-visible:ring-2 md:h-auto md:min-w-0 md:px-1 md:py-2 ${
              lang === o.code
                ? "font-semibold after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-4 after:-translate-x-1/2 after:bg-amarelomoikato md:after:bottom-0"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            {o.label}
          </button>
          {i === 0 && (
            <span aria-hidden className="-mx-1 opacity-30 md:mx-1">
              /
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
