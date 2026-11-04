// Autorização do painel: estar logado não basta — o usuário precisa do papel
// "admin" no Neon Auth. Chame requireAdmin() em TODA página e Server Action do
// /admin (o proxy só redireciona; a checagem que vale é esta).
import "server-only";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { auth } from "./server";

export const ADMIN_LOGIN_PATH = "/admin/entrar";

export function isAdmin(user) {
  return String(user?.role ?? "")
    .split(",")
    .map((role) => role.trim())
    .includes("admin");
}

// Usuário logado (admin ou não) — null sem sessão. Se a sessão vier sem o
// campo role, busca no neon_auth (fonte de verdade dos papéis).
export async function getSessionUser() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) return null;
  if (user.role !== undefined) return user;

  const result = await db.execute(sql`select role from neon_auth."user" where id = ${user.id}`);
  return { ...user, role: result.rows?.[0]?.role ?? null };
}

export async function getAdmin() {
  const user = await getSessionUser();
  return user && isAdmin(user) ? user : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}
