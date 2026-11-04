"use client";

import Image from "next/image";
import { useActionState } from "react";
import { deleteImageAction, saveImageAction } from "../../app/admin/actions";
import { Field, FormMessage, SubmitButton, inputClass } from "./ui";

function ImageForm({ productId, image }) {
  const [state, formAction] = useActionState(saveImageAction, null);
  const img = image ?? {};

  return (
    <div className="grid gap-4 border border-verdemoikato/15 bg-white/40 p-4 sm:grid-cols-[120px_1fr]">
      <div className="relative aspect-square w-full max-w-[120px] overflow-hidden bg-areia-200">
        {img.url && (
          <Image
            src={img.url}
            alt=""
            fill
            sizes="120px"
            className="object-cover"
            style={{ objectPosition: img.objectPosition ?? "center" }}
          />
        )}
      </div>
      <div>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="productId" value={productId} />
          {img.id && <input type="hidden" name="id" value={img.id} />}
          <Field label="Endereço da imagem" hint="Arquivo do site, ex.: /product-brinco-aura.png" className="sm:col-span-2">
            <input name="url" defaultValue={img.url ?? ""} required className={`${inputClass} font-mono text-sm`} />
          </Field>
          <Field label="Descrição (pt)" hint="Para leitores de tela e Google.">
            <input name="altPt" defaultValue={img.altPt ?? ""} className={inputClass} />
          </Field>
          <Field label="Descrição (en)">
            <input name="altEn" defaultValue={img.altEn ?? ""} className={inputClass} />
          </Field>
          <Field label="Enquadramento" hint="Ex.: center, 44% center.">
            <input name="objectPosition" defaultValue={img.objectPosition ?? ""} placeholder="center" className={inputClass} />
          </Field>
          <Field label="Ordem" hint="0 = foto principal.">
            <input name="position" inputMode="numeric" defaultValue={img.position ?? 0} className={inputClass} />
          </Field>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <SubmitButton variant={img.id ? "secondary" : "primary"}>{img.id ? "Salvar" : "Adicionar"}</SubmitButton>
            <div className="min-w-0 flex-1">
              <FormMessage state={state} />
            </div>
          </div>
        </form>
        {img.id && (
          <form action={deleteImageAction} className="mt-2 text-right">
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="id" value={img.id} />
            <button type="submit" className="min-h-11 text-xs font-semibold uppercase tracking-[0.12em] text-terra-700 hover:underline">
              Remover imagem
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ImagesEditor({ productId, images }) {
  return (
    <section>
      <h2 className="font-display text-3xl">Fotos</h2>
      <p className="mt-1 text-sm text-verdemoikato/60">A foto de ordem 0 é a principal (vitrine e compartilhamento).</p>
      <div className="mt-5 space-y-3">
        {images.map((image) => (
          <ImageForm key={image.id} productId={productId} image={image} />
        ))}
        <details className="border border-dashed border-verdemoikato/25 p-4">
          <summary className="min-h-11 cursor-pointer content-center text-xs font-semibold uppercase tracking-[0.12em]">
            + Nova foto
          </summary>
          <div className="mt-3">
            <ImageForm productId={productId} image={{ position: images.length }} />
          </div>
        </details>
      </div>
    </section>
  );
}
