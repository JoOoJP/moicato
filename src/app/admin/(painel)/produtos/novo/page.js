import Link from "next/link";
import { requireAdmin } from "../../../../../lib/auth/admin";
import ProductForm from "../../../../../components/admin/ProductForm";

export const metadata = { title: "Nova peça" };

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60 hover:text-verdemoikato">
        ← Peças
      </Link>
      <h1 className="mt-3 border-b border-verdemoikato/20 pb-6 font-display text-5xl font-light">Nova peça</h1>
      <p className="mt-6 text-sm text-verdemoikato/60">
        Depois de criar, você adiciona preço, estoque e fotos. Ela começa como rascunho (escondida da loja).
      </p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </>
  );
}
