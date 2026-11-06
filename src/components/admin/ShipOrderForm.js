"use client";

import { useActionState } from "react";
import { markShippedAction } from "../../app/admin/actions";
import { FormMessage, SubmitButton } from "./ui";

export default function ShipOrderForm({ orderId, trackingCode }) {
  const [state, action] = useActionState(markShippedAction, null);
  return (
    <form action={action} className="border border-verdemoikato/15 bg-white/50 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Envio</h2>
      <input type="hidden" name="id" value={orderId} />
      <label className="mt-3 block">
        <span className="text-xs font-medium text-verdemoikato/70">Código de rastreio</span>
        <input
          name="trackingCode"
          defaultValue={trackingCode ?? ""}
          placeholder="Ex.: AA123456789BR"
          className="mt-1.5 block min-h-11 w-full border border-verdemoikato/20 bg-white px-3 font-mono text-sm uppercase focus:border-verdemoikato focus:outline-none"
        />
      </label>
      <SubmitButton className="mt-3 w-full">{trackingCode ? "Atualizar rastreio" : "Marcar como enviado"}</SubmitButton>
      <div className="mt-2">
        <FormMessage state={state} />
      </div>
    </form>
  );
}
