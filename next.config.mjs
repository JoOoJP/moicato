/** @type {import('next').NextConfig} */

// Cabeçalhos de segurança aplicados a TODAS as respostas. Endurecem o site
// contra clickjacking, MIME-sniffing, vazamento de referrer e uso indevido de
// APIs do navegador. (Bloquear scanners/flood em si é papel do CDN/WAF do host.)
const securityHeaders = [
  // Força HTTPS por 1 ano (só tem efeito sobre HTTPS; ignorado em http/localhost).
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Impede o navegador de "adivinhar" o tipo do arquivo (anti MIME-sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Impede que o site seja embutido em <iframe> de terceiros (anti-clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Não vaza a URL completa como referrer para outros sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs do navegador que o site não usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

// Fotos enviadas pelo painel ficam no Neon Object Storage (bucket público).
const storageHost = process.env.AWS_ENDPOINT_URL_S3 ? new URL(process.env.AWS_ENDPOINT_URL_S3).hostname : null;

const nextConfig = {
  images: {
    remotePatterns: storageHost ? [{ protocol: "https", hostname: storageHost, pathname: "/products/**" }] : [],
  },
  experimental: {
    // Upload de fotos (já reduzidas no navegador para ~2000 px WebP).
    serverActions: { bodySizeLimit: "4mb" },
  },
  turbopack: {
    // Ensure turbopack uses this folder as the workspace root
    root: import.meta.dirname,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
