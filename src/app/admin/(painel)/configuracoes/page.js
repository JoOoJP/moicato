import { requireAdmin } from "../../../../lib/auth/admin";
import { getStoreSettings, paymentsReady, shippingReady } from "../../../../lib/settings";
import SettingsForm from "../../../../components/admin/SettingsForm";

export const metadata = { title: "Configurações" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getStoreSettings();

  return (
    <>
      <h1 className="font-display text-4xl font-light text-verdemoikato sm:text-5xl">Configurações</h1>
      <p className="mt-2 text-sm text-verdemoikato/65">Regras que valem para a loja inteira.</p>
      <div className="mt-6 max-w-3xl">
        <SettingsForm settings={settings} paymentsReady={paymentsReady} shippingReady={shippingReady} />
      </div>
    </>
  );
}
