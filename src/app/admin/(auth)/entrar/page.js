import { redirect } from "next/navigation";
import { getAdmin } from "../../../../lib/auth/admin";
import { SignInForm } from "../../../../components/admin/AuthForms";

export const metadata = { title: "Entrar" };

export default async function SignInPage({ searchParams }) {
  if (await getAdmin()) redirect("/admin");
  const { senha } = await searchParams;

  return (
    <>
      <h1 className="mb-6 font-display text-4xl font-light">Entrar</h1>
      <SignInForm notice={senha === "ok" ? "Senha definida. Entre com a nova senha." : null} />
    </>
  );
}
