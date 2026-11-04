# Moikato — de landing page a e-commerce

Estudo realizado em 4 de novembro de 2026. Complementa
[`benchmark-100.md`](./benchmark-100.md) e
[`benchmark-luxo-nota-9.md`](./benchmark-luxo-nota-9.md), que já cobrem direção
de arte e narrativa. Aqui o foco é **comércio**: o que uma loja online precisa
ter, o que falta na Moikato e como o código vai mudar.

Decisões já tomadas:

- **Mercado: Brasil** (preço em R$, Pix, parcelamento, frete nacional).
- **Dados no Neon (Postgres).**
- **Pagamento: Asaas** (recomendado após comparação — ver §3).

---

## 1. Ponto de partida — o que o site tem hoje

| Área | Hoje | Observação |
| --- | --- | --- |
| Catálogo | 22 peças em 3 categorias (joias, moda, home) | Dados divididos entre `src/lib/catalog.js` (slug/categoria) e os dicionários (nome, preço, descrição), **casados por índice do array** — frágil. |
| Preço | String em **libra** (`"£33"`) no dicionário | Precisa virar tabela em **R$**, definida pelo negócio (não é só converter câmbio). Hoje cada mudança de preço exige deploy. |
| Variações | Texto livre em `priceNote` ("Terço · £80 \| Brincos · £32", "Kit com 3 · £75") | São variações de verdade, mas não estruturadas. |
| Estoque | Não existe. "Disponibilidade: confirmada no pedido" | Para peças artesanais, quase únicas, é o ponto mais crítico. |
| Compra | Botão "Pedir" → WhatsApp (número +44) | Conversão manual. Número precisa virar brasileiro. |
| Imagens | 1 foto por peça, em `public/` | Lojas de referência usam 4–6 por produto (isolada, no corpo, detalhe, escala). |
| SEO | JSON-LD `ItemList`/`Product`, sitemap, OG, bilíngue | Falta `Offer` com preço em BRL, disponibilidade real, frete e devolução. |
| Infra | Estático na Vercel, sem banco, sem auth | Vai ter banco (Neon), pagamento (Asaas), frete (Melhor Envio), admin com login. |

**Idioma:** o site pode continuar bilíngue (turista/público internacional lê em
inglês), mas loja, checkout, e-mails e políticas são pt-BR e preço sempre em R$.
Vale decidir se o `en` continua vendendo ou vira só vitrine.

---

## 2. O que os e-commerces têm

### Essencial (sem isso não é loja)

1. **Página de produto que vende** — galeria, preço em R$ com parcelamento
   ("ou 3x de R$ 40 sem juros"), preço no Pix (se houver desconto), seletor de
   variação, estado do estoque ("Peça única", "Últimas 2", "Esgotado", "Sob
   encomenda"), material, medidas, peso, cuidados.
2. **Calculadora de frete por CEP** já na página do produto e na sacola — no
   Brasil isso é esperado, e frete surpresa é a principal causa de abandono.
3. **Sacola** — gaveta lateral, contador no header, alterar quantidade.
4. **Checkout** — compra como convidado, **Pix** (QR + copia e cola), **cartão
   parcelado**, boleto opcional. CPF obrigatório (exigido pelo gateway, pela
   etiqueta de frete e pela nota).
5. **Confirmação** — página de obrigado + e-mail de pedido + e-mail com código
   de rastreio. WhatsApp de confirmação é um bônus forte no Brasil.
6. **Controle de estoque** — impede vender a mesma peça única duas vezes.
7. **Gestão** — o Samuel cadastra peças, muda preço/estoque, vê pedidos, gera
   etiqueta e marca como enviado **sem depender de deploy**.
8. **Nota fiscal** e **políticas** (trocas/devolução, privacidade, termos) — ver §5.

### Importante (aumenta conversão e confiança)

9. Desconto no Pix (ex.: 5%) — comum no Brasil e o Pix é a taxa mais barata.
10. Frete grátis acima de um valor.
11. Selos de confiança: pagamento seguro, envio rastreado, feito à mão, CNPJ visível.
12. Guia de cuidados com capim dourado e FAQ.
13. Embalagem para presente / mensagem no pedido.
14. Google Merchant Center + Instagram Shopping.
15. Funil no analytics: `view_item → add_to_cart → begin_checkout → purchase`.
16. "Avise-me quando voltar" para peças esgotadas.

### Pode esperar

- Conta de cliente, wishlist, avaliações, busca (22 peças), cupons complexos,
  multimoeda, venda internacional.

---

## 3. Pagamento — comparação

Valores aproximados de páginas públicas e comparativos de 2026; **confirmar na
negociação**, taxas mudam com volume.

| | **Asaas** | Mercado Pago | Pagar.me (Stone) | Stripe BR | Efí |
| --- | --- | --- | --- | --- | --- |
| Pix | **R$ 0,79–1,99 fixo** por transação | ~0,99% | sob consulta | ~1,19% (por convite) | ~1,19% |
| Cartão à vista | ~2,99% + R$ 0,49 | ~3,99% + R$ 0,39 | sob consulta | ~3,99% + R$ 0,39 | ~3,49% |
| Parcelamento | Sim (até 21x Visa/Master) | Sim | Sim | Limitado | Sim |
| Boleto | ~R$ 0,79–1,99 | ~R$ 3,49 | sob consulta | ~R$ 3,45 | ~R$ 3,45 |
| Checkout hospedado | Sim (Asaas Checkout via API) | Sim (Checkout Pro) | Sim | Sim | Parcial |
| API / webhooks / sandbox | Simples, boa | Boa, antifraude agressivo | Muito boa, foco marketplace | Excelente | Boa |
| Mensalidade | Não | Não | Não | Não | Não |

**Recomendação: Asaas.** Confirma a sua intuição, por três motivos:

1. **Pix com taxa fixa.** Em joia, o ticket fica entre R$ 100 e R$ 800. Num
   pedido de R$ 300, o Asaas cobra menos de R$ 2 no Pix; Mercado Pago cobra cerca de R$ 3, e
   a diferença cresce com o ticket. Pix é a forma de pagamento mais usada no
   e-commerce brasileiro.
2. **Asaas Checkout** — página de pagamento hospedada, criada via API, com Pix,
   cartão à vista/parcelado e redirecionamento ao fim. Não precisamos montar
   formulário de cartão (PCI fica com eles).
3. API REST simples, sandbox, webhooks, conta digital inclusa.

**Contra o Asaas:** a marca é menos conhecida do consumidor que o Mercado Pago,
e o Mercado Pago tem cartões salvos de milhões de pessoas, o que facilita a compra. Se a
conversão no cartão ficar baixa, dá para **adicionar Mercado Pago depois** sem
refazer nada, porque o modelo de pedido é independente do gateway.

---

## 4. Frete — Melhor Envio

- **API gratuita** de cotação e etiquetas, com Correios (PAC, SEDEX, Mini
  Envios — bom para joia leve), Jadlog e outras, com preço abaixo do balcão.
- Fluxo: cliente digita o CEP → nossa API cota no Melhor Envio com peso e
  dimensões da sacola → cliente escolhe → o valor do frete entra na cobrança do
  Asaas → após pagamento, o admin compra a etiqueta com um clique e o rastreio vai
  para o pedido e para o e-mail.
- Alternativa simples para o MVP: tabela fixa por região + frete grátis acima
  de X, e usar o Melhor Envio só para gerar a etiqueta. Começa mais rápido,
  mas cobra frete errado nas pontas.

---

## 5. Brasil — obrigações e operação

> Não é parecer jurídico nem contábil; é a lista para validar com o contador.

- **CNPJ.** É preciso CNPJ para conta PJ no Asaas, nota fiscal e credibilidade.
  Saber se é MEI, ME no Simples, etc.
- **Nota fiscal (NF-e de produto).** Venda de mercadoria com envio pede NF-e.
  Para MEI, em 2026 a emissão para pessoa física ainda depende de o cliente pedir,
  mas **a partir de 2027 passa a ser obrigatória em toda venda**. Melhor já
  nascer emitindo. O Asaas emite NFS-e (serviço), não NF-e de produto (confirmar). Opções
  com API: Bling, Focus NFe, Nuvem Fiscal, eNotas. Pode ser manual no início.
- **Decreto 7.962/2013 (e-commerce)** — CNPJ, endereço e contato visíveis no
  site; informação clara de preço, frete, prazo e condições.
- **CDC art. 49 — arrependimento em 7 dias** após o recebimento, com
  devolução integral, inclusive do frete. Precisa estar na política de trocas.
- **Preço parcelado** — mostrar valor total e se há juros.
- **LGPD** — aviso de privacidade (guardamos nome, CPF, endereço), base legal,
  canal para o titular. Banner de cookies só se houver rastreamento não
  essencial (Vercel Analytics não usa cookies).
- **Reforma tributária** — campos de IBS/CBS já aparecem na NF-e em 2026;
  o emissor de nota resolve isso, mas o contador precisa saber.

---

## 6. Arquitetura proposta

```
Next.js 16 (Vercel)
 ├── Vitrine  /[lang]/…             lê produtos do Neon (cacheado)
 ├── Sacola   (client, localStorage)    só guarda {variantId, qty}
 ├── /api/frete                     CEP + itens → cotação Melhor Envio
 ├── /[lang]/checkout               dados do cliente (nome, e-mail, CPF, endereço) + escolha do frete
 ├── Server Action "pagar"          relê preço/estoque no Neon → reserva estoque
 │                                   → cria pedido "pending" → cria Asaas Checkout → redireciona
 ├── /api/asaas/webhook             PAYMENT_CONFIRMED/RECEIVED → pedido "paid", baixa estoque, e-mail
 └── /admin                         Neon Auth (lista de e-mails) → produtos, estoque, pedidos, etiqueta
        │
     Neon Postgres · Asaas · Melhor Envio · Resend (e-mails) · Neon Object Storage (fotos)
```

### Regras de ouro

- **Preço nunca vem do navegador.** A sacola guarda só IDs; o servidor relê
  preço, estoque e recota o frete antes de cobrar.
- **Reserva de estoque** ao criar a cobrança, com validade (Pix: ~30 min;
  boleto exige mais tempo, por isso talvez não oferecer boleto para peça única).
  Cobrança vencida → libera a reserva.
- **Webhook idempotente** (ID do evento/cobrança único) e **autenticado** pelo
  token de webhook do Asaas.
- **Valores em centavos inteiros**, nunca float.
- CPF e endereço são dados pessoais: só no servidor, nunca em URL, acesso
  restrito ao admin.

---

## 7. Modelo de dados (Neon)

```sql
products             id, slug UNIQUE, category, status (draft|active|archived),
                     is_unique, made_to_order, weight_g, length_cm, width_cm,
                     height_cm, sort_order, created_at, updated_at
product_translations product_id, locale ('pt-BR'|'en'), name, description,
                     details, care, PRIMARY KEY (product_id, locale)
product_variants     id, product_id, sku UNIQUE, price_cents, stock,
                     label_pt, label_en, position          -- toda peça tem ≥ 1
product_images       id, product_id, url, alt_pt, alt_en, position
stock_reservations   id, variant_id, qty, order_id, expires_at
orders               id, number (sequencial legível), status (pending|paid|
                     shipped|delivered|cancelled|refunded|expired),
                     customer_name, email, phone, cpf, address jsonb (CEP, rua,
                     número, complemento, bairro, cidade, UF),
                     subtotal_cents, shipping_cents, discount_cents, total_cents,
                     payment_method, installments, asaas_payment_id UNIQUE,
                     asaas_checkout_id, shipping_service, melhorenvio_order_id,
                     tracking_code, nfe_key, gift_message, locale,
                     created_at, paid_at, shipped_at
order_items          order_id, variant_id, name_snapshot, label_snapshot,
                     unit_price_cents, qty
webhook_events       id (do provedor) PRIMARY KEY, provider, payload jsonb, processed_at
```

- Variações de hoje: "Terço / Brincos", "Unidade / Kit com 3", "cada".
- Textos institucionais continuam nos dicionários; só dado de produto vai ao banco.
- **Drizzle ORM** (funciona em JS puro) + `@neondatabase/serverless`; branch do
  Neon para desenvolvimento/preview; seed migra as 22 peças atuais.

---

## 8. O que muda no código

| Arquivo / área | Mudança |
| --- | --- |
| `src/lib/catalog.js` | Vira `src/lib/db/` (schema Drizzle) + `src/lib/products.js` com `'use cache'` + `cacheTag('products')`. |
| `src/lib/` novos | `asaas.js`, `melhorenvio.js`, `money.js` (formatação BRL e parcelas), `cpf.js` (validação). |
| `src/dictionaries/*.js` | Sai `collection.pieces`. Entram sacola, frete, checkout, estoque, políticas — **nos dois idiomas**. |
| `ProductCard`, `CatalogGrid`, `Collection` | Preço em R$ + parcelas, selo de estoque. |
| `ProductDetail` | Galeria, variações, calculadora de CEP, **"Adicionar à sacola"**; WhatsApp vira secundário. |
| `Header` | Ícone da sacola com contador. |
| Novos componentes | `CartProvider`, `CartDrawer`, `AddToCart`, `VariantPicker`, `StockBadge`, `Gallery`, `ShippingCalculator`, `CheckoutForm`. |
| Novas rotas | `/[lang]/sacola`, `/[lang]/checkout`, `/[lang]/pedido/[id]` (status/obrigado), `/[lang]/politicas/{trocas,privacidade,termos,envio}`, `/[lang]/cuidados`, `/[lang]/faq`. |
| API | `/api/frete`, `/api/asaas/webhook`. |
| `src/app/admin/…` | Fora do `[lang]`, `noindex`. Produtos, fotos, estoque, pedidos, gerar etiqueta, rastreio, nº da nota. |
| `src/proxy.js` | Excluir `/admin` do redirecionamento de idioma; proteger a rota. |
| `src/lib/contato.js` | WhatsApp brasileiro; dados de CNPJ/endereço no rodapé. |
| `next.config.mjs` | `cacheComponents: true`; domínio de imagens do Object Storage. |
| JSON-LD / `sitemap.js` | `Offer` com `priceCurrency: BRL` e disponibilidade real; produtos vindos do banco. |
| `CLAUDE.md` | Deixa de ser "sem banco e sem auth"; comandos de migração/seed. |

Variáveis novas: `DATABASE_URL`, `ASAAS_API_KEY`, `ASAAS_WEBHOOK_TOKEN`,
`ASAAS_ENV` (sandbox|production), `MELHORENVIO_TOKEN`, `SHIP_FROM_CEP`,
`RESEND_API_KEY`, credenciais do Neon Auth, `ADMIN_EMAILS`.

---

## 9. Fases

**Fase 0 — Negócio e conteúdo.** CNPJ, conta Asaas, conta Melhor Envio, tabela
de preços em R$, estoque, medidas/peso. Ver §10.

**Fase 1 — Dados no Neon (sem mudança visível).** Schema, seed, vitrine lendo
do banco. Site idêntico, ainda com WhatsApp.

**Fase 2 — Admin.** Neon Auth, CRUD de produtos/estoque/fotos.

**Fase 3 — Sacola, frete e pagamento (sandbox).** Sacola, cotação de CEP,
checkout, Asaas Checkout em sandbox, webhook, página do pedido, e-mails,
pedidos no admin. Teste ponta a ponta (Pix, cartão parcelado, expiração).

**Fase 4 — Pós-venda e confiança.** Etiqueta Melhor Envio pelo admin,
rastreio, nota fiscal (manual ou via API), políticas, cuidados, FAQ, galeria.

**Fase 5 — Lançamento.** Asaas em produção, desconto Pix, frete grátis, Merchant
Center, Instagram Shopping, funil no analytics, "avise-me".

---

## 10. O que precisamos da Moikato antes de codar

1. CNPJ e regime (MEI/Simples), razão social, endereço para o rodapé, contador.
2. Conta **Asaas PJ** e conta **Melhor Envio**, abertas pelo titular (eu não crio contas).
3. **Tabela de preços em R$** por peça/variação; desconto no Pix?; parcelas sem juros até quantas?
4. Estoque real e quais peças são únicas / em série / sob encomenda.
5. Peso e dimensões **embalada** de cada peça (o frete depende disso).
6. CEP de origem do envio e prazo de despacho.
7. Valor para frete grátis.
8. Política de trocas (mínimo legal: 7 dias de arrependimento).
9. Fotos: 4–6 por peça.
10. Quem opera o admin (e-mails autorizados) e número de WhatsApp brasileiro.
11. A versão em inglês continua vendendo ou vira só vitrine?

---

## Fontes

- Asaas — [preços e taxas](https://www.asaas.com/precos-e-taxas), [changelog da API](https://docs.asaas.com/changelog?page=2)
- Comparativos de gateways 2026 — [guia gateway-pagamento-br](https://github.com/guuszz/gateway-pagamento-br-guide), [heropay.ai](https://heropay.ai/guias/taxas-de-pagamento), [nacao.digital](https://nacao.digital/blog/como-escolher-gateway-de-pagamento/), [Mind Group](https://mindconsulting.com.br/2026/07/gateways-pagamento-online-brasil-comparativo-2026/)
- Frete — [Melhor Envio: como funciona](https://melhorenvio.com.br/blog/sobre-nos/melhor-envio-como-funciona), [Nuvemshop: plataformas de frete 2026](https://www.nuvemshop.com.br/blog/frete-para-ecommerce/)
- Nota fiscal MEI 2026 — [Razonet](https://razonet.com.br/contabilidade-digital/nota-fiscal-mei-em-2026-quando-e-obrigatoria-e-como-emitir), [Contabilidade Zen](https://www.contabilidadezen.com.br/blog/como-emitir-nota-fiscal-mei-2026/)
