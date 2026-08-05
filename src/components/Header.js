"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV = [
  { key: "collection", href: "#colecao" },
  { key: "story", href: "#historia" },
  { key: "journal", href: "#" },
  { key: "worldwide", href: "#pelo-mundo" },
  { key: "resellers", href: "#" },
];

function Wordmark({ className = "" }) {
  return (
    <a
      href="#topo"
      className={`font-display text-2xl italic lowercase leading-none tracking-tight ${className}`}
    >
      moikato
    </a>
  );
}

export default function Header({ dict, lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;
  const tone = solid ? "text-verdemoikato" : "text-osso";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-verdemoikato/10 bg-osso/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 transition-all duration-500 sm:px-8 ${
          solid ? "py-4" : "py-6"
        } ${tone}`}
      >
        {/* Esquerda: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3 justify-self-start">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? dict.closeMenu : dict.openMenu}
            aria-expanded={open}
            className="md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
          <Wordmark />
        </div>

        {/* Centro: nav desktop */}
        <nav
          aria-label={dict.mainNav}
          className="hidden items-center gap-7 justify-self-center md:flex"
        >
          {NAV.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] opacity-80 transition-opacity hover:opacity-100"
            >
              {dict.nav[l.key]}
            </a>
          ))}
        </nav>

        {/* Direita: ícones + idioma */}
        <div className="flex items-center gap-4 justify-self-end sm:gap-5">
          <button
            type="button"
            aria-label={dict.search}
            className="hidden opacity-80 hover:opacity-100 sm:block"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={dict.account}
            className="hidden opacity-80 hover:opacity-100 sm:block"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`${dict.cart} (0)`}
            className="flex items-center gap-1 opacity-80 hover:opacity-100"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            <span className="text-xs">(0)</span>
          </button>
          <LanguageSwitcher lang={lang} className="hidden lg:flex" />
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-[57px] z-40 bg-floresta-900/30 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <nav
        aria-label={dict.menuNav}
        className={`fixed inset-x-0 top-[57px] z-50 origin-top border-b border-verdemoikato/10 bg-osso px-6 py-6 transition-transform duration-300 md:hidden ${
          open ? "translate-y-0" : "-translate-y-[130%]"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {NAV.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 font-display text-xl text-verdemoikato"
              >
                {dict.nav[l.key]}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-verdemoikato/10 pt-4">
          <LanguageSwitcher lang={lang} />
        </div>
      </nav>
    </header>
  );
}
