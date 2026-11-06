"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { deleteCollectionAction, saveCollectionAction, uploadImageAction } from "../../app/admin/actions";
import { FormMessage, SubmitButton } from "./ui";

const input = "mt-1 block min-h-10 w-full border border-verdemoikato/20 bg-white px-3 text-sm focus:border-verdemoikato focus:outline-none";

function CollectionForm({ collection, count }) {
  const [state, action] = useActionState(saveCollectionAction, null);
  const [image, setImage] = useState(collection.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const isNew = !collection.id;

  async function upload(file) {
    if (!file) return;
    setUploading(true);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
      const fd = new FormData();
      fd.append("file", new File([blob], "capa.webp", { type: "image/webp" }));
      const result = await uploadImageAction(fd);
      if (result.url) setImage(result.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className={`border border-verdemoikato/15 p-4 sm:p-5 ${isNew ? "bg-verdemoikato/[0.03]" : "bg-white/50"}`}>
      <form action={action} className="grid gap-4 sm:grid-cols-[140px_1fr]">
        {collection.id && <input type="hidden" name="id" value={collection.id} />}
        <input type="hidden" name="imageUrl" value={image} />
        <div>
          <label className="relative block aspect-[4/5] cursor-pointer overflow-hidden border border-dashed border-verdemoikato/25 bg-areia-100 text-center text-xs text-verdemoikato/55">
            {image ? (
              <Image src={image} alt="" fill sizes="140px" className="object-cover" />
            ) : (
              <span className="absolute inset-0 grid place-items-center px-2">{uploading ? "Enviando…" : "Foto de capa (opcional)"}</span>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          {image && (
            <button type="button" onClick={() => setImage("")} className="mt-1 text-xs text-terra-700 hover:underline">
              Remover capa
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-xs text-verdemoikato/60">Nome</span>
            <input name="namePt" defaultValue={collection.namePt ?? ""} placeholder="Ex.: Solaris" className={input} required />
          </label>
          <label>
            <span className="text-xs text-verdemoikato/60">Nome em inglês (opcional)</span>
            <input name="nameEn" defaultValue={collection.nameEn ?? ""} className={input} />
          </label>
          <label>
            <span className="text-xs text-verdemoikato/60">Frase</span>
            <input name="taglinePt" defaultValue={collection.taglinePt ?? ""} placeholder="Uma frase sobre a ideia da coleção" className={input} />
          </label>
          <label>
            <span className="text-xs text-verdemoikato/60">Frase em inglês</span>
            <input name="taglineEn" defaultValue={collection.taglineEn ?? ""} className={input} />
          </label>
          <label>
            <span className="text-xs text-verdemoikato/60">Endereço</span>
            <input name="slug" defaultValue={collection.slug ?? ""} placeholder="Automático" className={`${input} font-mono text-xs`} />
          </label>
          <label>
            <span className="text-xs text-verdemoikato/60">Ordem no catálogo</span>
            <input name="sortOrder" defaultValue={collection.sortOrder ?? 0} inputMode="numeric" className={input} />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <SubmitButton variant={isNew ? "primary" : "secondary"}>{isNew ? "Criar coleção" : "Salvar"}</SubmitButton>
            {!isNew && <span className="text-xs text-verdemoikato/55">{count} {count === 1 ? "peça" : "peças"}</span>}
            <div className="min-w-0 flex-1">
              <FormMessage state={state} />
            </div>
          </div>
        </div>
      </form>
      {collection.id && (
        <form action={deleteCollectionAction} className="mt-2 text-right">
          <input type="hidden" name="id" value={collection.id} />
          <button type="submit" className="min-h-9 text-xs text-terra-700 hover:underline">
            Excluir coleção (as peças continuam, sem coleção)
          </button>
        </form>
      )}
    </section>
  );
}

export default function CollectionsManager({ collections, counts }) {
  return (
    <div className="space-y-4">
      {collections.map((collection) => (
        <CollectionForm key={collection.id} collection={collection} count={counts[collection.id] ?? 0} />
      ))}
      <CollectionForm key={`new-${collections.length}`} collection={{}} />
    </div>
  );
}
