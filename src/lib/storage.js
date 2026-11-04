// Fotos das peças no Neon Object Storage (bucket "products", leitura pública).
// Cada upload ganha uma chave nova (cache imutável); trocar foto = nova chave.
import "server-only";
import { randomUUID } from "node:crypto";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const BUCKET = "products";
const ALLOWED = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/avif": "avif" };
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const files = new Files({ adapter: neon({ bucket: BUCKET }) });

function endpoint() {
  const base = process.env.AWS_ENDPOINT_URL_S3;
  if (!base) throw new Error("Object Storage não configurado (AWS_ENDPOINT_URL_S3)");
  return base.replace(/\/$/, "");
}

export function isStorageUrl(url) {
  try {
    return url.startsWith(`${endpoint()}/${BUCKET}/`);
  } catch {
    return false;
  }
}

export async function uploadProductImage(file) {
  const ext = ALLOWED[file?.type];
  if (!ext) throw new Error("Formato não suportado");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Arquivo muito grande");

  const key = `pecas/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  await files.upload(key, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    cacheControl: "public, max-age=31536000, immutable",
  });
  return `${endpoint()}/${BUCKET}/${key}`;
}
