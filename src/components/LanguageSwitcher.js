"use client";

const options = [
  { code: "pt-BR", label: "PT" },
  { code: "en", label: "EN" },
];

// Seções-âncora na ordem do documento — pra preservar "onde estou" ao trocar idioma.
const SECTION_IDS = ["topo", "jornada", "colecao", "sustentabilidade", "contato"];

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
export default function LanguageSwitcher({ lang, className = "" }) {
  const choose = (code) => {
    if (code === lang) return;
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
    window.location.href = `/${code}${currentHash()}`;
  };

  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      {options.map((o, i) => (
        <span key={o.code} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => choose(o.code)}
            aria-current={lang === o.code ? "true" : undefined}
            className={`outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors focus-visible:ring-2 ${
              lang === o.code
                ? "font-medium text-verdemoikato"
                : "text-verdemoikato-700/60 hover:text-verdemoikato"
            }`}
          >
            {o.label}
          </button>
          {i === 0 && (
            <span aria-hidden className="text-verdemoikato/25">
              /
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
