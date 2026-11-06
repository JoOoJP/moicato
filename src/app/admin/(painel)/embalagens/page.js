import { count, isNotNull } from "drizzle-orm";
import { requireAdmin } from "../../../../lib/auth/admin";
import { listPackages } from "../../../../lib/admin-products";
import { db } from "../../../../lib/db";
import { products } from "../../../../lib/db/schema";
import PackagesManager from "../../../../components/admin/PackagesManager";

export const metadata = { title: "Embalagens" };

export default async function PackagesPage() {
  await requireAdmin();
  const [packages, usageRows] = await Promise.all([
    listPackages(),
    db.select({ packageId: products.packageId, total: count() }).from(products).where(isNotNull(products.packageId)).groupBy(products.packageId),
  ]);
  const usage = Object.fromEntries(usageRows.map((row) => [row.packageId, row.total]));

  return (
    <>
      <h1 className="font-display text-4xl font-light text-verdemoikato sm:text-5xl">Embalagens</h1>
      <p className="mt-2 max-w-2xl text-sm text-verdemoikato/65">
        Cadastre as caixas que você usa para enviar. Em cada peça você só escolhe a embalagem e informa o peso da peça — o frete é
        calculado com as medidas da caixa + peso da peça + peso da caixa vazia.
      </p>
      <div className="mt-6">
        <PackagesManager packages={packages} usage={usage} />
      </div>
    </>
  );
}
