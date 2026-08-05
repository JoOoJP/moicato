export default function Values({ dict }) {
  return (
    <section
      aria-labelledby="valores-titulo"
      className="border-y border-verdemoikato/10 bg-areia"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-8 border-b border-verdemoikato/25 pb-10 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-16 sm:pb-12">
          <div>
            <span className="eyebrow text-amarelomoikato-800">
              {dict.eyebrow}
            </span>
            <h2
              id="valores-titulo"
              className="mt-5 max-w-xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              {dict.title}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-verdemoikato-900/75 md:justify-self-end">
            {dict.lead}
          </p>
        </div>

        <dl className="grid md:grid-cols-2">
          {dict.items.map((item, index) => (
            <div
              key={item.title}
              className={`grid gap-5 border-b border-verdemoikato/20 py-8 sm:grid-cols-[4.5rem_1fr] sm:py-10 md:px-8 md:first:pl-0 md:[&:nth-child(2)]:pr-0 md:[&:nth-child(3)]:pl-0 md:[&:nth-child(4)]:pr-0 ${
                index % 2 === 1 ? "md:border-l md:border-verdemoikato/20" : ""
              }`}
            >
              <dt className="flex items-baseline gap-3 sm:block">
                <span className="font-display text-3xl italic text-amarelomoikato-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="eyebrow text-verdemoikato-700/55 sm:mt-3 sm:block">
                  {item.meta}
                </span>
              </dt>
              <dd>
                <h3 className="text-2xl leading-tight">{item.title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-verdemoikato-800/75">
                  {item.text}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
