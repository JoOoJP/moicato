import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../../lib/auth/admin";
import { getProductForAdmin } from "../../../../../lib/admin-products";
import ProductForm from "../../../../../components/admin/ProductForm";
import VariantsEditor from "../../../../../components/admin/VariantsEditor";
import ImagesEditor from "../../../../../components/admin/ImagesEditor";

export const metadata = { title: "Editar peça" };

export default async function EditProductPage({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const { salvo } = await searchParams;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const product = await getProductForAdmin(productId);
  if (!product) notFound();

  return (
    <>
      <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60 hover:text-verdemoikato">
        ← Peças
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-verdemoikato/20 pb-6">
        <h1 className="font-display text-5xl font-light">{product.pt.name ?? product.slug}</h1>
        {product.status === "active" && (
          <Link
            href={`/pt-BR/catalogo/${product.slug}`}
            target="_blank"
            className="min-h-11 content-center text-xs font-semibold uppercase tracking-[0.12em] text-amarelomoikato-700 hover:underline"
          >
            Ver na loja ↗
          </Link>
        )}
      </div>
      {salvo && (
        <p role="status" className="mt-6 border-l-2 border-verdemoikato bg-verdemoikato/5 px-3 py-2 text-sm">
          Peça criada. Agora adicione preço, estoque e fotos.
        </p>
      )}

      <div className="mt-10 space-y-16">
        <VariantsEditor productId={product.id} slug={product.slug} variants={product.variants} />
        <ImagesEditor productId={product.id} images={product.images} />
        <section>
          <h2 className="mb-6 font-display text-3xl">Informações</h2>
          <ProductForm product={product} />
        </section>
      </div>
    </>
  );
}
