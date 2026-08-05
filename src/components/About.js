export default function About({ dict }) {
  return (
    <section
      id="sustentabilidade"
      className="relative scroll-mt-24 overflow-hidden bg-verdemoikato text-white"
    >
      {/* Fio dourado no topo + brilho sutil para dar vida ao verde */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amarelomoikato/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-8 h-[34rem] w-[34rem] rounded-full bg-amarelomoikato/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-amarelomoikato-300" />
            <span className="eyebrow text-amarelomoikato-300">{dict.eyebrow}</span>
          </div>
          <h2 className="mt-4 text-4xl text-white sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            {dict.intro}
          </p>
        </div>

        {/* Passos — cartões com fios finos, número em destaque e hover sutil */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {dict.steps.map((s) => (
            <div
              key={s.n}
              className="group bg-verdemoikato px-6 py-10 transition-colors duration-300 hover:bg-verdemoikato-600"
            >
              <div className="font-display text-4xl text-amarelomoikato-300">
                {s.n}
              </div>
              <div
                aria-hidden
                className="mt-4 h-px w-8 bg-amarelomoikato/40 transition-all duration-300 group-hover:w-12"
              />
              <h3 className="mt-4 text-xl text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
