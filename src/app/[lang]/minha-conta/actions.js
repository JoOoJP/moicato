"use server";

import { getDictionary, hasLocale } from "../dictionaries";
import { SITE_URL } from "../../../lib/site";
import { accessUrl } from "../../../lib/customer-access";
import { hasOrders } from "../../../lib/customer-orders";
import { sendEmail } from "../../../lib/email";
import { accessLinkEmail } from "../../../lib/email-templates";

// Sempre responde igual (não revela se o e-mail comprou na loja).
export async function requestAccessAction(_prev, formData) {
  const lang = hasLocale(formData.get("lang")) ? formData.get("lang") : "pt-BR";
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: true };

  if (await hasOrders(email)) {
    const copy = (await getDictionary(lang)).account;
    const mail = accessLinkEmail({ url: accessUrl(SITE_URL, lang, email), lang, copy });
    await sendEmail({ to: email, ...mail });
  }
  return { sent: true, email };
}
