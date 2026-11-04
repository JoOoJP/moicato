"use server";

// Server Actions do painel. Toda ação que lê ou grava dado começa com
// requireAdmin() — não confie só no proxy/redirect das páginas.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, count, eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { productImages, productTranslations, products, productVariants } from "../../lib/db/schema";
import { auth } from "../../lib/auth/server";
import { ADMIN_LOGIN_PATH, requireAdmin } from "../../lib/auth/admin";
import { parseBRLToCents } from "../../lib/money";

const CATEGORIES = ["joias", "moda", "home"];
const STATUSES = ["draft", "active", "archived"];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Vitrine é estática: depois de qualquer mudança, regenera as páginas da loja.
function revalidateCatalog() {
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}

const text = (formData, key) => String(formData.get(key) ?? "").trim();
const optionalText = (formData, key) => text(formData, key) || null;

// Inteiro ≥ 0 ou null (campo vazio). NaN quando inválido.
function optionalInt(formData, key) {
  const value = text(formData, key);
  if (value === "") return null;
  return /^\d+$/.test(value) ? Number(value) : NaN;
}

function idFrom(formData, key = "id") {
  const value = Number(formData.get(key));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function isUniqueViolation(error) {
  return error?.code === "23505" || error?.cause?.code === "23505";
}

// ── Autenticação ────────────────────────────────────────────────────────────

export async function signInAction(_prev, formData) {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const { error } = await auth.signIn.email({ email, password });
  if (error) return { error: "E-mail ou senha incorretos.", email };

  // O cookie de sessão recém-criado só aparece na PRÓXIMA requisição (o SDK lê
  // os cookies do request). Por isso o papel admin é checado no /admin, não aqui.
  redirect("/admin");
}

export async function signOutAction() {
  await auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}

// Primeiro acesso / esqueci a senha: código de 6 dígitos por e-mail.
// Resposta sempre igual, exista a conta ou não (não revela quem é admin).
export async function sendResetCodeAction(_prev, formData) {
  const email = text(formData, "email").toLowerCase();
  if (!email) return { error: "Informe o e-mail." };
  await auth.emailOtp.sendVerificationOtp({ email, type: "forget-password" });
  return { sent: true, email };
}

export async function resetPasswordAction(_prev, formData) {
  const email = text(formData, "email").toLowerCase();
  const otp = text(formData, "otp");
  const password = String(formData.get("password") ?? "");
  if (!email || !otp) return { sent: true, email, error: "Informe o código recebido." };
  if (password.length < 10) return { sent: true, email, error: "A senha precisa de pelo menos 10 caracteres." };

  const { error } = await auth.emailOtp.resetPassword({ email, otp, password });
  if (error) return { sent: true, email, error: "Código inválido ou expirado. Peça um novo." };
  redirect(`${ADMIN_LOGIN_PATH}?senha=ok`);
}

// ── Produtos ────────────────────────────────────────────────────────────────

export async function saveProductAction(_prev, formData) {
  await requireAdmin();
  const id = idFrom(formData);

  const values = {
    slug: text(formData, "slug").toLowerCase(),
    category: text(formData, "category"),
    status: text(formData, "status") || "draft",
    isUnique: formData.get("isUnique") === "on",
    madeToOrder: formData.get("madeToOrder") === "on",
    weightG: optionalInt(formData, "weightG"),
    lengthCm: optionalInt(formData, "lengthCm"),
    widthCm: optionalInt(formData, "widthCm"),
    heightCm: optionalInt(formData, "heightCm"),
    sortOrder: optionalInt(formData, "sortOrder") ?? 0,
  };
  const translation = (locale, prefix) => ({
    locale,
    name: text(formData, `${prefix}_name`),
    description: optionalText(formData, `${prefix}_description`),
    details: optionalText(formData, `${prefix}_details`),
    care: optionalText(formData, `${prefix}_care`),
  });
  const pt = translation("pt-BR", "pt");
  const en = translation("en", "en");
  if (!en.name) en.name = pt.name;

  if (!SLUG_RE.test(values.slug)) return { error: "Slug inválido: use letras minúsculas, números e hífens." };
  if (!CATEGORIES.includes(values.category)) return { error: "Escolha uma categoria." };
  if (!STATUSES.includes(values.status)) return { error: "Status inválido." };
  if (!pt.name) return { error: "O nome em português é obrigatório." };
  for (const key of ["weightG", "lengthCm", "widthCm", "heightCm", "sortOrder"]) {
    if (Number.isNaN(values[key])) return { error: "Peso, medidas e ordem devem ser números inteiros." };
  }

  let createdId = null;
  try {
    if (id) {
      const upsert = (t) =>
        db
          .insert(productTranslations)
          .values({ productId: id, ...t })
          .onConflictDoUpdate({
            target: [productTranslations.productId, productTranslations.locale],
            set: { name: t.name, description: t.description, details: t.details, care: t.care },
          });
      await db.batch([db.update(products).set(values).where(eq(products.id, id)), upsert(pt), upsert(en)]);
    } else {
      const [created] = await db.insert(products).values(values).returning({ id: products.id });
      await db.batch([
        db.insert(productTranslations).values([
          { productId: created.id, ...pt },
          { productId: created.id, ...en },
        ]),
        db.insert(productVariants).values({ productId: created.id, sku: `MK-${values.slug.toUpperCase()}` }),
      ]);
      createdId = created.id;
    }
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "Já existe uma peça com esse slug." };
    throw error;
  }

  revalidateCatalog();
  if (createdId) redirect(`/admin/produtos/${createdId}?salvo=1`);
  return { ok: "Peça salva." };
}

// ── Variações (preço e estoque) ─────────────────────────────────────────────

export async function saveVariantAction(_prev, formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const productId = idFrom(formData, "productId");
  if (!productId) return { error: "Peça inválida." };

  const priceCents = parseBRLToCents(formData.get("price"));
  const stock = optionalInt(formData, "stock");
  const values = {
    sku: text(formData, "sku").toUpperCase(),
    labelPt: optionalText(formData, "labelPt"),
    labelEn: optionalText(formData, "labelEn"),
    priceCents,
    stock,
    position: optionalInt(formData, "position") ?? 0,
  };

  if (!values.sku) return { error: "Informe o SKU." };
  if (Number.isNaN(priceCents)) return { error: "Preço inválido. Use, por exemplo, 89,90." };
  if (Number.isNaN(stock) || Number.isNaN(values.position)) return { error: "Estoque e ordem devem ser inteiros." };

  try {
    if (id) {
      await db
        .update(productVariants)
        .set(values)
        .where(and(eq(productVariants.id, id), eq(productVariants.productId, productId)));
    } else {
      await db.insert(productVariants).values({ productId, ...values });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "Esse SKU já está em uso." };
    throw error;
  }

  revalidateCatalog();
  return { ok: id ? "Variação salva." : "Variação adicionada." };
}

export async function deleteVariantAction(formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const productId = idFrom(formData, "productId");
  if (!id || !productId) return;

  // Toda peça precisa de ao menos uma variação.
  const [{ total }] = await db
    .select({ total: count() })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  if (total <= 1) return;

  await db
    .delete(productVariants)
    .where(and(eq(productVariants.id, id), eq(productVariants.productId, productId)));
  revalidateCatalog();
}

// ── Imagens ─────────────────────────────────────────────────────────────────

function imageValues(formData) {
  return {
    url: text(formData, "url"),
    altPt: optionalText(formData, "altPt"),
    altEn: optionalText(formData, "altEn"),
    objectPosition: optionalText(formData, "objectPosition"),
    position: optionalInt(formData, "position") ?? 0,
  };
}

function validateImage(values) {
  // Só arquivos do próprio site por enquanto (next/image recusa domínios não
  // configurados). Upload para o Object Storage entra depois.
  if (!/^\/[\w./-]+\.(webp|png|jpe?g|avif|svg)$/i.test(values.url)) {
    return "Use um arquivo do site, por exemplo /product-brinco-aura.png.";
  }
  if (Number.isNaN(values.position)) return "A ordem deve ser um número inteiro.";
  return null;
}

export async function saveImageAction(_prev, formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const productId = idFrom(formData, "productId");
  if (!productId) return { error: "Peça inválida." };

  const values = imageValues(formData);
  const invalid = validateImage(values);
  if (invalid) return { error: invalid };

  if (id) {
    await db
      .update(productImages)
      .set(values)
      .where(and(eq(productImages.id, id), eq(productImages.productId, productId)));
  } else {
    await db.insert(productImages).values({ productId, ...values });
  }

  revalidateCatalog();
  return { ok: id ? "Imagem salva." : "Imagem adicionada." };
}

export async function deleteImageAction(formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const productId = idFrom(formData, "productId");
  if (!id || !productId) return;

  await db.delete(productImages).where(and(eq(productImages.id, id), eq(productImages.productId, productId)));
  revalidateCatalog();
}
