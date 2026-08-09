"use client";

const options = [
  { code: "pt-BR", label: "PT" },
  { code: "en", label: "EN" },
];

// Seções-âncora na ordem do documento — pra preservar "onde estou" ao trocar idioma.
const SECTION_IDS = [
  "topo",
  "colecao",
  "historia",
  "feiras",
  "pelo-mundo",
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
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      {options.map((o, i) => (
        <span key={o.code} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => choose(o.code)}
            aria-current={lang === o.code ? "true" : undefined}
            className={`outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-transparent transition-opacity focus-visible:ring-2 ${
              lang === o.code ? "font-semibold" : "opacity-55 hover:opacity-100"
            }`}
          >
            {o.label}
          </button>
          {i === 0 && (
            <span aria-hidden className="opacity-30">
              /
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
