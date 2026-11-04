"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { quickUpdateVariantAction } from "../../app/admin/actions";
import { centsToInput, formatBRL } from "../../lib/money";

const STATUS = {
  active: { label: "Na loja", className: "bg-verdemoikato text-osso" },
  draft: { label: "Rascunho", className: "bg-amarelomoikato/30 text-verdemoikato" },
  archived: { label: "Arquivada", className: "bg-verdemoikato/10 text-verdemoikato/60" },
};
const CATEGORY = { joias: "Joias", moda: "Moda", home: "Casa" };
const TABS = [
  { id: "all", label: "Todas" },
  { id: "active", label: "Na loja" },
  { id: "draft", label: "Rascunhos" },
  { id: "attention", label: "Sem preço / esgotadas" },
  { id: "archived", label: "Arquivadas" },
];

const cell = "h-10 w-full border border-transparent bg-transparent px-2 text-sm hover:border-verdemoikato/20 focus:border-verdemoikato focus:bg-white focus:outline-none";

// Preço + estoque editáveis direto na linha (peças com uma única opção).
function QuickEdit({ variant }) {
  const [state, action, pending] = useActionState(quickUpdateVariantAction, null);
  const [dirty, setDirty] = useState(false);
  return (
    <form
      action={(fd) => {
        setDirty(false);
        return action(fd);
      }}
      onChange={() => setDirty(true)}
      className="contents"
    >
      <input type="hidden" name="variantId" value={variant.id} />
      <div className="flex items-center gap-1">
        <span className="text-xs text-verdemoikato/50">R$</span>
        <input name="price" defaultValue={centsToInput(variant.priceCents)} placeholder="—" inputMode="decimal" aria-label="Preço" className={cell} />
      </div>
      <div className="flex items-center gap-1">
        <input name="stock" defaultValue={variant.stock ?? ""} placeholder="∞" inputMode="numeric" aria-label="Estoque" className={cell} />
        <button
          type="submit"
          disabled={!dirty || pending}
          className={`h-10 shrink-0 px-2 text-xs font-semibold uppercase tracking-[0.1em] ${dirty ? "text-verdemoikato" : "text-transparent"}`}
        >
          {pending ? "…" : "Salvar"}
        </button>
      </div>
      {state?.error && <span className="col-span-full text-xs text-terra-700">{state.error}</span>}
    </form>
  );
}

function needsAttention(p) {
  return p.priceMissing || p.stockTotal === 0;
}

export default function ProductList({ items }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const counts = useMemo(
    () => ({
      all: items.length,
      active: items.filter((p) => p.status === "active").length,
      draft: items.filter((p) => p.status === "draft").length,
      attention: items.filter((p) => p.status !== "archived" && needsAttention(p)).length,
      archived: items.filter((p) => p.status === "archived").length,
    }),
    [items]
  );

  const visible = items.filter((p) => {
    if (tab === "attention" ? !(p.status !== "archived" && needsAttention(p)) : tab !== "all" && p.status !== tab) return false;
    const q = query.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.slug.includes(q) || p.variants.some((v) => v.sku.toLowerCase().includes(q));
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-10 shrink-0 px-3 text-sm ${tab === t.id ? "border-b-2 border-verdemoikato font-medium text-verdemoikato" : "text-verdemoikato/60 hover:text-verdemoikato"}`}
            >
              {t.label} <span className="text-xs text-verdemoikato/45">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou SKU"
          className="min-h-10 w-full border border-verdemoikato/20 bg-white/70 px-3 text-sm focus:border-verdemoikato focus:outline-none sm:w-64"
        />
      </div>

      <div className="mt-4 overflow-x-auto border border-verdemoikato/15 bg-white/40">
        <div className="grid min-w-[760px] grid-cols-[56px_minmax(0,1fr)_110px_140px_150px] items-center gap-x-4 border-b border-verdemoikato/15 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-verdemoikato/50">
          <span />
          <span>Peça</span>
          <span>Status</span>
          <span>Preço</span>
          <span>Estoque</span>
        </div>
        {visible.length === 0 && <p className="px-4 py-10 text-center text-sm text-verdemoikato/55">Nenhuma peça encontrada.</p>}
        {visible.map((p) => {
          const status = STATUS[p.status];
          const single = p.variants.length === 1 ? p.variants[0] : null;
          const prices = p.variants.map((v) => v.priceCents).filter((c) => c != null);
          return (
            <div
              key={p.id}
              className="grid min-w-[760px] grid-cols-[56px_minmax(0,1fr)_110px_140px_150px] items-center gap-x-4 border-b border-verdemoikato/10 px-3 py-2 last:border-b-0 hover:bg-verdemoikato/[0.03]"
            >
              <Link href={`/admin/produtos/${p.id}`} className="relative size-14 overflow-hidden bg-areia-200">
                {p.thumbnail && <Image src={p.thumbnail} alt="" fill sizes="56px" className="object-cover" />}
              </Link>
              <Link href={`/admin/produtos/${p.id}`} className="min-w-0 py-2">
                <p className="truncate font-medium text-verdemoikato hover:underline">{p.name}</p>
                <p className="truncate text-xs text-verdemoikato/55">
                  {CATEGORY[p.category]}
                  {p.variants.length > 1 && ` · ${p.variants.length} opções`}
                  {p.priceMissing && <span className="text-amarelomoikato-700"> · sem preço em R$</span>}
                </p>
              </Link>
              <span className={`w-fit px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] ${status.className}`}>{status.label}</span>
              {single ? (
                <QuickEdit variant={single} />
              ) : (
                <>
                  <span className="px-2 text-sm">{prices.length ? `${formatBRL(Math.min(...prices))}+` : "—"}</span>
                  <Link href={`/admin/produtos/${p.id}`} className="px-2 text-sm text-verdemoikato/70 hover:underline">
                    {p.stockTotal == null ? "∞" : p.stockTotal} · editar opções
                  </Link>
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-verdemoikato/50">Estoque vazio (∞) = não controlado. Preço vazio = a loja mostra o preço antigo.</p>
    </div>
  );
}
