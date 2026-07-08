"use client";

import { useEffect, useRef } from "react";

// Fio dourado condutor: uma linha fina fixa na lateral que é "costurada" de
// cima a baixo conforme o scroll — a fibra de buriti virando a espinha da
// página, com um nó luminoso na ponta (a agulha).
export default function GoldenThread() {
  const fillRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
      if (dotRef.current) dotRef.current.style.opacity = "0";
      return;
    }

    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      if (dotRef.current) dotRef.current.style.top = `${(p * 100).toFixed(2)}%`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-2 z-30 w-px sm:left-3"
    >
      {/* trilho fraco */}
      <div className="absolute inset-0 bg-verdemoikato/10" />
      {/* preenchimento dourado que cresce de cima pra baixo */}
      <div
        ref={fillRef}
        className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-amarelomoikato to-amarelomoikato-600"
        style={{ transform: "scaleY(0)" }}
      />
      {/* nó luminoso na ponta (a agulha) */}
      <div
        ref={dotRef}
        className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amarelomoikato shadow-[0_0_10px_2px_rgba(212,175,55,0.55)]"
        style={{ top: "0%" }}
      />
    </div>
  );
}
