"use client";

import { useState } from "react";
import { formatBRL } from "../../lib/money";

export default function ShippingEstimator({ items, labels }) {
  const [cep, setCep] = useState("");
  const [state, setState] = useState({ status: "idle", options: [] });

  async function estimate(event) {
    event.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return setState({ status: "error", message: labels.invalid, options: [] });
    setState({ status: "loading", options: [] });
    try {
      const response = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: digits, items }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState({ status: "done", options: data.options });
    } catch (error) {
      setState({ status: "error", message: error.message === "invalid" ? labels.invalid : labels.error, options: [] });
    }
  }

  return (
    <div className="border-b border-verdemoikato/15 py-5">
      <form onSubmit={estimate} className="flex items-end gap-2">
        <label className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{labels.label}</span>
          <input
            value={cep}
            onChange={(event) => setCep(event.target.value.replace(/[^\d-]/g, "").slice(0, 9))}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder={labels.placeholder}
            className="mt-1.5 block min-h-11 w-full border border-verdemoikato/25 bg-white/60 px-3 text-sm focus:border-verdemoikato focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="min-h-11 border border-verdemoikato px-4 text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato hover:bg-verdemoikato hover:text-osso disabled:opacity-50"
        >
          {state.status === "loading" ? "…" : labels.button}
        </button>
      </form>
      {state.status === "error" && <p className="mt-2 text-sm text-terra-700">{state.message}</p>}
      {state.options.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {state.options.map((option) => (
            <li key={option.id} className="flex justify-between gap-4">
              <span className="text-verdemoikato/75">
                {option.company} {option.name} · {labels.days.replace("{days}", option.days)}
              </span>
              <span className="font-medium text-verdemoikato">{option.priceCents === 0 ? labels.free : formatBRL(option.priceCents)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
