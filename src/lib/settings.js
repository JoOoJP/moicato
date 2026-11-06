// Configurações da loja (painel → Configurações). Linha única no banco.
import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { storeSettings } from "./db/schema";

export const DEFAULT_SETTINGS = {
  salesOpen: false,
  pixDiscountPercent: 0,
  maxInstallments: 3,
  minInstallmentCents: 5000,
  freeShippingCents: null,
  giftWrapEnabled: true,
};

// Vendas só abrem de verdade com pagamento E frete configurados.
export const paymentsReady = Boolean(process.env.ASAAS_API_KEY);
export const shippingReady = Boolean(process.env.MELHORENVIO_TOKEN && process.env.SHIP_FROM_CEP);

export const getStoreSettings = cache(async () => {
  const [row] = await db.select().from(storeSettings).where(eq(storeSettings.id, 1));
  const settings = { ...DEFAULT_SETTINGS, ...(row ?? {}) };
  // Só em `npm run dev`: DEV_FORCE_SALES=1 abre a loja localmente para testar
  // sacola/checkout sem mexer na configuração de produção.
  const devForce = process.env.NODE_ENV === "development" && process.env.DEV_FORCE_SALES === "1";
  return { ...settings, salesLive: devForce || (settings.salesOpen && paymentsReady && shippingReady) };
});

// Só o que a vitrine precisa (seguro para passar a componentes client).
export function publicPricing(settings) {
  return {
    pixDiscountPercent: settings.pixDiscountPercent,
    maxInstallments: settings.maxInstallments,
    minInstallmentCents: settings.minInstallmentCents,
    freeShippingCents: settings.freeShippingCents,
  };
}
