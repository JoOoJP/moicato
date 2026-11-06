"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Desktop: fotos grandes empilhadas (o painel de compra acompanha a rolagem).
// Celular: carrossel com deslize e indicador de posição.
export default function ProductGallery({ images, name }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  if (images.length === 0) return <div className="aspect-[4/5] bg-areia-100" />;

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div>
      {/* Celular */}
      <div className="relative min-[900px]:hidden">
        <div ref={track} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, i) => (
            <div key={image.src + i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-areia-100">
              <Image src={image.src} alt={image.alt ?? name} fill priority={i === 0} sizes="100vw" className="object-cover" style={{ objectPosition: image.position ?? "center" }} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5" aria-hidden>
            {images.map((image, i) => (
              <span key={image.src + i} className={`h-[3px] rounded-full transition-all ${i === index ? "w-6 bg-osso" : "w-3 bg-osso/50"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden gap-3 min-[900px]:grid">
        {images.map((image, i) => (
          <div key={image.src + i} className="relative aspect-[4/5] bg-areia-100">
            <Image src={image.src} alt={image.alt ?? name} fill priority={i === 0} sizes="58vw" className="object-cover" style={{ objectPosition: image.position ?? "center" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
