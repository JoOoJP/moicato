// Modelos dos e-mails transacionais (HTML compatível com clientes de e-mail:
// tabelas e estilos inline). Sem dependências de servidor — dá para gerar
// pré-visualizações localmente.
import { formatBRL } from "./money";
import { COMPANY, legalLine } from "./empresa";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://moikato.com").replace(/\/$/, "");
const C = { green: "#033f00", gold: "#b48332", bg: "#f2ede1", ink: "#14241b", muted: "#5f6b62", line: "#ddd5c4" };

const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

export const trackingUrl = (code) => `https://www.melhorrastreio.com.br/rastreio/${encodeURIComponent(code)}`;

const COPY = {
  "pt-BR": {
    greeting: (name) => `Olá, ${name}`,
    order: (id) => `Pedido nº ${id}`,
    subtotal: "Subtotal",
    shipping: "Frete",
    total: "Total",
    deliverTo: "Entrega em",
    gift: "Embalagem para presente",
    giftMessage: "Mensagem no cartão",
    help: "Dúvidas? Responda este e-mail ou fale com a gente pelo WhatsApp.",
    returns: "Trocas e devoluções",
    confirmed: {
      subject: (id) => `Pedido nº ${id} confirmado — Moikato`,
      title: "Recebemos seu pagamento",
      intro: "Obrigado pela compra. Sua peça já está sendo preparada à mão, com cuidado, para o envio. Assim que for postada, mandamos o código de rastreio.",
    },
    shippedCopy: {
      subject: (id) => `Seu pedido nº ${id} foi enviado — Moikato`,
      title: "Sua peça está a caminho",
      intro: "Postamos o seu pedido. Você pode acompanhar a entrega pelo código abaixo.",
      code: "Código de rastreio",
      via: "Enviado por",
      cta: "Acompanhar entrega",
    },
  },
  en: {
    greeting: (name) => `Hello, ${name}`,
    order: (id) => `Order #${id}`,
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    deliverTo: "Delivering to",
    gift: "Gift wrap",
    giftMessage: "Card message",
    help: "Questions? Reply to this email or message us on WhatsApp.",
    returns: "Returns and exchanges",
    confirmed: {
      subject: (id) => `Order #${id} confirmed — Moikato`,
      title: "Payment received",
      intro: "Thank you for your order. Your piece is being prepared by hand for shipping. As soon as it ships, we'll send you the tracking code.",
    },
    shippedCopy: {
      subject: (id) => `Your order #${id} has shipped — Moikato`,
      title: "Your piece is on its way",
      intro: "We've shipped your order. You can follow the delivery with the code below.",
      code: "Tracking code",
      via: "Shipped with",
      cta: "Track delivery",
    },
  },
};

function layout({ lang, preheader, body }) {
  const t = COPY[lang] ?? COPY["pt-BR"];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Moikato</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${C.line};">
<tr><td style="padding:28px 32px 20px;border-bottom:1px solid ${C.line};font-family:Georgia,'Times New Roman',serif;font-size:26px;color:${C.green};letter-spacing:.5px;">Moikato</td></tr>
<tr><td style="padding:28px 32px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${C.ink};">${body}</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid ${C.line};font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${C.muted};">
${esc(t.help)}<br><a href="${SITE}/${lang}/politicas/trocas-e-devolucoes" style="color:${C.green};">${esc(t.returns)}</a>
${legalLine() ? `<br><br>${esc(legalLine())}` : ""}
</td></tr></table></td></tr></table></body></html>`;
}

function itemsTable(order, items, t) {
  const rows = items
    .map(
      (item) => `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${C.line};">${item.qty}× ${esc(item.nameSnapshot)}${item.labelSnapshot ? ` <span style="color:${C.muted}">· ${esc(item.labelSnapshot)}</span>` : ""}</td>
<td align="right" style="padding:10px 0;border-bottom:1px solid ${C.line};white-space:nowrap;">${formatBRL(item.unitPriceCents * item.qty)}</td></tr>`
    )
    .join("");
  const line = (label, value, bold) =>
    `<tr><td style="padding:6px 0;color:${bold ? C.ink : C.muted};${bold ? "font-weight:bold;" : ""}">${label}</td><td align="right" style="padding:6px 0;${bold ? "font-weight:bold;" : ""}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;font-size:14px;">${rows}
${line(t.subtotal, formatBRL(order.subtotalCents))}
${line(`${t.shipping}${order.shippingService ? ` (${esc(order.shippingService)})` : ""}`, formatBRL(order.shippingCents))}
${line(t.total, formatBRL(order.totalCents), true)}</table>`;
}

function addressBlock(order, t) {
  const a = order.address ?? {};
  return `<p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.gold};">${t.deliverTo}</p>
<p style="margin:0;">${esc(a.street)}, ${esc(a.number)}${a.complement ? ` — ${esc(a.complement)}` : ""}<br>${esc(a.district)} · ${esc(a.city)}/${esc(a.uf)} · CEP ${esc(a.cep)}</p>`;
}

function giftBlock(order, t) {
  if (!order.giftWrap && !order.giftMessage) return "";
  return `<p style="margin:20px 0 0;padding:12px 14px;background:${C.bg};border-left:2px solid ${C.gold};">
${order.giftWrap ? `<strong>${t.gift}</strong>` : ""}${order.giftMessage ? `${order.giftWrap ? "<br>" : ""}${t.giftMessage}: <em style="font-family:Georgia,serif;">“${esc(order.giftMessage)}”</em>` : ""}</p>`;
}

const firstName = (name) => String(name ?? "").trim().split(/\s+/)[0] || "";

export function orderConfirmedEmail(order, items) {
  const lang = order.locale === "en" ? "en" : "pt-BR";
  const t = COPY[lang];
  const body = `<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:${C.green};">${t.confirmed.title}</h1>
<p style="margin:0 0 18px;color:${C.muted};">${t.order(order.id)}</p>
<p style="margin:0 0 12px;">${esc(t.greeting(firstName(order.customerName)))},</p>
<p style="margin:0;">${t.confirmed.intro}</p>
${itemsTable(order, items, t)}${addressBlock(order, t)}${giftBlock(order, t)}`;
  return { subject: t.confirmed.subject(order.id), html: layout({ lang, preheader: t.confirmed.intro, body }) };
}

export function orderShippedEmail(order) {
  const lang = order.locale === "en" ? "en" : "pt-BR";
  const t = COPY[lang];
  const s = t.shippedCopy;
  const url = trackingUrl(order.trackingCode);
  const body = `<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:${C.green};">${s.title}</h1>
<p style="margin:0 0 18px;color:${C.muted};">${t.order(order.id)}</p>
<p style="margin:0 0 12px;">${esc(t.greeting(firstName(order.customerName)))},</p>
<p style="margin:0 0 20px;">${s.intro}</p>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.gold};">${s.code}</p>
<p style="margin:0 0 6px;font-family:Menlo,Consolas,monospace;font-size:18px;color:${C.green};">${esc(order.trackingCode)}</p>
${order.shippingService ? `<p style="margin:0 0 20px;color:${C.muted};">${s.via} ${esc(order.shippingService)}</p>` : ""}
<p style="margin:0 0 24px;"><a href="${url}" style="display:inline-block;padding:12px 22px;background:${C.green};color:#ffffff;text-decoration:none;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">${s.cta}</a></p>
${addressBlock(order, t)}`;
  return { subject: s.subject(order.id), html: layout({ lang, preheader: s.intro, body }) };
}

// Aviso interno (sempre em pt-BR).
export function newOrderAdminEmail(order, items) {
  const t = COPY["pt-BR"];
  const body = `<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-weight:normal;font-size:24px;color:${C.green};">Pedido novo pago · nº ${order.id}</h1>
<p style="margin:0 0 4px;"><strong>${esc(order.customerName)}</strong> · ${esc(order.email)}${order.phone ? ` · ${esc(order.phone)}` : ""}</p>
${itemsTable(order, items, t)}${addressBlock(order, t)}${giftBlock(order, t)}
<p style="margin:24px 0 0;"><a href="${SITE}/admin/pedidos/${order.id}" style="display:inline-block;padding:12px 22px;background:${C.green};color:#ffffff;text-decoration:none;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Abrir no painel</a></p>
<p style="margin:16px 0 0;color:${C.muted};font-size:13px;">Depois de postar, marque como enviado no painel com o código de rastreio — o cliente recebe o e-mail automaticamente.</p>`;
  return {
    subject: `Pedido nº ${order.id} pago — ${formatBRL(order.totalCents)} — ${order.customerName}`,
    html: layout({ lang: "pt-BR", preheader: `${order.customerName} · ${formatBRL(order.totalCents)}`, body }),
  };
}

export const SERVICE_EMAIL = COMPANY.serviceEmail;
