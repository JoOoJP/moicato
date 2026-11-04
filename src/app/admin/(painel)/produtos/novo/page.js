import Link from "next/link";
import { requireAdmin } from "../../../../../lib/auth/admin";
import { listPackages } from "../../../../../lib/admin-products";
import ProductEditor from "../../../../../components/admin/ProductEditor";

export const metadata = { title: "Nova peça" };

export default async function NewProductPage() {
  await requireAdmin();
  const packages = await listPackages();

  return (
    <>
      <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60 hover:text-verdemoikato">
        ← Peças
      </Link>
      <h1 className="mb-6 mt-2 font-display text-4xl font-light text-verdemoikato">Nova peça</h1>
      <ProductEditor packages={packages} />
    </>
  );
}
