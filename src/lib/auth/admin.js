// Autorização do painel: estar logado não basta — o usuário precisa do papel
// "admin" no Neon Auth. Chame requireAdmin() em TODA página e Server Action do
// /admin (o proxy só redireciona; a checagem que vale é esta).
import "server-only";
import { redirect } from "next/navigation";
import { auth } from "./server";

export const ADMIN_LOGIN_PATH = "/admin/entrar";

function isAdmin(user) {
  return String(user?.role ?? "")
    .split(",")
    .map((role) => role.trim())
    .includes("admin");
}

export async function getAdmin() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  return user && isAdmin(user) ? user : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}
