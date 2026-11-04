"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return <div className="aspect-[4/5] bg-areia-200" />;

  return (
    <div className={`grid gap-3 md:gap-4 ${images.length > 1 ? "md:grid-cols-[72px_1fr]" : ""}`}>
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-areia-200 md:order-2">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt ?? name}
          fill
          priority
          sizes="(min-width: 900px) 52vw, 100vw"
          className="object-cover motion-safe:animate-[pageEnter_300ms_ease-out]"
          style={{ objectPosition: current.position ?? "center" }}
        />
      </div>
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto px-5 sm:px-0 md:order-1 md:flex-col">
          {images.map((image, index) => (
            <button
              key={image.src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${index + 1} / ${images.length}`}
              aria-current={index === active}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden bg-areia-200 outline-none ring-offset-2 ring-offset-osso focus-visible:ring-2 focus-visible:ring-amarelomoikato md:w-full ${
                index === active ? "ring-1 ring-verdemoikato" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image.src} alt="" fill sizes="72px" className="object-cover" style={{ objectPosition: image.position ?? "center" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
