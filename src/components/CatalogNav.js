"use client";

import { useEffect, useState } from "react";

export default function CatalogNav({ label, allLabel, categories }) {
  const [active, setActive] = useState("all");

  useEffect(() => {
    const sections = categories
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.1, 0.25] },
    );

    sections.forEach((section) => observer.observe(section));

    const handleTop = () => {
      if (window.scrollY < 260) setActive("all");
    };

    handleTop();
    window.addEventListener("scroll", handleTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleTop);
    };
  }, [categories]);

  const itemClass = (isActive) =>
    `inline-flex min-h-12 shrink-0 items-center border-b text-[0.68rem] font-semibold uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amarelomoikato/70 motion-reduce:transition-none ${
      isActive
        ? "border-amarelomoikato-700 text-verdemoikato"
        : "border-transparent text-verdemoikato/60 hover:border-amarelomoikato-700 hover:text-verdemoikato"
    }`;

  return (
    <nav aria-label={label} className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 sm:px-8">
      <a href="#catalogo-inicio" aria-current={active === "all" ? "location" : undefined} className={itemClass(active === "all")}>
        {allLabel}
      </a>
      {categories.map(({ id, label: categoryLabel, count }) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} className={itemClass(active === id)}>
          {categoryLabel}
          <span className="ml-2 font-normal text-verdemoikato/40">{count}</span>
        </a>
      ))}
    </nav>
  );
}
