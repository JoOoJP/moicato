# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## O que é

Site institucional/marketing da marca **Moikato** — biojoias de capim dourado do Cerrado. Em transição de site de apresentação para **e-commerce no Brasil** (plano em `docs/research/ecommerce-plano.md`). E-commerce no **Neon Postgres**: loja com sacola e checkout (Asaas + Melhor Envio, ligados só quando as chaves existem e "Vendas abertas" está marcado no painel) e painel `/admin` (Neon Auth). Conteúdo em pt-BR. Domínio de produção: **moikato.com** (a pasta chama "moicato", mas marca/domínio são "moikato").

**Stack:** Next.js 16 (App Router) · **JavaScript puro** (sem TypeScript — `jsconfig.json`) · React 19 · Tailwind 4 · Neon + Drizzle ORM · Vercel Analytics + Speed Insights.

## Comandos

`npm run dev` · `npm run build` · `npm run start` · `npm run lint`.

Banco (precisa de `DATABASE_URL` em `.env.local`, ver `.env.example`): `npm run db:generate` (gera migration a partir do schema) · `npm run db:migrate` · `npm run db:seed` (sincroniza o catálogo dos dicionários) · `npm run db:studio`.

## Estrutura e convenções

- **Bilíngue** via rota dinâmica `src/app/[lang]/` (`pt-BR` e `en`). Textos ficam em `src/dictionaries/{pt-BR,en}.js`, carregados por `src/app/[lang]/dictionaries.js` (`getDictionary`, `hasLocale`). **Ao adicionar/editar copy, atualize os DOIS dicionários** para manter os idiomas em sincronia.
- **Produtos** vêm do Neon: schema em `src/lib/db/schema.js`, conexão em `src/lib/db/index.js` (server-only), leitura em `src/lib/products.js` (`getCatalogPieces(lang)`, `getPieceBySlug`, `getRelatedPieces`, `getActiveSlugs`). Valores em centavos inteiros. Alterou o schema → `db:generate` e versione a pasta `drizzle/`. Enquanto não houver admin, `dict.collection.pieces` + `CATALOG_ITEMS` são a fonte do seed (casados por índice).
- **Painel `/admin`** (fora do `[lang]`, só pt-BR, `noindex`, `force-dynamic`): login por Neon Auth (Managed Better Auth) em `src/lib/auth/`. **Cadastro público desligado** no Neon — contas criadas por `neon neon-auth user create` + `neon neon-auth user set-role <id> --roles admin`; a senha é definida em `/admin/recuperar` (código por e-mail). `src/proxy.js` passa `/admin` pelo `auth.middleware`, mas a autorização que vale é `requireAdmin()` — chame em **toda** página e Server Action do painel (`src/app/admin/actions.js`). Mutações chamam `revalidatePath("/[lang]", "layout")`, então a loja atualiza sem rebuild. Precisa de `NEON_AUTH_BASE_URL` e `NEON_AUTH_COOKIE_SECRET`.
- **Loja**: sacola no navegador (`src/components/shop/CartProvider.js`, localStorage — só IDs/retrato p/ exibir). Checkout em `src/app/[lang]/checkout/` (Server Action revalida preço/estoque/frete no servidor, reserva estoque em `stock_reservations`, cria pedido `pending` e o checkout do Asaas). Webhook em `src/app/api/asaas/webhook` baixa estoque no `CHECKOUT_PAID`. Frete: `src/lib/melhorenvio.js` + `/api/frete`. Regras de vitrine (parcelas, Pix) em `src/lib/pricing.js`; configurações da loja em `store_settings` (`src/lib/settings.js`). `salesLive = salesOpen && ASAAS_API_KEY && MELHORENVIO_TOKEN/SHIP_FROM_CEP`.
- **Catálogo-galeria**: peças têm `kind` (tipo, enum `product_kind`, rótulos em `src/lib/kinds.js`) e `collection_id` (tabela `collections`, editável em `/admin/colecoes`). `src/components/shop/CatalogBrowser.js` mostra capítulos por coleção em "Todas" e grade filtrada por tipo via `?tipo=`. Adicionar à sacola NÃO abre a gaveta (confirmação discreta + barra fixa no celular). Embalagem para presente: `store_settings.gift_wrap_enabled` → sacola/checkout → `orders.gift_wrap`.
- **Dados legais da empresa** (razão social, CNPJ, endereço, e-mail de atendimento) ficam em `src/lib/empresa.js` — usados no rodapé, nas políticas (`src/content/politicas.js`, rota `/[lang]/politicas/[slug]`) e nos e-mails. Campo vazio não aparece.
- **E-mails** (Resend, `src/lib/email.js` + modelos em `src/lib/email-templates.js`): "pedido confirmado" + aviso para a loja no `CHECKOUT_PAID` (webhook, via `after()`), "pedido enviado" ao marcar enviado no painel. Sem `RESEND_API_KEY` só loga; falha de e-mail nunca afeta o pedido.
- **Embalagens** (`packages`): medidas cadastradas uma vez; a peça guarda só `weight_g` + `package_id`. Colunas `length_cm/width_cm/height_cm` de `products` estão obsoletas (remover em migration futura, depois de nenhum deploy lê-las).
- **Fotos** enviadas pelo painel vão para o Neon Object Storage (bucket público `products`, `src/lib/storage.js`), reduzidas no navegador para WebP ≤ 2000 px. `next.config.mjs` libera o host do bucket no `next/image`.
- **Migrations em produção**: o banco local É o de produção. Só migrations aditivas enquanto houver deploy lendo o schema antigo, e só com aprovação do usuário.
- **Componentes de apresentação** em `src/components/`: `Hero`, `Story`, `Values`, `About`, `Header`, `Footer`, `LivingBackground`, `GoldenThread`, `Reveal` (animações on-scroll), `LanguageSwitcher`, `Logo`.
- **SEO** é levado a sério: `src/app/sitemap.js`, `src/app/robots.js`, JSON-LD (catálogo como `ItemList`/`Product`), Open Graph. Config central de site em `src/lib/site.js` (`SITE_URL`, locales OG, imagem OG). Base URL sobrescrevível por `NEXT_PUBLIC_SITE_URL`. Contato em `src/lib/contato.js`.
- **Cabeçalhos de segurança** aplicados a todas as respostas em `next.config.mjs` (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy). Turbopack com `root` fixado na pasta.
- **Manter JS** (não introduzir TypeScript).
