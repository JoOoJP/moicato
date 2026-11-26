"use client";

import { useActionState } from "react";
import { requestAccessAction } from "../../app/[lang]/minha-conta/actions";

export default function AccessForm({ lang, t }) {
  const [state, action, pending] = useActionState(requestAccessAction, null);

  if (state?.sent) {
    return (
      <p role="status" className="border-l-2 border-amarelomoikato bg-amarelomoikato/10 px-4 py-3 text-[0.95rem] leading-relaxed text-verdemoikato">
        {t.sent.replace("{email}", state.email)}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="lang" value={lang} />
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{t.email}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 block min-h-12 w-full border border-verdemoikato/25 bg-white/70 px-3 text-[0.95rem] text-verdemoikato focus:border-verdemoikato focus:outline-none focus:ring-2 focus:ring-amarelomoikato/40"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center bg-floresta text-[0.78rem] tracking-[0.14em] text-osso transition-colors hover:bg-verdemoikato disabled:opacity-60"
      >
        {(pending ? t.sending : t.send).toUpperCase()}
      </button>
    </form>
  );
}
