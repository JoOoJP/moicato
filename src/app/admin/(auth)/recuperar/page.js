import Link from "next/link";
import { ResetPasswordForm } from "../../../../components/admin/AuthForms";

export const metadata = { title: "Definir senha" };

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="mb-6 font-display text-4xl font-light">Definir senha</h1>
      <ResetPasswordForm />
      <p className="mt-6 text-center text-sm text-verdemoikato/60">
        <Link href="/admin/entrar" className="underline underline-offset-4 hover:text-verdemoikato">
          Voltar para o login
        </Link>
      </p>
    </>
  );
}
