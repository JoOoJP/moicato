"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { placeOrderAction, previewCouponAction } from "../../app/[lang]/checkout/actions";
import { formatBRL } from "../../lib/money";
import { useCart } from "./CartProvider";

const input =
  "mt-1.5 block min-h-12 w-full border border-verdemoikato/25 bg-white/70 px-3 text-[0.95rem] text-verdemoikato focus:border-verdemoikato focus:outline-none focus:ring-2 focus:ring-amarelomoikato/40";

// Dados do checkout lembrados neste navegador (sem o CPF, por privacidade).
const CHECKOUT_KEY = "moikato-checkout-v1";

const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");
const maskCep = (value) => {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};
const maskPhone = (value) => {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
const maskCpf = (value) => {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

function readCheckout() {
  try {
    return JSON.parse(window.localStorage.getItem(CHECKOUT_KEY) ?? "null");
  } catch {
    return null;
  }
}

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
      <h2 className="flex items-center gap-3 font-display text-2xl leading-none text-verdemoikato">
        <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border border-amarelomoikato-700/50 font-sans text-xs text-amarelomoikato-700">
          {step}
        </span>
        <span className="pt-0.5">{title}</span>
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Summary({ items, t, shippingCents, coupon }) {
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
          <dd>{coupon?.freeShipping ? t.freeShippingCoupon : shippingCents == null ? "—" : formatBRL(shippingCents)}</dd>
        </div>
        {coupon?.discountCents > 0 && (
          <div className="flex justify-between text-amarelomoikato-700">
            <dt>
              {t.discount} · {coupon.code}
            </dt>
            <dd>− {formatBRL(coupon.discountCents)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-verdemoikato/15 pt-3 font-display text-2xl text-verdemoikato">
          <dt>{t.total}</dt>
          <dd>{formatBRL(subtotal + (coupon?.freeShipping ? 0 : shippingCents ?? 0) - (coupon?.discountCents ?? 0))}</dd>
        </div>
      </dl>
    </aside>
  );
}

export default function CheckoutForm({ lang, t, cartLabels, shippingLabels, salesLive, giftWrapEnabled }) {
  const { items, ready, gift, setGift } = useCart();
  const [state, formAction, pending] = useActionState(placeOrderAction, null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", cpf: "", number: "", complement: "" });
  const [address, setAddress] = useState({ cep: "", street: "", district: "", city: "", uf: "" });
  const restored = useRef(false);
  const [shipping, setShipping] = useState({ status: "idle", options: [], selected: null });
  const payloadItems = useMemo(() => items.map(({ variantId, qty }) => ({ variantId, qty })), [items]);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponState, setCouponState] = useState({ pending: false, error: null });

  // `silent`: aplicação automática enquanto digita — não mostra erro.
  const applyCoupon = useCallback(
    async (code, { silent = false } = {}) => {
      if (!code.trim()) return;
      if (!silent) setCouponState({ pending: true, error: null });
      const shippingCents = shipping.options.find((option) => option.id === shipping.selected)?.priceCents ?? 0;
      const result = await previewCouponAction({ code, items: payloadItems, shippingCents, lang });
      if (result.error) {
        if (!silent) {
          setCoupon(null);
          setCouponState({ pending: false, error: result.error });
        }
      } else {
        setCoupon(result);
        setCouponState({ pending: false, error: null });
      }
    },
    [shipping, payloadItems, lang]
  );

  // Cupom aplicado sozinho quando o código digitado existe (pausa de 0,6 s).
  useEffect(() => {
    if (coupon || couponInput.trim().length < 3 || payloadItems.length === 0) return;
    const timer = setTimeout(() => applyCoupon(couponInput, { silent: true }), 600);
    return () => clearTimeout(timer);
  }, [couponInput, coupon, payloadItems, applyCoupon]);

  useEffect(() => {
    if (state?.redirect) window.location.assign(state.redirect);
  }, [state]);

  const onCep = useCallback(async (value) => {
    const cep = maskCep(value);
    setAddress((current) => ({ ...current, cep }));
    const digits = onlyDigits(cep);
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
  }, [payloadItems]);

  // Volta ao checkout: restaura contato, endereço (recalcula o frete) e cupom.
  useEffect(() => {
    if (!ready || restored.current || items.length === 0) return;
    restored.current = true;
    const saved = readCheckout();
    if (!saved) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContact((current) => ({ ...current, ...saved.contact, cpf: "" }));
    setAddress((current) => ({ ...current, ...saved.address }));
    if (saved.coupon) setCouponInput(saved.coupon);
    if (onlyDigits(saved.address?.cep).length === 8) onCep(saved.address.cep);
  }, [ready, items.length, onCep]);

  useEffect(() => {
    if (!restored.current) return;
    try {
      const { cpf, ...safeContact } = contact;
      window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify({ contact: safeContact, address, coupon: coupon?.code ?? null }));
    } catch {
      // armazenamento indisponível: só não lembra
    }
  }, [contact, address, coupon]);

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
            <Field label={t.name} name="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} autoComplete="name" required className="sm:col-span-2" />
            <Field label={t.email} name="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} autoComplete="email" required />
            <Field label={t.phone} name="phone" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: maskPhone(e.target.value) })} autoComplete="tel" inputMode="tel" placeholder="(41) 99999-9999" />
            <Field label={t.cpf} name="cpf" value={contact.cpf} onChange={(e) => setContact({ ...contact, cpf: maskCpf(e.target.value) })} inputMode="numeric" required hint={t.cpfHint} placeholder="000.000.000-00" maxLength={14} />
          </div>
        </Section>

        <Section step="2" title={t.delivery}>
          <div className="grid gap-4 sm:grid-cols-6">
            <Field label={t.cep} name="cep" value={address.cep} onChange={(e) => onCep(e.target.value)} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" maxLength={9} required className="sm:col-span-2" />
            <Field label={t.street} name="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} autoComplete="address-line1" required className="sm:col-span-4" />
            <Field label={t.number} name="number" value={contact.number} onChange={(e) => setContact({ ...contact, number: e.target.value })} required className="sm:col-span-2" />
            <Field label={t.complement} name="complement" value={contact.complement} onChange={(e) => setContact({ ...contact, complement: e.target.value })} autoComplete="address-line2" className="sm:col-span-4" />
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
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato/60">{t.coupon}</span>
            <input type="hidden" name="coupon" value={coupon?.code ?? ""} />
            {coupon ? (
              <div className="mt-1.5 flex min-h-12 items-center justify-between border border-amarelomoikato-700/40 bg-amarelomoikato/10 px-3 text-sm">
                <span className="text-verdemoikato">{t.couponApplied.replace("{code}", coupon.code)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCoupon(null);
                    setCouponInput("");
                  }}
                  className="min-h-11 text-xs text-verdemoikato/60 underline-offset-4 hover:underline"
                >
                  {t.couponRemove}
                </button>
              </div>
            ) : (
              <div className="mt-1.5 flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCoupon(couponInput);
                    }
                  }}
                  placeholder={t.couponPlaceholder}
                  aria-label={t.coupon}
                  autoComplete="off"
                  className={`${input} mt-0 flex-1 uppercase`}
                />
                <button
                  type="button"
                  onClick={() => applyCoupon(couponInput)}
                  disabled={couponState.pending || !couponInput.trim()}
                  className="min-h-12 border border-verdemoikato px-5 text-xs font-semibold uppercase tracking-[0.12em] text-verdemoikato hover:bg-verdemoikato hover:text-osso disabled:opacity-50"
                >
                  {couponState.pending ? "…" : t.couponApply}
                </button>
              </div>
            )}
            {couponState.error && <p className="mt-2 text-sm text-terra-700">{couponState.error}</p>}
          </div>
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
      <Summary items={items} t={t} shippingCents={selected?.priceCents ?? null} coupon={coupon} />
    </form>
  );
}
