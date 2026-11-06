"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "../../app/admin/actions";
import { centsToInput } from "../../lib/money";
import { FormMessage, SubmitButton } from "./ui";

const input = "mt-1.5 block min-h-11 w-full border border-verdemoikato/20 bg-white px-3 text-sm focus:border-verdemoikato focus:outline-none";

function Check({ ok, children }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className={ok ? "text-verdemoikato" : "text-terra-700"}>{ok ? "✓" : "○"}</span>
      <span className={ok ? "text-verdemoikato/80" : "text-verdemoikato/65"}>{children}</span>
    </li>
  );
}

export default function SettingsForm({ settings, paymentsReady, shippingReady }) {
  const [state, action] = useActionState(saveSettingsAction, null);
  const canOpen = paymentsReady && shippingReady;

  return (
    <form action={action} className="space-y-5">
      <section className="border border-verdemoikato/15 bg-white/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Vendas</h2>
        <ul className="mt-3 space-y-1.5">
          <Check ok={paymentsReady}>Pagamento (Asaas) configurado</Check>
          <Check ok={shippingReady}>Frete (Melhor Envio) configurado</Check>
        </ul>
        <label className={`mt-4 flex min-h-11 items-center gap-3 ${canOpen ? "" : "opacity-60"}`}>
          <input type="checkbox" name="salesOpen" defaultChecked={settings.salesOpen} className="size-5 accent-verdemoikato" />
          <span>
            <span className="font-medium">Vendas abertas</span>
            <span className="block text-xs text-verdemoikato/55">
              {canOpen
                ? "Desmarque para pausar as vendas (a loja continua visível)."
                : "Pode deixar marcado: as vendas só abrem quando pagamento e frete estiverem configurados."}
            </span>
          </span>
        </label>
      </section>

      <section className="border border-verdemoikato/15 bg-white/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Pagamento e frete</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-xs font-medium text-verdemoikato/70">Parcelas sem juros (máximo)</span>
            <input name="maxInstallments" defaultValue={settings.maxInstallments} inputMode="numeric" className={input} />
          </label>
          <label>
            <span className="text-xs font-medium text-verdemoikato/70">Parcela mínima (R$)</span>
            <input name="minInstallment" defaultValue={centsToInput(settings.minInstallmentCents)} inputMode="decimal" className={input} />
          </label>
          <label>
            <span className="text-xs font-medium text-verdemoikato/70">Frete grátis a partir de (R$)</span>
            <input name="freeShipping" defaultValue={centsToInput(settings.freeShippingCents)} inputMode="decimal" placeholder="Vazio = sem frete grátis" className={input} />
          </label>
          <label>
            <span className="text-xs font-medium text-verdemoikato/70">Desconto no Pix (%)</span>
            <input name="pixDiscountPercent" defaultValue={settings.pixDiscountPercent} inputMode="numeric" className={input} />
            <span className="mt-1 block text-xs text-terra-700">
              A loja exibe esse desconto e ele precisa ser cumprido (CDC). Só ative quando o desconto estiver configurado no pagamento.
            </span>
          </label>
        </div>
        <label className="mt-5 flex min-h-11 items-center gap-3">
          <input type="checkbox" name="giftWrapEnabled" defaultChecked={settings.giftWrapEnabled} className="size-5 accent-verdemoikato" />
          <span>
            <span className="font-medium">Oferecer embalagem para presente</span>
            <span className="block text-xs text-verdemoikato/55">Caixa com laço e cartão, sem custo. Aparece na sacola e no checkout.</span>
          </span>
        </label>
        <p className="mt-4 text-xs text-verdemoikato/55">
          Exemplo: com 3 parcelas e mínima de R$ 50,00, uma peça de R$ 120 aparece como “ou 2x de R$ 60,00 sem juros”.
        </p>
      </section>

      <div className="flex items-center gap-4">
        <SubmitButton>Salvar configurações</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
