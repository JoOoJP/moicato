import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "../../../lib/auth/admin";
import { listProductsForAdmin } from "../../../lib/admin-products";
import { formatBRL } from "../../../lib/money";

export const metadata = { title: "Peças" };

const STATUS = {
  active: { label: "Na loja", className: "bg-verdemoikato text-osso" },
  draft: { label: "Rascunho", className: "bg-amarelomoikato/30 text-verdemoikato" },
  archived: { label: "Arquivada", className: "bg-verdemoikato/10 text-verdemoikato/60" },
};
const CATEGORY = { joias: "Joias", moda: "Moda", home: "Casa" };

function priceSummary(variants) {
  const prices = variants.map((v) => v.priceCents).filter((p) => p != null);
  if (prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatBRL(min) : `${formatBRL(min)} – ${formatBRL(max)}`;
}

function stockSummary(product) {
  if (product.stockTotal == null) return { label: "Não controlado", warn: false };
  if (product.stockTotal === 0) return { label: "Esgotado", warn: true };
  return { label: `${product.stockTotal} em estoque`, warn: false };
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const items = await listProductsForAdmin();
  const missingPrice = items.filter((p) => p.status === "active" && p.priceMissing).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-verdemoikato/20 pb-6">
        <div>
          <p className="eyebrow text-amarelomoikato-700">Catálogo</p>
          <h1 className="mt-2 font-display text-5xl font-light">Peças</h1>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex min-h-11 items-center bg-verdemoikato px-5 text-xs font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta"
        >
          + Nova peça
        </Link>
      </div>

      {missingPrice > 0 && (
        <p className="mt-6 border-l-2 border-amarelomoikato bg-amarelomoikato/10 px-4 py-3 text-sm">
          {missingPrice} {missingPrice === 1 ? "peça na loja ainda não tem" : "peças na loja ainda não têm"} preço em R$.
          Enquanto isso, a loja mostra o preço antigo.
        </p>
      )}

      <ul className="mt-6 divide-y divide-verdemoikato/15 border-y border-verdemoikato/15">
        {items.map((product) => {
          const status = STATUS[product.status];
          const stock = stockSummary(product);
          const price = priceSummary(product.variants);
          return (
            <li key={product.id}>
              <Link
                href={`/admin/produtos/${product.id}`}
                className="grid grid-cols-[56px_1fr] items-center gap-4 py-3 hover:bg-verdemoikato/[0.03] sm:grid-cols-[56px_1fr_auto_auto_auto] sm:gap-6"
              >
                <div className="relative size-14 overflow-hidden bg-areia-200">
                  {product.thumbnail && (
                    <Image src={product.thumbnail} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-xs text-verdemoikato/55">
                    {CATEGORY[product.category]} · {product.variants.length}{" "}
                    {product.variants.length === 1 ? "variação" : "variações"}
                  </p>
                </div>
                <p className={`col-start-2 text-sm sm:col-start-auto ${price ? "" : "text-verdemoikato/45"}`}>
                  {price ?? "Sem preço em R$"}
                </p>
                <p className={`col-start-2 text-sm sm:col-start-auto ${stock.warn ? "text-terra-700" : "text-verdemoikato/60"}`}>
                  {stock.label}
                </p>
                <span
                  className={`col-start-2 w-fit px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] sm:col-start-auto ${status.className}`}
                >
                  {status.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
