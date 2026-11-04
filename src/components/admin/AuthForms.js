"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction, sendResetCodeAction, signInAction } from "../../app/admin/actions";
import { Field, FormMessage, SubmitButton, inputClass } from "./ui";

export function SignInForm({ notice }) {
  const [state, formAction] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="space-y-5">
      {notice && !state && <FormMessage state={{ ok: notice }} />}
      <FormMessage state={state} />
      <Field label="E-mail">
        <input name="email" type="email" autoComplete="username" required defaultValue={state?.email} className={inputClass} />
      </Field>
      <Field label="Senha">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <SubmitButton pendingLabel="Entrando…" className="w-full">
        Entrar
      </SubmitButton>
      <p className="text-center text-sm text-verdemoikato/60">
        <Link href="/admin/recuperar" className="underline underline-offset-4 hover:text-verdemoikato">
          Primeiro acesso ou esqueceu a senha?
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [sendState, sendAction] = useActionState(sendResetCodeAction, null);
  const [resetState, resetAction] = useActionState(resetPasswordAction, null);
  const step = resetState ?? sendState;

  if (!step?.sent) {
    return (
      <form action={sendAction} className="space-y-5">
        <p className="text-sm leading-relaxed text-verdemoikato/70">
          Informe o e-mail da sua conta. Se ele tiver acesso ao painel, enviaremos um código de 6 dígitos.
        </p>
        <FormMessage state={sendState} />
        <Field label="E-mail">
          <input name="email" type="email" autoComplete="username" required className={inputClass} />
        </Field>
        <SubmitButton pendingLabel="Enviando…" className="w-full">
          Enviar código
        </SubmitButton>
      </form>
    );
  }

  return (
    <form action={resetAction} className="space-y-5">
      <p className="text-sm leading-relaxed text-verdemoikato/70">
        Se <strong>{step.email}</strong> tiver acesso, o código chegou por e-mail (confira o spam).
      </p>
      <FormMessage state={resetState} />
      <input type="hidden" name="email" value={step.email} />
      <Field label="Código">
        <input name="otp" inputMode="numeric" autoComplete="one-time-code" required maxLength={6} className={inputClass} />
      </Field>
      <Field label="Nova senha" hint="Pelo menos 10 caracteres.">
        <input name="password" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
      </Field>
      <SubmitButton pendingLabel="Salvando…" className="w-full">
        Definir senha
      </SubmitButton>
    </form>
  );
}
