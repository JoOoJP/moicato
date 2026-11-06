"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { saveProductAction } from "../../app/admin/actions";
import { centsToInput } from "../../lib/money";
import ImagesField, { newKey } from "./ImagesField";
import { FormMessage } from "./ui";

const input =
  "mt-1.5 block w-full min-h-11 border border-verdemoikato/20 bg-white px-3 py-2 text-[0.95rem] text-verdemoikato placeholder:text-verdemoikato/35 focus:border-verdemoikato focus:outline-none focus:ring-2 focus:ring-amarelomoikato/40";

function Card({ title, description, children, aside }) {
  return (
    <section className="border border-verdemoikato/15 bg-white/50 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-verdemoikato">{title}</h2>
          {description && <p className="mt-1 text-xs text-verdemoikato/55">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Label({ children, hint, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {children}
      {hint && <span className="mt-1 block text-xs text-verdemoikato/50">{hint}</span>}
    </label>
  );
}
const labelText = "text-xs font-medium text-verdemoikato/70";

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function initialState(product) {
  const p = product ?? {};
  return {
    id: p.id ?? null,
    slug: p.slug ?? "",
    category: p.category ?? "",
    status: p.status ?? "draft",
    isUnique: p.isUnique ?? false,
    madeToOrder: p.madeToOrder ?? false,
    weightG: p.weightG ?? "",
    packageId: p.packageId ?? "",
    pt: { name: p.pt?.name ?? "", description: p.pt?.description ?? "", details: p.pt?.details ?? "", care: p.pt?.care ?? "" },
    en: { name: p.en?.name ?? "", description: p.en?.description ?? "", details: p.en?.details ?? "", care: p.en?.care ?? "" },
    variants: (p.variants?.length ? p.variants : [{}]).map((v) => ({
      key: v.id ? `v${v.id}` : newKey(),
      id: v.id ?? null,
      sku: v.sku ?? "",
      labelPt: v.labelPt ?? "",
      labelEn: v.labelEn ?? "",
      price: centsToInput(v.priceCents),
      stock: v.stock ?? "",
    })),
    images: (p.images ?? []).map((img) => ({
      key: `i${img.id}`,
      id: img.id,
      url: img.url,
      altPt: img.altPt ?? "",
      altEn: img.altEn ?? "",
      objectPosition: img.objectPosition ?? "",
    })),
  };
}

const toPayload = (s) =>
  JSON.stringify({
    ...s,
    weightG: s.weightG === "" ? "" : Number(s.weightG),
    variants: s.variants.map(({ key, ...v }) => v),
    images: s.images.map(({ key, ...img }) => img),
  });

export default function ProductEditor({ product, packages, legacyPrice }) {
  const [form, setForm] = useState(() => initialState(product));
  const [saved, setSaved] = useState(() => toPayload(initialState(product)));
  const [lang, setLang] = useState("pt");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.id));
  const [state, formAction, pending] = useActionState(saveProductAction, null);
  const payload = useMemo(() => toPayload(form), [form]);
  const dirty = payload !== saved;
  const hasOptions = form.variants.length > 1;

  // Depois de salvar, o servidor devolve a peça atualizada (com IDs das fotos e
  // opções novas): recarrega o formulário a partir dela.
  const version = product?.updatedAt ? new Date(product.updatedAt).getTime() : 0;
  useEffect(() => {
    if (!version) return;
    const fresh = initialState(product);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(fresh);
    setSaved(toPayload(fresh));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setText = (field, value) =>
    setForm((f) => {
      const next = { ...f, [lang]: { ...f[lang], [field]: value } };
      if (lang === "pt" && field === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  const setVariant = (key, patch) => setForm((f) => ({ ...f, variants: f.variants.map((v) => (v.key === key ? { ...v, ...patch } : v)) }));
  const addVariant = () =>
    setForm((f) => ({ ...f, variants: [...f.variants, { key: newKey(), id: null, sku: "", labelPt: "", labelEn: "", price: "", stock: "" }] }));
  const removeVariant = (key) => setForm((f) => ({ ...f, variants: f.variants.filter((v) => v.key !== key) }));
  const t = form[lang];

  return (
    <form action={formAction}>
      <input type="hidden" name="payload" value={payload} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        {/* Coluna principal */}
        <div className="space-y-5">
          <Card
            title="Informações"
            aside={
              <div className="flex border border-verdemoikato/20 text-xs">
                {[["pt", "Português"], ["en", "English"]].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setLang(id)} className={`min-h-9 px-3 ${lang === id ? "bg-verdemoikato text-osso" : "text-verdemoikato/70"}`}>
                    {label}
                  </button>
                ))}
              </div>
            }
          >
            <div className="space-y-4">
              <Label hint={lang === "en" ? "Se vazio, usa o nome em português." : null}>
                <span className={labelText}>Nome</span>
                <input value={t.name} onChange={(e) => setText("name", e.target.value)} placeholder={lang === "pt" ? "Ex.: Brinco Aura" : form.pt.name} className={input} />
              </Label>
              <Label>
                <span className={labelText}>Descrição</span>
                <textarea value={t.description} onChange={(e) => setText("description", e.target.value)} rows={5} className={input} placeholder="Conte a história da peça, como usar, o que a torna especial." />
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Label hint="Material, medidas, acabamento.">
                  <span className={labelText}>Detalhes</span>
                  <textarea value={t.details} onChange={(e) => setText("details", e.target.value)} rows={4} className={input} placeholder={"Capim dourado e seda de buriti\nAltura: 4 cm"} />
                </Label>
                <Label hint="Vazio = texto padrão de cuidados.">
                  <span className={labelText}>Cuidados</span>
                  <textarea value={t.care} onChange={(e) => setText("care", e.target.value)} rows={4} className={input} />
                </Label>
              </div>
            </div>
          </Card>

          <Card title="Fotos">
            <ImagesField images={form.images} onChange={(updater) => setForm((f) => ({ ...f, images: typeof updater === "function" ? updater(f.images) : updater }))} productName={form.pt.name} />
          </Card>

          <Card
            title="Preço e estoque"
            description={legacyPrice && form.variants.every((v) => !v.price) ? `Sem preço em R$, a loja mostra o preço antigo (${legacyPrice}).` : null}
          >
            {!hasOptions ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <Label>
                  <span className={labelText}>Preço (R$)</span>
                  <input value={form.variants[0].price} onChange={(e) => setVariant(form.variants[0].key, { price: e.target.value })} inputMode="decimal" placeholder="0,00" className={input} />
                </Label>
                <Label hint="Vazio = não controlar.">
                  <span className={labelText}>Estoque</span>
                  <input value={form.variants[0].stock} onChange={(e) => setVariant(form.variants[0].key, { stock: e.target.value.replace(/\D/g, "") })} inputMode="numeric" placeholder="Não controlar" className={input} />
                </Label>
                <Label hint="Código interno.">
                  <span className={labelText}>SKU</span>
                  <input value={form.variants[0].sku} onChange={(e) => setVariant(form.variants[0].key, { sku: e.target.value.toUpperCase() })} placeholder="Automático" className={`${input} font-mono text-sm`} />
                </Label>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-verdemoikato/60">
                      <th className="pb-2 font-medium">Opção</th>
                      <th className="pb-2 font-medium">Em inglês</th>
                      <th className="w-28 pb-2 font-medium">Preço (R$)</th>
                      <th className="w-24 pb-2 font-medium">Estoque</th>
                      <th className="w-36 pb-2 font-medium">SKU</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {form.variants.map((v) => (
                      <tr key={v.key} className="border-t border-verdemoikato/10">
                        <td className="py-2 pr-2"><input value={v.labelPt} onChange={(e) => setVariant(v.key, { labelPt: e.target.value })} placeholder="Ex.: Kit com 3" className={`${input} mt-0`} /></td>
                        <td className="py-2 pr-2"><input value={v.labelEn} onChange={(e) => setVariant(v.key, { labelEn: e.target.value })} placeholder="Set of 3" className={`${input} mt-0`} /></td>
                        <td className="py-2 pr-2"><input value={v.price} onChange={(e) => setVariant(v.key, { price: e.target.value })} inputMode="decimal" placeholder="0,00" className={`${input} mt-0`} /></td>
                        <td className="py-2 pr-2"><input value={v.stock} onChange={(e) => setVariant(v.key, { stock: e.target.value.replace(/\D/g, "") })} inputMode="numeric" placeholder="∞" className={`${input} mt-0`} /></td>
                        <td className="py-2 pr-2"><input value={v.sku} onChange={(e) => setVariant(v.key, { sku: e.target.value.toUpperCase() })} placeholder="Automático" className={`${input} mt-0 font-mono text-xs`} /></td>
                        <td className="py-2 text-right"><button type="button" onClick={() => removeVariant(v.key)} className="grid size-10 place-items-center text-terra-700" aria-label="Remover opção">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button type="button" onClick={addVariant} className="mt-4 min-h-10 text-sm font-medium text-verdemoikato underline-offset-4 hover:underline">
              {hasOptions ? "+ Adicionar opção" : "+ Esta peça tem opções (ex.: unidade e kit, cores)"}
            </button>
          </Card>
        </div>

        {/* Lateral */}
        <div className="space-y-5 lg:sticky lg:top-6">
          <Card title="Status">
            <select value={form.status} onChange={(e) => set({ status: e.target.value })} className={`${input} mt-0`}>
              <option value="active">Na loja (visível)</option>
              <option value="draft">Rascunho (escondida)</option>
              <option value="archived">Arquivada</option>
            </select>
            {product?.id && form.slug && (
              <Link href={`/pt-BR/catalogo/${form.slug}`} target="_blank" className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-amarelomoikato-700 hover:underline">
                Ver na loja ↗
              </Link>
            )}
          </Card>

          <Card title="Organização">
            <Label>
              <span className={labelText}>Categoria</span>
              <select value={form.category} onChange={(e) => set({ category: e.target.value })} className={input}>
                <option value="" disabled>Escolha…</option>
                <option value="joias">Joias</option>
                <option value="moda">Moda</option>
                <option value="home">Casa</option>
              </select>
            </Label>
            <div className="mt-3 space-y-1 text-sm">
              <label className="flex min-h-10 items-center gap-2">
                <input type="checkbox" checked={form.isUnique} onChange={(e) => set({ isUnique: e.target.checked })} className="size-4 accent-verdemoikato" />
                Peça única
              </label>
              <label className="flex min-h-10 items-center gap-2">
                <input type="checkbox" checked={form.madeToOrder} onChange={(e) => set({ madeToOrder: e.target.checked })} className="size-4 accent-verdemoikato" />
                Feita sob encomenda
              </label>
            </div>
          </Card>

          <Card title="Envio" description="Usado para calcular o frete.">
            <Label>
              <span className={labelText}>Embalagem</span>
              <select value={form.packageId} onChange={(e) => set({ packageId: e.target.value })} className={input}>
                <option value="">Escolha…</option>
                {packages.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.name} ({pack.lengthCm}×{pack.widthCm}×{pack.heightCm} cm)
                  </option>
                ))}
              </select>
            </Label>
            <Label className="mt-3" hint="Só a peça, sem a embalagem.">
              <span className={labelText}>Peso da peça (g)</span>
              <input value={form.weightG} onChange={(e) => set({ weightG: e.target.value.replace(/\D/g, "") })} inputMode="numeric" placeholder="Ex.: 15" className={input} />
            </Label>
            <Link href="/admin/embalagens" className="mt-3 inline-block text-xs text-verdemoikato/60 underline-offset-4 hover:underline">
              Gerenciar embalagens
            </Link>
          </Card>

          <Card title="Endereço na loja">
            <div className="flex items-center text-sm">
              <span className="text-verdemoikato/45">/catalogo/</span>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set({ slug: slugify(e.target.value) });
                }}
                className={`${input} mt-0 font-mono text-xs`}
              />
            </div>
            {product?.id && <p className="mt-1 text-xs text-verdemoikato/50">Mudar quebra links já compartilhados.</p>}
          </Card>
        </div>
      </div>

      {/* Barra de salvar */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-t border-verdemoikato/15 bg-osso/95 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <button
          type="submit"
          disabled={pending || (!dirty && Boolean(product?.id))}
          className="inline-flex min-h-11 items-center bg-verdemoikato px-6 text-xs font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta disabled:opacity-50"
        >
          {pending ? "Salvando…" : product?.id ? "Salvar alterações" : "Criar peça"}
        </button>
        {dirty && !pending && <span className="text-sm text-amarelomoikato-700">Alterações não salvas</span>}
        <div className="min-w-0 flex-1">{!dirty && <FormMessage state={state} />}</div>
        {dirty && state?.error && <div className="w-full"><FormMessage state={state} /></div>}
      </div>
    </form>
  );
}
