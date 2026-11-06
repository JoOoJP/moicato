import Link from "next/link";
import { requireAdmin } from "../../../lib/auth/admin";
import { listProductsForAdmin } from "../../../lib/admin-products";
import ProductList from "../../../components/admin/ProductList";

export const metadata = { title: "Peças" };

export default async function AdminProductsPage() {
  await requireAdmin();
  const items = await listProductsForAdmin();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-light text-verdemoikato sm:text-5xl">Peças</h1>
          <p className="mt-1 text-sm text-verdemoikato/60">Clique numa peça para editar fotos, textos e opções. Preço e estoque dá para mudar direto aqui.</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex min-h-11 items-center bg-verdemoikato px-5 text-xs font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta"
        >
          + Nova peça
        </Link>
      </div>
      <div className="mt-6">
        <ProductList items={items} />
      </div>
    </>
  );
}
