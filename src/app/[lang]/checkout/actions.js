"use server";

// Fecha o pedido: revalida tudo no servidor (preço, estoque, frete), reserva o
// estoque, cria o pedido e gera o checkout do Asaas. O navegador só manda IDs.
import { getDictionary, hasLocale } from "../dictionaries";
import { SITE_URL } from "../../../lib/site";
import { getStoreSettings } from "../../../lib/settings";
import { isValidCpf, normalizeCep, normalizeCpf } from "../../../lib/cpf";
import { quoteShipping } from "../../../lib/melhorenvio";
import { attachCheckout, cancelPendingOrder, createPendingOrder, loadCartLines } from "../../../lib/orders";
import { createCheckout } from "../../../lib/asaas";

const text = (formData, key, max = 200) => String(formData.get(key) ?? "").trim().slice(0, max);

export async function placeOrderAction(_prev, formData) {
  const lang = hasLocale(formData.get("lang")) ? formData.get("lang") : "pt-BR";
  const errors = (await getDictionary(lang)).checkout.errors;
  const settings = await getStoreSettings();
  if (!settings.salesLive) return { error: errors.payment };

  let items;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: errors.generic };
  }
  const lines = await loadCartLines(items, lang);
  if (lines.length === 0) return { error: errors.empty };
  if (lines.length !== items.length || lines.some((line) => !line.ok)) return { error: errors.changed, refresh: true };

  const customer = {
    name: text(formData, "name", 120),
    email: text(formData, "email", 160).toLowerCase(),
    phone: text(formData, "phone", 20).replace(/\D/g, "") || null,
    cpf: normalizeCpf(formData.get("cpf")),
  };
  const address = {
    cep: normalizeCep(formData.get("cep")),
    street: text(formData, "street"),
    number: text(formData, "number", 20),
    complement: text(formData, "complement", 80),
    district: text(formData, "district", 80),
    city: text(formData, "city", 80),
    uf: text(formData, "uf", 2).toUpperCase(),
  };
  if (!customer.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return { error: errors.generic };
  if (!isValidCpf(customer.cpf)) return { error: errors.cpf };
  if (address.cep.length !== 8 || !address.street || !address.number || !address.city || address.uf.length !== 2) {
    return { error: errors.generic };
  }

  // Frete recotado no servidor; o navegador só escolhe o serviço.
  let shipping;
  try {
    const options = await quoteShipping(
      address.cep,
      lines.map((line) => ({ weightG: line.weightG, packageId: line.packageId, priceCents: line.unitPriceCents, qty: line.qty }))
    );
    const subtotal = lines.reduce((sum, line) => sum + line.unitPriceCents * line.qty, 0);
    const free = settings.freeShippingCents != null && subtotal >= settings.freeShippingCents;
    const index = options.findIndex((option) => option.id === String(formData.get("shippingService")));
    if (index < 0) return { error: errors.generic };
    const option = options[index];
    shipping = {
      priceCents: free && index === 0 ? 0 : option.priceCents,
      label: `${option.company} ${option.name}`.trim(),
    };
  } catch {
    return { error: errors.generic };
  }

  const order = await createPendingOrder({
    lines,
    customer,
    address,
    shipping,
    discountCents: 0,
    giftMessage: text(formData, "gift", 300) || null,
    lang,
  });

  try {
    const checkout = await createCheckout({
      order: { id: order.id, items: lines.map((line) => ({ ...line, name: line.label ? `${line.name} ${line.label}` : line.name })), shippingCents: shipping.priceCents, customer, address },
      siteUrl: SITE_URL,
      lang,
      maxInstallments: settings.maxInstallments,
    });
    await attachCheckout(order.id, checkout.id);
    return { redirect: checkout.link };
  } catch (error) {
    console.error("[checkout] falha ao criar pagamento", error);
    await cancelPendingOrder(order.id);
    return { error: errors.payment };
  }
}
