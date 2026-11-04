"use client";

import { useActionState } from "react";
import { deleteVariantAction, saveVariantAction } from "../../app/admin/actions";
import { centsToInput } from "../../lib/money";
import { Field, FormMessage, SubmitButton, inputClass } from "./ui";

function VariantForm({ productId, variant, canDelete }) {
  const [state, formAction] = useActionState(saveVariantAction, null);
  const v = variant ?? {};

  return (
    <div className="border border-verdemoikato/15 bg-white/40 p-4">
      <form action={formAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_8rem_7rem_auto] lg:items-end">
        <input type="hidden" name="productId" value={productId} />
        {v.id && <input type="hidden" name="id" value={v.id} />}
        <input type="hidden" name="position" value={v.position ?? 0} />
        <Field label="Nome da variação" hint="Vazio se for única.">
          <input name="labelPt" defaultValue={v.labelPt ?? ""} placeholder="Ex.: Kit com 3" className={inputClass} />
        </Field>
        <Field label="Em inglês">
          <input name="labelEn" defaultValue={v.labelEn ?? ""} placeholder="Ex.: Set of 3" className={inputClass} />
        </Field>
        <Field label="SKU">
          <input name="sku" defaultValue={v.sku ?? ""} required className={`${inputClass} font-mono text-sm uppercase`} />
        </Field>
        <Field label="Preço (R$)">
          <input name="price" inputMode="decimal" defaultValue={centsToInput(v.priceCents)} placeholder="89,90" className={inputClass} />
        </Field>
        <Field label="Estoque" hint="Vazio = não controlar.">
          <input name="stock" inputMode="numeric" defaultValue={v.stock ?? ""} className={inputClass} />
        </Field>
        <SubmitButton variant={v.id ? "secondary" : "primary"}>{v.id ? "Salvar" : "Adicionar"}</SubmitButton>
      </form>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <FormMessage state={state} />
        </div>
        {v.id && canDelete && (
          <form action={deleteVariantAction}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="id" value={v.id} />
            <button type="submit" className="min-h-11 text-xs font-semibold uppercase tracking-[0.12em] text-terra-700 hover:underline">
              Remover
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VariantsEditor({ productId, slug, variants }) {
  return (
    <section>
      <h2 className="font-display text-3xl">Preço e estoque</h2>
      <p className="mt-1 text-sm text-verdemoikato/60">
        Cada variação tem seu preço e estoque (ex.: unidade e kit). Sem preço em R$, a loja mostra o preço antigo.
      </p>
      <div className="mt-5 space-y-3">
        {variants.map((variant) => (
          <VariantForm key={variant.id} productId={productId} variant={variant} canDelete={variants.length > 1} />
        ))}
        <details className="border border-dashed border-verdemoikato/25 p-4">
          <summary className="min-h-11 cursor-pointer content-center text-xs font-semibold uppercase tracking-[0.12em]">
            + Nova variação
          </summary>
          <div className="mt-3">
            <VariantForm
              productId={productId}
              variant={{ sku: `MK-${slug.toUpperCase()}-${variants.length + 1}`, position: variants.length }}
            />
          </div>
        </details>
      </div>
    </section>
  );
}
