import ForestImage from "./ForestImage";
import SectionLabel from "./SectionLabel";

const areas = [
  {
    title: "Forest Conservation",
    summary: "Protecting standing forests and the ecosystems they hold.",
    body: "Intact forests are irreplaceable. We focus on keeping existing woodland whole: supporting protection of high-value areas, reducing fragmentation and helping local stewards monitor the land they know best.",
    image: "/images/action-conservation.jpg",
    alt: "Tall, straight tree trunks fading into fog in an old forest.",
    position: "object-center",
  },
  {
    title: "Restoration",
    summary: "Helping degraded land recover through responsible initiatives.",
    body: "Restoration is slow work. We favour native species, natural regeneration where it can succeed, and long-term care over one-off planting, so that recovering land becomes a functioning forest again.",
    image: "/images/action-restoration.jpg",
    alt: "Close view of moss and young growth covering the forest floor.",
    position: "object-[30%_50%]",
  },
  {
    title: "Biodiversity",
    summary: "Protecting species and the habitats they depend on.",
    body: "A forest's value lives in its relationships: between canopy and soil, water and wildlife. We work to keep those habitats connected, including the edges where forest meets river and lake.",
    image: "/images/action-biodiversity.jpg",
    alt: "Aerial view of forest meeting the shoreline of a calm lake.",
    position: "object-[35%_50%]",
  },
] as const;

export default function ActionAreas() {
  return (
    <section
      id="action"
      aria-labelledby="action-title"
      className="relative scroll-mt-6 border-t border-bone/10 px-5 py-24 sm:px-[4vw] lg:px-[7vw] lg:py-36"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index="02">Areas of action</SectionLabel>
          <h2
            id="action-title"
            data-reveal
            className="mt-8 max-w-[16ch] font-display text-[clamp(2rem,4.2vw,3.5rem)] font-light leading-[1.06] tracking-[-0.03em]"
          >
            Three lines of work, one living system.
          </h2>
        </div>
        <p data-reveal className="max-w-sm font-light leading-relaxed text-mineral">
          Each area reinforces the others: protected forests anchor restoration, and both sustain the species that
          keep an ecosystem resilient.
        </p>
      </div>

      <ol className="mt-16 border-t border-bone/15 lg:mt-24">
        {areas.map((area, i) => {
          const flipped = i % 2 === 1;
          return (
            <li key={area.title} className="grid gap-8 border-b border-bone/15 py-12 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
              <div className={`lg:col-span-5 ${flipped ? "lg:order-2 lg:col-start-8" : ""}`}>
                <div data-reveal className="flex items-baseline gap-5">
                  <span className="font-display text-sm text-lime">0{i + 1}</span>
                  <h3 className="label text-sm text-bone sm:text-[0.8rem]">{area.title}</h3>
                </div>
                <p
                  data-reveal
                  className="mt-6 font-display text-2xl font-light leading-snug tracking-[-0.015em] text-bone sm:text-3xl"
                >
                  {area.summary}
                </p>
                <p data-reveal className="mt-5 max-w-md font-light leading-relaxed text-mineral">
                  {area.body}
                </p>
              </div>

              <div
                data-reveal="mask"
                className={`lg:col-span-6 ${flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"} ${i === 1 ? "lg:col-span-5 lg:mt-16" : ""}`}
              >
                <ForestImage
                  src={area.image}
                  alt={area.alt}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  frameClassName={i === 1 ? "aspect-[4/3]" : "aspect-[16/10]"}
                  className={`${area.position} transition-transform duration-[1.6s] ease-cinema hover:scale-[1.03]`}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
