"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { placeOrderAction } from "../../app/[lang]/checkout/actions";
import { formatBRL } from "../../lib/money";
import { useCart } from "./CartProvider";

const input =
  "mt-1.5 block min-h-12 w-full border border-verdemoikato/25 bg-white/70 px-3 text-[0.95rem] text-verdemoikato focus:border-verdemoikato focus:outline-none focus:ring-2 focus:ring-amarelomoikato/40";

function Field({ label, hint, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{label}</span>
      <input {...props} className={input} />
      {hint && <span className="mt-1 block text-xs text-verdemoikato/50">{hint}</span>}
    </label>
  );
}

function Section({ step, title, children }) {
  return (
    <section className="border-t border-verdemoikato/15 pt-6">
      <h2 className="flex items-baseline gap-3 font-display text-2xl text-verdemoikato">
        <span className="font-sans text-sm text-amarelomoikato-700">{step}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Summary({ items, t, shippingCents }) {
  const subtotal = items.reduce((sum, line) => sum + line.priceCents * line.qty, 0);
  return (
    <aside className="bg-osso-200/60 p-5 sm:p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-2xl text-verdemoikato">{t.summary}</h2>
      <ul className="mt-4 divide-y divide-verdemoikato/10">
        {items.map((line) => (
          <li key={line.variantId} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-3">
            <div className="relative aspect-square overflow-hidden bg-areia-200">
              {line.image && <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />}
              <span className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-verdemoikato text-[0.65rem] text-osso">{line.qty}</span>
            </div>
            <div className="min-w-0 text-sm">
              <p className="truncate text-verdemoikato">{line.name}</p>
              {line.label && <p className="text-xs text-verdemoikato/55">{line.label}</p>}
            </div>
            <p className="text-sm text-verdemoikato">{formatBRL(line.priceCents * line.qty)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-verdemoikato/15 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-verdemoikato/70">{t.subtotal}</dt>
          <dd>{formatBRL(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-verdemoikato/70">{t.shipping}</dt>
          <dd>{shippingCents == null ? "—" : formatBRL(shippingCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-verdemoikato/15 pt-3 font-display text-2xl text-verdemoikato">
          <dt>{t.total}</dt>
          <dd>{formatBRL(subtotal + (shippingCents ?? 0))}</dd>
        </div>
      </dl>
    </aside>
  );
}

export default function CheckoutForm({ lang, t, cartLabels, shippingLabels, salesLive, giftWrapEnabled }) {
  const { items, ready, gift, setGift } = useCart();
  const [state, formAction, pending] = useActionState(placeOrderAction, null);
  const [address, setAddress] = useState({ cep: "", street: "", district: "", city: "", uf: "" });
  const [shipping, setShipping] = useState({ status: "idle", options: [], selected: null });
  const payloadItems = useMemo(() => items.map(({ variantId, qty }) => ({ variantId, qty })), [items]);

  useEffect(() => {
    if (state?.redirect) window.location.assign(state.redirect);
  }, [state]);

  async function onCep(value) {
    const cep = value.replace(/[^\d-]/g, "").slice(0, 9);
    setAddress((current) => ({ ...current, cep }));
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    // Endereço automático (ViaCEP) e cotação de frete em paralelo.
    setShipping({ status: "loading", options: [], selected: null });
    const [viaCep, quote] = await Promise.allSettled([
      fetch(`https://viacep.com.br/ws/${digits}/json/`).then((r) => r.json()),
      fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: digits, items: payloadItems }),
      }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
    ]);
    if (viaCep.status === "fulfilled" && !viaCep.value.erro) {
      const v = viaCep.value;
      setAddress((current) => ({ ...current, street: v.logradouro || current.street, district: v.bairro || current.district, city: v.localidade, uf: v.uf }));
    }
    if (quote.status === "fulfilled") {
      const options = quote.value.options ?? [];
      setShipping({ status: "done", options, selected: options[0]?.id ?? null });
    } else {
      setShipping({ status: "error", options: [], selected: null });
    }
  }

  if (!ready) return <div className="min-h-[50vh]" />;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-verdemoikato/70">{cartLabels.empty}</p>
        <Link href={`/${lang}/catalogo`} className="mt-6 inline-flex min-h-12 items-center bg-verdemoikato px-6 text-xs font-semibold uppercase tracking-[0.13em] text-osso">
          {cartLabels.continue}
        </Link>
      </div>
    );
  }

  const selected = shipping.options.find((option) => option.id === shipping.selected);

  if (!salesLive) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div className="border-l-2 border-amarelomoikato bg-amarelomoikato/10 p-6">
          <h2 className="font-display text-3xl text-verdemoikato">{t.closedTitle}</h2>
          <p className="mt-3 max-w-lg text-verdemoikato/75">{t.closedText}</p>
          <Link href={`/${lang}/catalogo`} className="mt-6 inline-flex min-h-12 items-center border border-verdemoikato px-6 text-xs font-semibold uppercase tracking-[0.13em] text-verdemoikato">
            {cartLabels.continue}
          </Link>
        </div>
        <Summary items={items} t={t} shippingCents={null} />
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="items" value={JSON.stringify(payloadItems)} />
      <div className="space-y-8">
        <Section step="1" title={t.contact}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.name} name="name" autoComplete="name" required className="sm:col-span-2" />
            <Field label={t.email} name="email" type="email" autoComplete="email" required />
            <Field label={t.phone} name="phone" type="tel" autoComplete="tel" inputMode="tel" />
            <Field label={t.cpf} name="cpf" inputMode="numeric" required hint={t.cpfHint} maxLength={14} />
          </div>
        </Section>

        <Section step="2" title={t.delivery}>
          <div className="grid gap-4 sm:grid-cols-6">
            <Field label={t.cep} name="cep" value={address.cep} onChange={(e) => onCep(e.target.value)} inputMode="numeric" autoComplete="postal-code" required className="sm:col-span-2" />
            <Field label={t.street} name="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} autoComplete="address-line1" required className="sm:col-span-4" />
            <Field label={t.number} name="number" required className="sm:col-span-2" />
            <Field label={t.complement} name="complement" autoComplete="address-line2" className="sm:col-span-4" />
            <Field label={t.district} name="district" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} required className="sm:col-span-2" />
            <Field label={t.city} name="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required className="sm:col-span-3" />
            <Field label={t.uf} name="uf" value={address.uf} onChange={(e) => setAddress({ ...address, uf: e.target.value.toUpperCase().slice(0, 2) })} required className="sm:col-span-1" />
          </div>
        </Section>

        <Section step="3" title={t.shippingMethod}>
          {shipping.status === "idle" && <p className="text-sm text-verdemoikato/60">{t.shippingPending}</p>}
          {shipping.status === "loading" && <p className="text-sm text-verdemoikato/60">…</p>}
          {shipping.status === "error" && <p className="text-sm text-terra-700">{t.shippingUnavailable}</p>}
          <div className="space-y-2">
            {shipping.options.map((option) => (
              <label key={option.id} className={`flex min-h-14 cursor-pointer items-center justify-between gap-4 border px-4 ${shipping.selected === option.id ? "border-verdemoikato bg-verdemoikato/5" : "border-verdemoikato/20"}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="shippingService" value={option.id} checked={shipping.selected === option.id} onChange={() => setShipping({ ...shipping, selected: option.id })} className="accent-verdemoikato" required />
                  <span className="text-sm">
                    {option.company} {option.name}
                    <span className="block text-xs text-verdemoikato/55">{shippingLabels.days.replace("{days}", option.days)}</span>
                  </span>
                </span>
                <span className="text-sm font-medium">{option.priceCents === 0 ? shippingLabels.free : formatBRL(option.priceCents)}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section step="4" title={t.payment}>
          <p className="text-sm text-verdemoikato/70">{t.paymentNote}</p>
          {giftWrapEnabled && (
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="giftWrap"
                checked={gift.wrap}
                onChange={(e) => setGift({ ...gift, wrap: e.target.checked })}
                className="mt-1 size-4 accent-verdemoikato"
              />
              <span className="text-sm text-verdemoikato">
                {cartLabels.gift.wrap}
                <span className="block text-xs text-verdemoikato/55">{cartLabels.gift.note}</span>
              </span>
            </label>
          )}
          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{t.gift}</span>
            <textarea
              name="gift"
              rows={2}
              maxLength={300}
              value={gift.message}
              onChange={(e) => setGift({ ...gift, message: e.target.value })}
              placeholder={cartLabels.gift.placeholder}
              className={input}
            />
          </label>
        </Section>

        {state?.error && (
          <p role="alert" className="border-l-2 border-terra bg-terra-50 px-4 py-3 text-sm text-terra-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending || !selected}
          className="flex min-h-14 w-full items-center justify-center bg-verdemoikato text-sm font-semibold uppercase tracking-[0.13em] text-osso hover:bg-floresta disabled:opacity-50"
        >
          {pending ? t.paying : t.pay}
        </button>
        <p className="-mt-4 text-center text-xs text-verdemoikato/55">
          {t.consent.split(/(\{terms\}|\{privacy\})/).map((part) =>
            part === "{terms}" ? (
              <Link key="terms" href={`/${lang}/politicas/termos`} className="underline underline-offset-2 hover:text-verdemoikato" target="_blank">
                {t.consentTerms}
              </Link>
            ) : part === "{privacy}" ? (
              <Link key="privacy" href={`/${lang}/politicas/privacidade`} className="underline underline-offset-2 hover:text-verdemoikato" target="_blank">
                {t.consentPrivacy}
              </Link>
            ) : (
              part
            )
          )}
        </p>
      </div>
      <Summary items={items} t={t} shippingCents={selected?.priceCents ?? null} />
    </form>
  );
}
