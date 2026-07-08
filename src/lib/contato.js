// Contatos centralizados da Moikato — configuráveis por variável de ambiente,
// com fallback pros valores atuais. Para LIGAR o WhatsApp, basta definir
// NEXT_PUBLIC_WHATSAPP_PHONE (formato internacional, só dígitos — 55 + DDD +
// número, ex.: "5563999999999") no ambiente/hosting; nenhuma mudança de código.
export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
export const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM ?? "@moikato";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM.replace(/^@/, "")}`;
export const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "contato@moikato.com.br";

// true quando já há número configurado (para decidir target=_blank etc.)
export const whatsappReady = Boolean(WHATSAPP_PHONE);

// Monta o link do WhatsApp com mensagem pré-preenchida.
// Sem número ainda → cai para a âncora de contato, sem quebrar o funil.
export function waLink(message) {
  if (!WHATSAPP_PHONE) return "#contato";
  const base = `https://wa.me/${WHATSAPP_PHONE}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
