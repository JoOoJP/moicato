"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import BandeiraBR from "./BandeiraBR";

const NAV = [
  { href: "#colecao", id: "colecao", key: "colecao" },
  { href: "#jornada", id: "jornada", key: "jornada" },
  { href: "#sustentabilidade", id: "sustentabilidade", key: "sustentabilidade" },
  { href: "#contato", id: "contato", key: "contato" },
];

/* Seta enxuta usada nos itens do menu mobile e no CTA do drawer. */
function ArrowIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 10h11M11 5.5 15.5 10 11 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header({ dict, lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("topo");

  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  // Header condensa e solidifica ao rolar para fora do topo do hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Seção ativa via IntersectionObserver (escolhe a de maior visibilidade).
  useEffect(() => {
    const ids = ["topo", ...NAV.map((l) => l.id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Menu mobile aberto: trava o scroll, fecha no Escape, move o foco ao painel
  // e o devolve ao botão ao fechar. Tab fica preso dentro do painel enquanto
  // aberto (aria-modal exige focus trap — sem isso o foco vaza pro conteúdo
  // atrás do overlay).
  useEffect(() => {
    if (!open) return;

    // Captura o botão agora — ler toggleRef.current dentro da cleanup pega
    // valor possivelmente já trocado (warning react-hooks/exhaustive-deps).
    const toggle = toggleRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll(
        "a[href], button:not([disabled])"
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const inPanel = panelRef.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inPanel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inPanel)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const firstFocusable = panelRef.current?.querySelector("a, button");
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-verdemoikato/10 bg-areia/85 shadow-[0_8px_30px_-18px_rgba(26,67,40,0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-areia/40 backdrop-blur-sm"
      }`}
    >
      {/* Fio dourado de topo — assinatura sutil do capim dourado */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-amarelomoikato/50 to-transparent"
      />

      {/* Grid de 3 colunas: marca à esquerda · nav centralizada · direita */}
      <div
        className={`mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 transition-all duration-500 sm:px-6 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Marca */}
        <a
          href="#topo"
          aria-label={dict.home}
          className="group flex shrink-0 items-center gap-3 justify-self-start rounded-none outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition focus-visible:ring-2"
        >
          <Logo compact={scrolled} />
          <span
            className={`hidden items-center gap-2 border-l border-verdemoikato/15 pl-3 leading-tight transition-all duration-500 lg:flex ${
              scrolled ? "lg:hidden" : "opacity-100"
            }`}
          >
            <span>
              <span className="eyebrow block text-amarelomoikato-800">
                {dict.brandEyebrow1}
              </span>
              <span className="eyebrow block text-verdemoikato/70">
                {dict.brandEyebrow2}
              </span>
            </span>
            {/* Bandeira do Brasil ao lado do subtítulo — mesmo lockup do manual de marca */}
            <BandeiraBR className="h-3 w-[18px]" />
          </span>
        </a>

        {/* Navegação desktop — centralizada */}
        <nav
          aria-label={dict.mainNav}
          className="hidden items-center gap-0.5 justify-self-center md:flex"
        >
          {NAV.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative rounded-none px-3 py-2 text-sm font-medium outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors focus-visible:ring-2 ${
                  isActive
                    ? "text-verdemoikato"
                    : "text-verdemoikato-700/80 hover:text-verdemoikato"
                }`}
              >
                {dict.nav[l.key]}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-center rounded-full bg-gradient-to-r from-amarelomoikato to-amarelomoikato-600 transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Direita: seletor de idioma (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-end gap-4 justify-self-end">
          <LanguageSwitcher lang={lang} className="hidden md:flex" />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? dict.closeMenu : dict.openMenu}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-none border border-verdemoikato/15 bg-white/50 text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition hover:bg-white/80 focus-visible:ring-2 md:hidden"
          >
            <span className="sr-only">{dict.menu}</span>
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 rounded-full bg-current transition-all duration-200 ${
                  open ? "w-0 opacity-0" : "w-5 opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Overlay do menu mobile */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-verdemoikato-900/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-over mobile */}
      <aside
        id="menu-mobile"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.menuNav}
        className={`fixed inset-y-0 right-0 z-50 flex w-[84%] max-w-sm flex-col border-l border-amarelomoikato/20 bg-areia shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full bg-amarelomoikato/20 blur-3xl"
        />

        <div className="flex items-center justify-between px-6 py-5">
          <span className="flex items-center gap-2">
            <Logo />
            <BandeiraBR className="h-3 w-[18px]" />
          </span>
          <button
            type="button"
            onClick={close}
            aria-label={dict.closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-verdemoikato/15 bg-white/60 text-verdemoikato outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition hover:bg-white focus-visible:ring-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav
          aria-label={dict.menuNav}
          className="relative flex flex-col gap-1 px-4 py-2"
        >
          {NAV.map((l, i) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                aria-current={isActive ? "page" : undefined}
                style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
                className={`group flex items-center justify-between rounded-none px-4 py-3.5 outline-none ring-amarelomoikato/60 transition-all duration-500 focus-visible:ring-2 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                } ${
                  isActive
                    ? "bg-verdemoikato/8 text-verdemoikato"
                    : "text-verdemoikato-700 hover:bg-verdemoikato/5"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-display text-xs text-amarelomoikato-600/80">
                    0{i + 1}
                  </span>
                  <span className="font-display text-lg">{dict.nav[l.key]}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`transition-all duration-300 ${
                    isActive
                      ? "translate-x-0 text-amarelomoikato opacity-100"
                      : "-translate-x-1 text-verdemoikato/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  <ArrowIcon className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-verdemoikato/10 px-6 py-6">
          <LanguageSwitcher lang={lang} className="mb-5 justify-center" />
          <a
            href="#contato"
            onClick={close}
            className="group flex w-full items-center justify-center gap-2 rounded-none bg-verdemoikato px-6 py-3.5 text-sm font-medium text-white shadow-sm outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-areia transition-colors hover:bg-verdemoikato-600 focus-visible:ring-2"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-amarelomoikato-300"
            />
            {dict.contact}
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <p className="eyebrow mt-5 text-center text-verdemoikato-700/70">
            {dict.drawerNote}
          </p>
        </div>
      </aside>
    </header>
  );
}
