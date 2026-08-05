import Divider from "./Divider";

// Manifesto de fecho — verde-floresta, 3 linhas serifadas centradas.
export default function Closing({ dict }) {
  return (
    <section className="bg-floresta-600 text-osso">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-28">
        <p className="font-display text-3xl font-light leading-snug sm:text-4xl">
          {dict.lines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </p>
        <Divider className="mt-8" />
      </div>
    </section>
  );
}
