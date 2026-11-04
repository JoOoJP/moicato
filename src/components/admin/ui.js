"use client";

// Primitivas visuais do painel (formulários simples, legíveis no celular).
import { useFormStatus } from "react-dom";

export const inputClass =
  "mt-1.5 block w-full min-h-11 border border-verdemoikato/25 bg-white/70 px-3 py-2 text-[0.95rem] text-verdemoikato placeholder:text-verdemoikato/35 focus:border-verdemoikato focus:outline-none focus:ring-2 focus:ring-amarelomoikato/50";

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-verdemoikato/50">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children, pendingLabel = "Salvando…", variant = "primary", className = "" }) {
  const { pending } = useFormStatus();
  const styles =
    variant === "primary"
      ? "bg-verdemoikato text-osso hover:bg-floresta"
      : "border border-verdemoikato/30 text-verdemoikato hover:bg-verdemoikato/5";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-11 items-center justify-center px-5 text-xs font-semibold uppercase tracking-[0.13em] transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ state }) {
  if (state?.error) {
    return (
      <p role="alert" className="border-l-2 border-terra bg-terra-50/60 px-3 py-2 text-sm text-terra-700">
        {state.error}
      </p>
    );
  }
  if (state?.ok) {
    return (
      <p role="status" className="border-l-2 border-verdemoikato bg-verdemoikato/5 px-3 py-2 text-sm text-verdemoikato">
        {state.ok}
      </p>
    );
  }
  return null;
}
