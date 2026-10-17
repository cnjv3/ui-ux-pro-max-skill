import SectionLabel from "./SectionLabel";

const roles = [
  {
    title: "Biodiversity",
    text: "Forests hold most of the planet's land-based species. According to FAO and UNEP, they provide habitat for 80% of amphibian species, 75% of bird species and 68% of mammal species.",
    source: "FAO & UNEP, The State of the World's Forests 2020",
  },
  {
    title: "Climate regulation",
    text: "Growing trees absorb carbon dioxide and store carbon in wood, roots and soil. When forests are cleared or burned, much of that stored carbon is released back into the atmosphere.",
    source: "IPCC, Climate Change and Land (2019)",
  },
  {
    title: "The water cycle",
    text: "Canopies intercept rainfall, roots and leaf litter help water soak into the ground, and transpiration returns moisture to the air, shaping how rivers flow and how landscapes hold water.",
  },
  {
    title: "Soil protection",
    text: "Roots bind the soil and a covering of leaves shields it from heavy rain, which reduces erosion on slopes and keeps fertile topsoil in place.",
  },
  {
    title: "Community wellbeing",
    text: "Many communities rely on forests for food, fuel, medicine, livelihoods and cultural identity. Healthy forests support the people who live with them.",
  },
] as const;

export default function WhyForests() {
  return (
    <section
      id="journal"
      aria-labelledby="journal-title"
      className="relative scroll-mt-6 border-t border-bone/10 px-5 py-24 sm:px-[4vw] lg:px-[7vw] lg:py-36"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-16">
            <SectionLabel index="04">Journal — Why forests matter</SectionLabel>
            <h2
              id="journal-title"
              data-reveal
              className="mt-8 max-w-[14ch] font-display text-[clamp(2rem,4.2vw,3.5rem)] font-light leading-[1.06] tracking-[-0.03em]"
            >
              The quiet systems that hold life together.
            </h2>

            <figure data-reveal className="mt-14 border-t border-bone/15 pt-8">
              <p className="font-display text-[clamp(4rem,9vw,7.5rem)] font-extralight leading-none tracking-[-0.05em] text-bone">
                31<span className="text-lime">%</span>
              </p>
              <figcaption className="mt-4 max-w-xs text-sm font-light leading-relaxed text-mineral">
                of the world&apos;s land area is covered by forest.
                <cite className="label mt-3 block text-[0.6rem] not-italic text-mineral/70">
                  FAO, Global Forest Resources Assessment 2020
                </cite>
              </figcaption>
            </figure>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {roles.map((role, i) => (
            <li key={role.title} data-reveal className="border-t border-bone/15 py-9 last:border-b sm:py-11">
              <div className="flex items-baseline gap-6">
                <span className="font-display text-sm text-lime">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-normal tracking-[-0.01em] text-bone sm:text-2xl">
                    {role.title}
                  </h3>
                  <p className="mt-3 max-w-xl font-light leading-relaxed text-mineral">{role.text}</p>
                  {"source" in role ? (
                    <p className="label mt-4 text-[0.6rem] text-mineral/70">Source: {role.source}</p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
