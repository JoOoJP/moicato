import { count, isNotNull } from "drizzle-orm";
import { requireAdmin } from "../../../../lib/auth/admin";
import { listCollectionsForAdmin } from "../../../../lib/admin-products";
import { db } from "../../../../lib/db";
import { products } from "../../../../lib/db/schema";
import CollectionsManager from "../../../../components/admin/CollectionsManager";

export const metadata = { title: "Coleções" };

export default async function CollectionsPage() {
  await requireAdmin();
  const [collections, rows] = await Promise.all([
    listCollectionsForAdmin(),
    db
      .select({ collectionId: products.collectionId, total: count() })
      .from(products)
      .where(isNotNull(products.collectionId))
      .groupBy(products.collectionId),
  ]);
  const counts = Object.fromEntries(rows.map((row) => [row.collectionId, row.total]));

  return (
    <>
      <h1 className="font-display text-4xl font-light text-verdemoikato sm:text-5xl">Coleções</h1>
      <p className="mt-2 max-w-2xl text-sm text-verdemoikato/65">
        Cada coleção vira um capítulo do catálogo, com nome e uma frase. Para colocar uma peça numa coleção, abra a peça e escolha em
        “Organização”.
      </p>
      <div className="mt-6">
        <CollectionsManager collections={collections} counts={counts} />
      </div>
    </>
  );
}
