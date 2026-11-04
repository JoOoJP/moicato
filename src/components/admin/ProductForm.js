"use client";

import { useActionState } from "react";
import { saveProductAction } from "../../app/admin/actions";
import { Field, FormMessage, SubmitButton, inputClass } from "./ui";

function LocaleFields({ prefix, title, values = {}, required }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-2xl">{title}</legend>
      <Field label="Nome">
        <input name={`${prefix}_name`} defaultValue={values.name ?? ""} required={required} className={inputClass} />
      </Field>
      <Field label="Descrição">
        <textarea name={`${prefix}_description`} defaultValue={values.description ?? ""} rows={5} className={inputClass} />
      </Field>
      <Field label="Detalhes" hint="Material, medidas, acabamento.">
        <textarea name={`${prefix}_details`} defaultValue={values.details ?? ""} rows={3} className={inputClass} />
      </Field>
      <Field label="Cuidados">
        <textarea name={`${prefix}_care`} defaultValue={values.care ?? ""} rows={3} className={inputClass} />
      </Field>
    </fieldset>
  );
}

export default function ProductForm({ product }) {
  const [state, formAction] = useActionState(saveProductAction, null);
  const p = product ?? {};

  return (
    <form action={formAction} className="space-y-10">
      {p.id && <input type="hidden" name="id" value={p.id} />}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Status" className="lg:col-span-1">
          <select name="status" defaultValue={p.status ?? "draft"} className={inputClass}>
            <option value="active">Na loja</option>
            <option value="draft">Rascunho (escondida)</option>
            <option value="archived">Arquivada</option>
          </select>
        </Field>
        <Field label="Categoria">
          <select name="category" defaultValue={p.category ?? ""} required className={inputClass}>
            <option value="" disabled>
              Escolha…
            </option>
            <option value="joias">Joias</option>
            <option value="moda">Moda</option>
            <option value="home">Casa</option>
          </select>
        </Field>
        <Field label="Slug (endereço)" hint="Ex.: brinco-aura. Mudar quebra links antigos." className="sm:col-span-2">
          <input
            name="slug"
            defaultValue={p.slug ?? ""}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className={`${inputClass} font-mono text-sm`}
          />
        </Field>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <LocaleFields prefix="pt" title="Português" values={p.pt} required />
        <LocaleFields prefix="en" title="English" values={p.en} />
      </section>

      <section>
        <h2 className="font-display text-2xl">Envio e organização</h2>
        <p className="mt-1 text-sm text-verdemoikato/60">Peso e medidas da peça já embalada — usados no cálculo do frete.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
          <Field label="Peso (g)">
            <input name="weightG" inputMode="numeric" defaultValue={p.weightG ?? ""} className={inputClass} />
          </Field>
          <Field label="Compr. (cm)">
            <input name="lengthCm" inputMode="numeric" defaultValue={p.lengthCm ?? ""} className={inputClass} />
          </Field>
          <Field label="Largura (cm)">
            <input name="widthCm" inputMode="numeric" defaultValue={p.widthCm ?? ""} className={inputClass} />
          </Field>
          <Field label="Altura (cm)">
            <input name="heightCm" inputMode="numeric" defaultValue={p.heightCm ?? ""} className={inputClass} />
          </Field>
          <Field label="Ordem na loja" hint="Menor aparece antes.">
            <input name="sortOrder" inputMode="numeric" defaultValue={p.sortOrder ?? 0} className={inputClass} />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" name="isUnique" defaultChecked={p.isUnique} className="size-4 accent-verdemoikato" />
            Peça única
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" name="madeToOrder" defaultChecked={p.madeToOrder} className="size-4 accent-verdemoikato" />
            Feita sob encomenda
          </label>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-4 border-t border-verdemoikato/15 bg-osso/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <SubmitButton>{p.id ? "Salvar peça" : "Criar peça"}</SubmitButton>
        <div className="min-w-0 flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
