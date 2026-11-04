# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## O que é

Site institucional/marketing da marca **Moikato** — biojoias de capim dourado do Cerrado. Em transição de site de apresentação para **e-commerce no Brasil** (plano em `docs/research/ecommerce-plano.md`). Produtos já vivem no **Neon Postgres**, com painel `/admin` (Neon Auth); ainda sem checkout. Conteúdo em pt-BR. Domínio de produção: **moikato.com** (a pasta chama "moicato", mas marca/domínio são "moikato").

**Stack:** Next.js 16 (App Router) · **JavaScript puro** (sem TypeScript — `jsconfig.json`) · React 19 · Tailwind 4 · Neon + Drizzle ORM · Vercel Analytics + Speed Insights.

## Comandos

`npm run dev` · `npm run build` · `npm run start` · `npm run lint`.

Banco (precisa de `DATABASE_URL` em `.env.local`, ver `.env.example`): `npm run db:generate` (gera migration a partir do schema) · `npm run db:migrate` · `npm run db:seed` (sincroniza o catálogo dos dicionários) · `npm run db:studio`.

## Estrutura e convenções

- **Bilíngue** via rota dinâmica `src/app/[lang]/` (`pt-BR` e `en`). Textos ficam em `src/dictionaries/{pt-BR,en}.js`, carregados por `src/app/[lang]/dictionaries.js` (`getDictionary`, `hasLocale`). **Ao adicionar/editar copy, atualize os DOIS dicionários** para manter os idiomas em sincronia.
- **Produtos** vêm do Neon: schema em `src/lib/db/schema.js`, conexão em `src/lib/db/index.js` (server-only), leitura em `src/lib/products.js` (`getCatalogPieces(lang)`, `getPieceBySlug`, `getRelatedPieces`, `getActiveSlugs`). Valores em centavos inteiros. Alterou o schema → `db:generate` e versione a pasta `drizzle/`. Enquanto não houver admin, `dict.collection.pieces` + `CATALOG_ITEMS` são a fonte do seed (casados por índice).
- **Painel `/admin`** (fora do `[lang]`, só pt-BR, `noindex`, `force-dynamic`): login por Neon Auth (Managed Better Auth) em `src/lib/auth/`. **Cadastro público desligado** no Neon — contas criadas por `neon neon-auth user create` + `neon neon-auth user set-role <id> --roles admin`; a senha é definida em `/admin/recuperar` (código por e-mail). `src/proxy.js` passa `/admin` pelo `auth.middleware`, mas a autorização que vale é `requireAdmin()` — chame em **toda** página e Server Action do painel (`src/app/admin/actions.js`). Mutações chamam `revalidatePath("/[lang]", "layout")`, então a loja atualiza sem rebuild. Precisa de `NEON_AUTH_BASE_URL` e `NEON_AUTH_COOKIE_SECRET`.
- **Componentes de apresentação** em `src/components/`: `Hero`, `Story`, `Catalog`, `Values`, `About`, `Header`, `Footer`, `LivingBackground`, `GoldenThread`, `Reveal` (animações on-scroll), `LanguageSwitcher`, `Logo`.
- **SEO** é levado a sério: `src/app/sitemap.js`, `src/app/robots.js`, JSON-LD (catálogo como `ItemList`/`Product`), Open Graph. Config central de site em `src/lib/site.js` (`SITE_URL`, locales OG, imagem OG). Base URL sobrescrevível por `NEXT_PUBLIC_SITE_URL`. Contato em `src/lib/contato.js`.
- **Cabeçalhos de segurança** aplicados a todas as respostas em `next.config.mjs` (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy). Turbopack com `root` fixado na pasta.
- **Manter JS** (não introduzir TypeScript).
