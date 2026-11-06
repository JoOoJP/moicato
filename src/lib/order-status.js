// Rótulos de status de pedido no painel.
export const ORDER_STATUS = {
  pending: { label: "Aguardando pagamento", className: "bg-amarelomoikato/25 text-verdemoikato" },
  paid: { label: "Pago — enviar", className: "bg-verdemoikato text-osso" },
  shipped: { label: "Enviado", className: "bg-verdemoikato/15 text-verdemoikato" },
  delivered: { label: "Entregue", className: "bg-verdemoikato/10 text-verdemoikato/70" },
  cancelled: { label: "Cancelado", className: "bg-verdemoikato/10 text-verdemoikato/50" },
  expired: { label: "Expirado", className: "bg-verdemoikato/10 text-verdemoikato/50" },
  refunded: { label: "Reembolsado", className: "bg-terra-50 text-terra-700" },
};
