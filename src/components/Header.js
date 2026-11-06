"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import CartButton from "./shop/CartButton";

const NAV = [
  { key: "collection", href: "#colecao" },
  { key: "story", href: "#historia" },
  { key: "journal", href: "#feiras" },
  { key: "resellers", href: "#revendedores" },
];

function Wordmark({ className = "", inverted = false, lang }) {
  return (
    <Link
      href={`/${lang}#topo`}
      aria-label="Moikato"
      className={`relative block h-10 w-24 ${className}`}
    >
      <Image
        src="/logo-moikato-header.png"
        alt=""
        fill
        priority
        sizes="112px"
        className={`object-contain transition-[filter] duration-500 ${
          inverted ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}

export default function Header({ dict, lang, alwaysSolid = false }) {
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

  const solid = alwaysSolid || scrolled || open;
  const tone = solid ? "text-verdemoikato" : "text-osso";

  const destination = (key, anchor) =>
    key === "collection" ? `/${lang}/catalogo` : `/${lang}/#${anchor}`;

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
          solid ? "py-2 md:py-4" : "py-3 md:py-6"
        } ${tone}`}
      >
        {/* Esquerda: hamburger (mobile) + logo */}
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? dict.closeMenu : dict.openMenu}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center outline-none ring-amarelomoikato/60 ring-offset-2 ring-offset-transparent focus-visible:ring-2 md:hidden"
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
          <Wordmark className="hidden md:block md:w-28" inverted={!solid} lang={lang} />
        </div>

        {/* Centro: nav desktop */}
        <Wordmark className="justify-self-center md:hidden" inverted={!solid} lang={lang} />
        <nav
          aria-label={dict.mainNav}
          className="hidden items-center gap-7 justify-self-center md:flex"
        >
          {NAV.map((l) => (
            <Link
              key={l.key}
              href={destination(l.key, l.href.slice(1))}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] opacity-80 transition-opacity hover:opacity-100"
            >
              {dict.nav[l.key]}
            </Link>
          ))}
        </nav>

        {/* Direita: ícones + idioma */}
        <div className="flex items-center gap-1 justify-self-end">
          <LanguageSwitcher lang={lang} />
          <CartButton />
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-[61px] z-40 bg-floresta-900/30 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <nav
        aria-label={dict.menuNav}
        className={`fixed inset-x-0 top-[61px] z-50 origin-top border-b border-verdemoikato/10 bg-osso px-6 py-6 transition-transform duration-300 md:hidden ${
          open ? "translate-y-0" : "-translate-y-[130%]"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {NAV.map((l) => (
            <li key={l.key}>
              <Link
                href={destination(l.key, l.href.slice(1))}
                onClick={() => setOpen(false)}
                className="block py-2.5 font-display text-xl text-verdemoikato"
              >
                {dict.nav[l.key]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
