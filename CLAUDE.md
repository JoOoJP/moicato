# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## O que é

Site institucional/marketing da marca **Moikato** — biojoias de capim dourado do Cerrado. Site estático de apresentação: **sem banco de dados e sem autenticação**. Conteúdo em pt-BR. Domínio de produção: **moikato.com** (a pasta chama "moicato", mas marca/domínio são "moikato").

**Stack:** Next.js 16 (App Router) · **JavaScript puro** (sem TypeScript — `jsconfig.json`) · React 19 · Tailwind 4 · Vercel Analytics + Speed Insights.

## Comandos

`npm run dev` · `npm run build` · `npm run start` · `npm run lint`. (Sem comandos de banco.)

## Estrutura e convenções

- **Bilíngue** via rota dinâmica `src/app/[lang]/` (`pt-BR` e `en`). Textos ficam em `src/dictionaries/{pt-BR,en}.js`, carregados por `src/app/[lang]/dictionaries.js` (`getDictionary`, `hasLocale`). **Ao adicionar/editar copy, atualize os DOIS dicionários** para manter os idiomas em sincronia.
- **Componentes de apresentação** em `src/components/`: `Hero`, `Story`, `Catalog`, `Values`, `About`, `Header`, `Footer`, `LivingBackground`, `GoldenThread`, `Reveal` (animações on-scroll), `LanguageSwitcher`, `Logo`.
- **SEO** é levado a sério: `src/app/sitemap.js`, `src/app/robots.js`, JSON-LD (catálogo como `ItemList`/`Product`), Open Graph. Config central de site em `src/lib/site.js` (`SITE_URL`, locales OG, imagem OG). Base URL sobrescrevível por `NEXT_PUBLIC_SITE_URL`. Contato em `src/lib/contato.js`.
- **Cabeçalhos de segurança** aplicados a todas as respostas em `next.config.mjs` (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy). Turbopack com `root` fixado na pasta.
- **Manter JS** (não introduzir TypeScript).
