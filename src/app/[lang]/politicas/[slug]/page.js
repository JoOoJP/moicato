import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { POLICIES, POLICY_SLUGS } from "../../../../content/politicas";

export function generateStaticParams() {
  return locales.flatMap((lang) => POLICY_SLUGS.map((slug) => ({ lang, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const policy = POLICIES[slug];
  if (!hasLocale(lang) || !policy) return {};
  return {
    title: `${policy.title} | Moikato`,
    description: policy.description,
    alternates: { canonical: `/pt-BR/politicas/${slug}` },
  };
}

export default async function PolicyPage({ params }) {
  const { lang, slug } = await params;
  const policy = POLICIES[slug];
  if (!hasLocale(lang) || !policy) notFound();
  const dict = await getDictionary(lang);
  const t = dict.policies;

  return (
    <>
      <Header dict={dict.header} lang={lang} alwaysSolid />
      <main id="topo" className="flex-1 bg-osso pt-[60px] md:pt-20">
        <article className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:pt-16">
          <p className="text-[0.72rem] tracking-[0.14em] text-amarelomoikato-700">{t.eyebrow.toUpperCase()}</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-light leading-[1.05] text-verdemoikato sm:text-5xl">{policy.title}</h1>
          <p className="mt-3 text-[0.82rem] text-verdemoikato/55">
            {t.updated} {policy.updated}
          </p>

          {lang !== "pt-BR" && (
            <p className="mt-6 border-l-2 border-amarelomoikato bg-amarelomoikato/10 px-4 py-3 text-sm text-verdemoikato/80">{t.languageNotice}</p>
          )}

          <div className="mt-10 space-y-9 text-[0.98rem] leading-7 text-verdemoikato/80">
            {policy.sections().map((section, index) => (
              <section key={section.heading ?? index}>
                {section.heading && <h2 className="mb-3 font-display text-2xl text-verdemoikato">{section.heading}</h2>}
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 first:mt-0">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-amarelomoikato-700">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <nav aria-label={t.otherLabel} className="mt-16 border-t border-verdemoikato/15 pt-6">
            <p className="text-[0.78rem] text-verdemoikato/55">{t.otherLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {POLICY_SLUGS.filter((s) => s !== slug).map((s) => (
                <li key={s}>
                  <Link href={`/${lang}/politicas/${s}`} className="text-verdemoikato underline underline-offset-4 hover:text-floresta">
                    {POLICIES[s].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
