import { requireAdmin } from "../../../../lib/auth/admin";
import { listCouponsForAdmin } from "../../../../lib/admin-products";
import CouponsManager from "../../../../components/admin/CouponsManager";

export const metadata = { title: "Cupons" };

export default async function CouponsPage() {
  await requireAdmin();
  const coupons = await listCouponsForAdmin();

  return (
    <>
      <h1 className="font-display text-4xl font-light text-verdemoikato sm:text-5xl">Cupons</h1>
      <p className="mt-2 max-w-2xl text-sm text-verdemoikato/65">
        O cliente digita o código no checkout. O desconto vale sobre o valor das peças (não sobre o frete) e já vai embutido no
        pagamento. O uso só conta quando o pagamento é confirmado.
      </p>
      <div className="mt-6">
        <CouponsManager coupons={coupons} />
      </div>
    </>
  );
}
