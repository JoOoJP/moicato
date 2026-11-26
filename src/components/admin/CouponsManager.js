"use client";

import { useActionState, useState } from "react";
import { deleteCouponAction, saveCouponAction, toggleCouponAction } from "../../app/admin/actions";
import { centsToInput, formatBRL } from "../../lib/money";
import { FormMessage, SubmitButton } from "./ui";

const input = "mt-1 block min-h-10 w-full border border-verdemoikato/20 bg-white px-3 text-sm focus:border-verdemoikato focus:outline-none";
const dateInput = (date) => (date ? new Date(date).toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }) : "");
const dateLabel = (date) => new Date(date).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

export function describeCoupon(c) {
  if (c.type === "percent") return `${c.value}% de desconto`;
  if (c.type === "fixed") return `${formatBRL(c.value)} de desconto`;
  return "Frete grátis";
}

function status(c) {
  const now = new Date();
  if (!c.active) return { label: "Pausado", className: "bg-verdemoikato/10 text-verdemoikato/60" };
  if (c.endsAt && now > new Date(c.endsAt)) return { label: "Expirado", className: "bg-verdemoikato/10 text-verdemoikato/60" };
  if (c.startsAt && now < new Date(c.startsAt)) return { label: "Agendado", className: "bg-amarelomoikato/25 text-verdemoikato" };
  if (c.maxUses != null && c.usesCount >= c.maxUses) return { label: "Esgotado", className: "bg-verdemoikato/10 text-verdemoikato/60" };
  return { label: "Ativo", className: "bg-verdemoikato text-osso" };
}

function CouponForm({ coupon, onDone }) {
  const [state, action] = useActionState(async (prev, fd) => {
    const result = await saveCouponAction(prev, fd);
    if (result?.ok && onDone) onDone();
    return result;
  }, null);
  const c = coupon ?? { type: "percent", active: true };
  const [type, setType] = useState(c.type);

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {c.id && <input type="hidden" name="id" value={c.id} />}
      <label>
        <span className="text-xs text-verdemoikato/60">Código</span>
        <input name="code" defaultValue={c.code ?? ""} placeholder="BEMVINDA10" className={`${input} font-mono uppercase`} required />
      </label>
      <label>
        <span className="text-xs text-verdemoikato/60">Tipo</span>
        <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={input}>
          <option value="percent">Percentual (%)</option>
          <option value="fixed">Valor fixo (R$)</option>
          <option value="free_shipping">Frete grátis</option>
        </select>
      </label>
      {type === "percent" && (
        <label>
          <span className="text-xs text-verdemoikato/60">Desconto (%)</span>
          <input name="percent" defaultValue={c.type === "percent" ? c.value : ""} inputMode="numeric" placeholder="10" className={input} />
        </label>
      )}
      {type === "fixed" && (
        <label>
          <span className="text-xs text-verdemoikato/60">Desconto (R$)</span>
          <input name="amount" defaultValue={c.type === "fixed" ? centsToInput(c.value) : ""} inputMode="decimal" placeholder="30,00" className={input} />
        </label>
      )}
      <label>
        <span className="text-xs text-verdemoikato/60">Pedido mínimo (R$)</span>
        <input name="minSubtotal" defaultValue={centsToInput(c.minSubtotalCents)} inputMode="decimal" placeholder="Sem mínimo" className={input} />
      </label>
      <label>
        <span className="text-xs text-verdemoikato/60">Válido a partir de</span>
        <input type="date" name="startsAt" defaultValue={dateInput(c.startsAt)} className={input} />
      </label>
      <label>
        <span className="text-xs text-verdemoikato/60">Válido até</span>
        <input type="date" name="endsAt" defaultValue={dateInput(c.endsAt)} className={input} />
      </label>
      <label>
        <span className="text-xs text-verdemoikato/60">Limite de usos</span>
        <input name="maxUses" defaultValue={c.maxUses ?? ""} inputMode="numeric" placeholder="Sem limite" className={input} />
      </label>
      <label className="sm:col-span-2 lg:col-span-2">
        <span className="text-xs text-verdemoikato/60">Anotação interna (opcional)</span>
        <input name="note" defaultValue={c.note ?? ""} placeholder="Ex.: parceria com influenciadora" className={input} />
      </label>
      <label className="flex min-h-10 items-center gap-2 self-end text-sm">
        <input type="checkbox" name="active" defaultChecked={c.active} className="size-4 accent-verdemoikato" />
        Ativo
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
        <SubmitButton>{c.id ? "Salvar cupom" : "Criar cupom"}</SubmitButton>
        {onDone && (
          <button type="button" onClick={onDone} className="min-h-11 text-xs text-verdemoikato/60 hover:text-verdemoikato">
            Cancelar
          </button>
        )}
        <FormMessage state={state} />
      </div>
    </form>
  );
}

function CouponRow({ coupon }) {
  const [editing, setEditing] = useState(false);
  const s = status(coupon);
  const rules = [
    coupon.minSubtotalCents != null && `pedidos a partir de ${formatBRL(coupon.minSubtotalCents)}`,
    coupon.startsAt && `de ${dateLabel(coupon.startsAt)}`,
    coupon.endsAt && `até ${dateLabel(coupon.endsAt)}`,
  ].filter(Boolean);

  return (
    <div className="border-b border-verdemoikato/10 px-4 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-base text-verdemoikato">{coupon.code}</span>
        <span className={`px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.1em] ${s.className}`}>{s.label}</span>
        <span className="text-sm text-verdemoikato">{describeCoupon(coupon)}</span>
        <span className="ml-auto text-sm text-verdemoikato/60">
          {coupon.usesCount} {coupon.usesCount === 1 ? "uso" : "usos"}
          {coupon.maxUses != null && ` de ${coupon.maxUses}`}
        </span>
      </div>
      {(rules.length > 0 || coupon.note) && (
        <p className="mt-1 text-xs text-verdemoikato/55">
          {rules.join(" · ")}
          {coupon.note && `${rules.length ? " · " : ""}${coupon.note}`}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-4 text-xs">
        <button type="button" onClick={() => setEditing((v) => !v)} className="min-h-9 text-verdemoikato underline-offset-4 hover:underline">
          {editing ? "Fechar" : "Editar"}
        </button>
        <form action={toggleCouponAction}>
          <input type="hidden" name="id" value={coupon.id} />
          <input type="hidden" name="active" value={String(!coupon.active)} />
          <button type="submit" className="min-h-9 text-verdemoikato underline-offset-4 hover:underline">
            {coupon.active ? "Pausar" : "Ativar"}
          </button>
        </form>
        {coupon.usesCount === 0 && (
          <form action={deleteCouponAction}>
            <input type="hidden" name="id" value={coupon.id} />
            <button type="submit" className="min-h-9 text-terra-700 underline-offset-4 hover:underline">
              Excluir
            </button>
          </form>
        )}
      </div>
      {editing && (
        <div className="mt-4 border-t border-verdemoikato/10 pt-4">
          <CouponForm coupon={coupon} onDone={() => setEditing(false)} />
        </div>
      )}
    </div>
  );
}

export default function CouponsManager({ coupons }) {
  const [creating, setCreating] = useState(false);
  return (
    <div className="space-y-6">
      <div className="border border-verdemoikato/15 bg-white/50 p-4 sm:p-5">
        {creating ? (
          <CouponForm onDone={() => setCreating(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex min-h-11 items-center bg-verdemoikato px-5 text-xs font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta"
          >
            + Novo cupom
          </button>
        )}
      </div>

      {coupons.length === 0 ? (
        <p className="border border-dashed border-verdemoikato/25 px-6 py-12 text-center text-sm text-verdemoikato/60">
          Nenhum cupom ainda. Crie o primeiro — por exemplo, 10% para a primeira compra.
        </p>
      ) : (
        <div className="border border-verdemoikato/15 bg-white/50">
          {coupons.map((coupon) => (
            <CouponRow key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
}
