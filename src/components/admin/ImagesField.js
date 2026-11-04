"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImageAction } from "../../app/admin/actions";

const POSITIONS = [
  { value: "", label: "Centro" },
  { value: "center top", label: "Topo" },
  { value: "center bottom", label: "Base" },
  { value: "left center", label: "Esquerda" },
  { value: "right center", label: "Direita" },
];

// Reduz no navegador (máx. 2000 px, WebP) antes de enviar — fotos de celular
// passam de 5 MB e o upload fica rápido.
async function shrink(file) {
  if (!file.type.startsWith("image/")) throw new Error("Arquivo não é imagem");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  return new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
}

let uid = 0;
export const newKey = () => `new-${Date.now()}-${(uid += 1)}`;

export default function ImagesField({ images, onChange, productName }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  async function addFiles(fileList) {
    const list = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setError(null);
    setUploading((n) => n + list.length);
    const added = [];
    for (const file of list) {
      try {
        const formData = new FormData();
        formData.append("file", await shrink(file));
        const result = await uploadImageAction(formData);
        if (result.error) throw new Error(result.error);
        added.push({ key: newKey(), url: result.url, altPt: productName ?? "", altEn: "", objectPosition: "" });
      } catch (e) {
        setError(e.message || "Falha ao enviar uma foto.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) onChange((current) => [...current, ...added]);
  }

  const update = (key, patch) => onChange((current) => current.map((img) => (img.key === key ? { ...img, ...patch } : img)));
  const move = (index, delta) =>
    onChange((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(Math.max(0, Math.min(next.length, index + delta)), 0, item);
      return next;
    });

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, index) => (
          <figure key={img.key} className="group border border-verdemoikato/15 bg-white/60">
            <div className="relative aspect-square overflow-hidden bg-areia-200">
              <Image src={img.url} alt="" fill sizes="200px" className="object-cover" style={{ objectPosition: img.objectPosition || "center" }} />
              {index === 0 && <span className="absolute left-1.5 top-1.5 bg-verdemoikato px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-osso">Principal</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/50 to-transparent p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid size-8 place-items-center bg-osso/90 text-sm disabled:opacity-40" aria-label="Mover para a esquerda">←</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="grid size-8 place-items-center bg-osso/90 text-sm disabled:opacity-40" aria-label="Mover para a direita">→</button>
                </div>
                <button type="button" onClick={() => onChange((c) => c.filter((i) => i.key !== img.key))} className="grid size-8 place-items-center bg-osso/90 text-sm text-terra-700" aria-label="Remover foto">✕</button>
              </div>
            </div>
            <figcaption className="space-y-1 p-2">
              <input value={img.altPt ?? ""} onChange={(e) => update(img.key, { altPt: e.target.value })} placeholder="Descrição da foto" aria-label="Descrição da foto" className="h-8 w-full border border-verdemoikato/15 bg-white px-2 text-xs focus:border-verdemoikato focus:outline-none" />
              <select value={img.objectPosition ?? ""} onChange={(e) => update(img.key, { objectPosition: e.target.value })} aria-label="Enquadramento" className="h-8 w-full border border-verdemoikato/15 bg-white px-1 text-xs">
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>Enquadrar: {p.label}</option>
                ))}
              </select>
            </figcaption>
          </figure>
        ))}

        {Array.from({ length: uploading }).map((_, i) => (
          <div key={`up-${i}`} className="grid aspect-square animate-pulse place-items-center border border-dashed border-verdemoikato/30 bg-areia-200/60 text-xs text-verdemoikato/60">
            Enviando…
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`grid aspect-square place-items-center border-2 border-dashed px-3 text-center text-sm transition-colors ${dragOver ? "border-verdemoikato bg-verdemoikato/5" : "border-verdemoikato/25 text-verdemoikato/65 hover:border-verdemoikato/60"}`}
        >
          <span>
            <span className="block text-2xl">+</span>
            Adicionar fotos
            <span className="mt-1 block text-[0.7rem] text-verdemoikato/45">ou arraste aqui</span>
          </span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      {error && <p className="mt-2 text-sm text-terra-700">{error}</p>}
      <p className="mt-2 text-xs text-verdemoikato/50">A primeira foto é a principal. Use as setas para reordenar. As fotos são reduzidas automaticamente.</p>
    </div>
  );
}
