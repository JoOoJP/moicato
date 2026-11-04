import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../../lib/auth/admin";
import { getProductForAdmin, listPackages } from "../../../../../lib/admin-products";
import ProductEditor from "../../../../../components/admin/ProductEditor";

export const metadata = { title: "Editar peça" };

export default async function EditProductPage({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const { salvo } = await searchParams;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const [product, packages] = await Promise.all([getProductForAdmin(productId), listPackages()]);
  if (!product) notFound();

  return (
    <>
      <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60 hover:text-verdemoikato">
        ← Peças
      </Link>
      <h1 className="mb-6 mt-2 font-display text-4xl font-light text-verdemoikato">{product.pt.name ?? product.slug}</h1>
      {salvo && (
        <p role="status" className="mb-5 border-l-2 border-verdemoikato bg-verdemoikato/5 px-3 py-2 text-sm">
          Peça criada como rascunho. Quando estiver pronta, mude o status para “Na loja”.
        </p>
      )}
      <ProductEditor product={product} packages={packages} legacyPrice={product.pt.legacyPriceLabel} />
    </>
  );
}
