"use server";

// Server Actions do painel. Toda ação que lê ou grava dado começa com
// requireAdmin() — não confie só no proxy/redirect das páginas.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { db } from "../../lib/db";
import {
  collections,
  orders,
  packages,
  productImages,
  productTranslations,
  products,
  productVariants,
  storeSettings,
} from "../../lib/db/schema";
import { auth } from "../../lib/auth/server";
import { ADMIN_LOGIN_PATH, requireAdmin } from "../../lib/auth/admin";
import { parseBRLToCents } from "../../lib/money";
import { isStorageUrl, uploadProductImage } from "../../lib/storage";
import { KIND_IDS } from "../../lib/kinds";

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

// ── Peça (um único "Salvar" para tudo) ──────────────────────────────────────

const LOCAL_IMAGE_RE = /^\/[\w./-]+\.(webp|png|jpe?g|avif|svg)$/i;

function cleanText(value, max = 5000) {
  const str = String(value ?? "").trim().slice(0, max);
  return str || null;
}

function intOrNull(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : NaN;
}

// payload (JSON, montado pelo editor):
// { id?, slug, category, status, isUnique, madeToOrder, weightG, packageId,
//   pt: {name, description, details, care}, en: {...},
//   variants: [{ id?, sku, labelPt, labelEn, price, stock }],
//   images: [{ id?, url, altPt, altEn, objectPosition }] }
export async function saveProductAction(_prev, formData) {
  await requireAdmin();
  let input;
  try {
    input = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { error: "Não foi possível ler o formulário. Recarregue a página." };
  }

  const id = Number.isInteger(input.id) && input.id > 0 ? input.id : null;
  const values = {
    slug: String(input.slug ?? "").trim().toLowerCase(),
    category: input.category,
    status: input.status ?? "draft",
    isUnique: Boolean(input.isUnique),
    madeToOrder: Boolean(input.madeToOrder),
    weightG: intOrNull(input.weightG),
    packageId: Number.isInteger(Number(input.packageId)) && Number(input.packageId) > 0 ? Number(input.packageId) : null,
    kind: KIND_IDS.includes(input.kind) ? input.kind : null,
    collectionId: Number.isInteger(Number(input.collectionId)) && Number(input.collectionId) > 0 ? Number(input.collectionId) : null,
  };
  const translation = (locale, t = {}) => ({
    locale,
    name: cleanText(t.name, 120),
    description: cleanText(t.description),
    details: cleanText(t.details),
    care: cleanText(t.care),
  });
  const pt = translation("pt-BR", input.pt);
  const en = translation("en", input.en);
  if (!en.name) en.name = pt.name;

  if (!pt.name) return { error: "Dê um nome para a peça." };
  if (!SLUG_RE.test(values.slug)) return { error: "Endereço (slug) inválido: use letras minúsculas, números e hífens." };
  if (!CATEGORIES.includes(values.category)) return { error: "Escolha uma categoria." };
  if (!values.kind) return { error: "Escolha o tipo da peça (brinco, colar…)." };
  if (!STATUSES.includes(values.status)) return { error: "Status inválido." };
  if (Number.isNaN(values.weightG)) return { error: "O peso deve ser um número inteiro em gramas." };

  const variants = [];
  for (const [index, v] of (input.variants ?? []).entries()) {
    const priceCents = parseBRLToCents(v.price);
    const stock = intOrNull(v.stock);
    const sku = String(v.sku ?? "").trim().toUpperCase() || `MK-${values.slug.toUpperCase()}-${index + 1}`;
    if (Number.isNaN(priceCents)) return { error: `Preço inválido na opção ${index + 1}. Use, por exemplo, 89,90.` };
    if (Number.isNaN(stock)) return { error: `Estoque inválido na opção ${index + 1}.` };
    variants.push({
      id: Number.isInteger(v.id) && v.id > 0 ? v.id : null,
      sku,
      labelPt: cleanText(v.labelPt, 60),
      labelEn: cleanText(v.labelEn, 60),
      priceCents,
      stock,
      position: index,
    });
  }
  if (variants.length === 0) return { error: "A peça precisa de pelo menos um preço." };
  if (new Set(variants.map((v) => v.sku)).size !== variants.length) return { error: "Há SKUs repetidos nas opções." };
  if (variants.length > 1 && variants.some((v) => !v.labelPt)) return { error: "Dê um nome para cada opção (ex.: Unidade, Kit com 3)." };

  const images = [];
  for (const [index, img] of (input.images ?? []).entries()) {
    const url = String(img.url ?? "").trim();
    if (!LOCAL_IMAGE_RE.test(url) && !isStorageUrl(url)) return { error: "Uma das fotos tem endereço inválido." };
    images.push({
      id: Number.isInteger(img.id) && img.id > 0 ? img.id : null,
      url,
      altPt: cleanText(img.altPt, 200),
      altEn: cleanText(img.altEn, 200),
      objectPosition: cleanText(img.objectPosition, 40),
      position: index,
    });
  }
  if (values.status === "active" && images.length === 0) return { error: "Adicione pelo menos uma foto antes de colocar a peça na loja." };

  let productId = id;
  try {
    if (!productId) {
      const [created] = await db.insert(products).values(values).returning({ id: products.id });
      productId = created.id;
    }

    const keepVariantIds = variants.filter((v) => v.id).map((v) => v.id);
    const keepImageIds = images.filter((img) => img.id).map((img) => img.id);
    const upsertT = (t) =>
      db
        .insert(productTranslations)
        .values({ productId, ...t })
        .onConflictDoUpdate({
          target: [productTranslations.productId, productTranslations.locale],
          set: { name: t.name, description: t.description, details: t.details, care: t.care },
        });

    await db.batch([
      db.update(products).set(values).where(eq(products.id, productId)),
      upsertT(pt),
      upsertT(en),
      // Remove o que saiu do formulário (só desta peça).
      db
        .delete(productVariants)
        .where(
          keepVariantIds.length
            ? and(eq(productVariants.productId, productId), notInArray(productVariants.id, keepVariantIds))
            : eq(productVariants.productId, productId)
        ),
      db
        .delete(productImages)
        .where(
          keepImageIds.length
            ? and(eq(productImages.productId, productId), notInArray(productImages.id, keepImageIds))
            : eq(productImages.productId, productId)
        ),
      ...variants.map(({ id: variantId, ...v }) =>
        variantId
          ? db.update(productVariants).set(v).where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)))
          : db.insert(productVariants).values({ productId, ...v })
      ),
      ...images.map(({ id: imageId, ...img }) =>
        imageId
          ? db.update(productImages).set(img).where(and(eq(productImages.id, imageId), eq(productImages.productId, productId)))
          : db.insert(productImages).values({ productId, ...img })
      ),
    ]);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: String(error?.cause?.detail ?? error?.detail ?? "").includes("sku") ? "Esse SKU já é usado por outra peça." : "Já existe uma peça com esse endereço (slug)." };
    }
    throw error;
  }

  revalidateCatalog();
  if (!id) redirect(`/admin/produtos/${productId}?salvo=1`);
  return { ok: "Alterações salvas. A loja já foi atualizada.", savedAt: Date.now() };
}

// Edição rápida na lista: preço e estoque de uma variação.
export async function quickUpdateVariantAction(_prev, formData) {
  await requireAdmin();
  const variantId = idFrom(formData, "variantId");
  const priceCents = parseBRLToCents(formData.get("price"));
  const stock = optionalInt(formData, "stock");
  if (!variantId) return { error: "Inválido" };
  if (Number.isNaN(priceCents)) return { error: "Preço inválido" };
  if (Number.isNaN(stock)) return { error: "Estoque inválido" };

  await db.update(productVariants).set({ priceCents, stock }).where(eq(productVariants.id, variantId));
  revalidateCatalog();
  return { ok: "Salvo", savedAt: Date.now() };
}

export async function setProductStatusAction(formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const status = text(formData, "status");
  if (!id || !STATUSES.includes(status)) return;
  await db.update(products).set({ status }).where(eq(products.id, id));
  revalidateCatalog();
}

// Upload de foto (já reduzida no navegador). Retorna a URL pública.
export async function uploadImageAction(formData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!file || typeof file === "string") return { error: "Nenhum arquivo recebido." };
  try {
    return { url: await uploadProductImage(file) };
  } catch (error) {
    return { error: error.message === "Arquivo muito grande" ? "Foto muito grande (máx. 4 MB)." : "Não foi possível enviar a foto." };
  }
}

// ── Coleções ────────────────────────────────────────────────────────────────

export async function saveCollectionAction(_prev, formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const values = {
    slug: text(formData, "slug").toLowerCase(),
    namePt: text(formData, "namePt"),
    nameEn: optionalText(formData, "nameEn"),
    taglinePt: optionalText(formData, "taglinePt"),
    taglineEn: optionalText(formData, "taglineEn"),
    imageUrl: optionalText(formData, "imageUrl"),
    sortOrder: optionalInt(formData, "sortOrder") ?? 0,
  };
  if (!values.namePt) return { error: "Dê um nome para a coleção." };
  if (!values.slug) values.slug = values.namePt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!SLUG_RE.test(values.slug)) return { error: "Endereço inválido: use letras minúsculas, números e hífens." };
  if (Number.isNaN(values.sortOrder)) return { error: "A ordem deve ser um número inteiro." };
  if (values.imageUrl && !LOCAL_IMAGE_RE.test(values.imageUrl) && !isStorageUrl(values.imageUrl)) return { error: "Foto de capa inválida." };

  try {
    if (id) await db.update(collections).set(values).where(eq(collections.id, id));
    else await db.insert(collections).values(values);
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "Já existe uma coleção com esse endereço." };
    throw error;
  }
  revalidateCatalog();
  return { ok: id ? "Coleção salva." : "Coleção criada.", savedAt: Date.now() };
}

export async function deleteCollectionAction(formData) {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id) return;
  await db.delete(collections).where(eq(collections.id, id)); // peças ficam sem coleção
  revalidateCatalog();
}

// ── Embalagens ──────────────────────────────────────────────────────────────

export async function savePackageAction(_prev, formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const values = {
    name: text(formData, "name"),
    lengthCm: optionalInt(formData, "lengthCm"),
    widthCm: optionalInt(formData, "widthCm"),
    heightCm: optionalInt(formData, "heightCm"),
    weightG: optionalInt(formData, "weightG") ?? 0,
  };
  if (!values.name) return { error: "Dê um nome para a embalagem." };
  for (const key of ["lengthCm", "widthCm", "heightCm"]) {
    if (!values[key]) return { error: "Informe comprimento, largura e altura em centímetros." };
  }
  if (Number.isNaN(values.weightG)) return { error: "Peso inválido." };

  if (id) await db.update(packages).set(values).where(eq(packages.id, id));
  else await db.insert(packages).values(values);
  revalidatePath("/admin", "layout");
  return { ok: id ? "Embalagem salva." : "Embalagem criada.", savedAt: Date.now() };
}

export async function deletePackageAction(formData) {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id) return;
  await db.delete(packages).where(eq(packages.id, id)); // peças ficam sem embalagem (set null)
  revalidatePath("/admin", "layout");
}

// ── Configurações ───────────────────────────────────────────────────────────

export async function saveSettingsAction(_prev, formData) {
  await requireAdmin();
  const values = {
    salesOpen: formData.get("salesOpen") === "on",
    pixDiscountPercent: optionalInt(formData, "pixDiscountPercent") ?? 0,
    maxInstallments: optionalInt(formData, "maxInstallments") ?? 1,
    minInstallmentCents: parseBRLToCents(formData.get("minInstallment")) ?? 0,
    freeShippingCents: parseBRLToCents(formData.get("freeShipping")),
    giftWrapEnabled: formData.get("giftWrapEnabled") === "on",
  };
  if (Object.values(values).some((value) => typeof value === "number" && Number.isNaN(value))) return { error: "Revise os valores: use números (ex.: 50,00)." };
  if (values.pixDiscountPercent > 30) return { error: "Desconto no Pix acima de 30% parece engano." };
  if (values.maxInstallments < 1 || values.maxInstallments > 12) return { error: "Parcelas: de 1 a 12." };

  await db
    .insert(storeSettings)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: storeSettings.id, set: values });
  revalidateCatalog();
  return { ok: "Configurações salvas.", savedAt: Date.now() };
}

// ── Pedidos ─────────────────────────────────────────────────────────────────

export async function markShippedAction(_prev, formData) {
  await requireAdmin();
  const id = idFrom(formData);
  const trackingCode = text(formData, "trackingCode").toUpperCase();
  if (!id) return { error: "Pedido inválido." };
  if (!trackingCode) return { error: "Informe o código de rastreio." };

  await db
    .update(orders)
    .set({ status: "shipped", trackingCode, shippedAt: new Date() })
    .where(and(eq(orders.id, id), inArray(orders.status, ["paid", "shipped"])));
  revalidatePath("/admin", "layout");
  return { ok: "Pedido marcado como enviado.", savedAt: Date.now() };
}
