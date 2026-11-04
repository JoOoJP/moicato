import { redirect } from "next/navigation";
import { getSessionUser, isAdmin } from "../../../../lib/auth/admin";
import { signOutAction } from "../../actions";
import { SignInForm } from "../../../../components/admin/AuthForms";
import { FormMessage, SubmitButton } from "../../../../components/admin/ui";

export const metadata = { title: "Entrar" };

export default async function SignInPage({ searchParams }) {
  const user = await getSessionUser();
  if (user && isAdmin(user)) redirect("/admin");
  const { senha } = await searchParams;

  // Logado, mas sem papel admin.
  if (user) {
    return (
      <>
        <h1 className="mb-6 font-display text-4xl font-light">Sem acesso</h1>
        <FormMessage state={{ error: `A conta ${user.email} não tem acesso ao painel.` }} />
        <form action={signOutAction} className="mt-6">
          <SubmitButton pendingLabel="Saindo…" className="w-full">
            Sair e entrar com outra conta
          </SubmitButton>
        </form>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-6 font-display text-4xl font-light">Entrar</h1>
      <SignInForm notice={senha === "ok" ? "Senha definida. Entre com a nova senha." : null} />
    </>
  );
}
