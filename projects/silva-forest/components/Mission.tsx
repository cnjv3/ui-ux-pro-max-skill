import ForestImage from "./ForestImage";
import SectionLabel from "./SectionLabel";

export default function Mission() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className="relative scroll-mt-6 px-5 pb-28 pt-16 sm:px-[4vw] sm:pt-24 lg:px-[7vw] lg:pb-40"
    >
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5 lg:pt-10">
          <SectionLabel index="01">Our mission</SectionLabel>
          <h2
            id="mission-title"
            data-reveal
            className="mt-8 max-w-[12ch] font-display text-[clamp(2.25rem,5vw,4.25rem)] font-light leading-[1.04] tracking-[-0.03em] text-bone"
          >
            A future where forests thrive.
          </h2>
        </div>

        <div className="space-y-6 text-base font-light leading-relaxed text-mineral sm:text-lg lg:col-span-5 lg:col-start-8 lg:pt-40">
          <p data-reveal>
            SILVA exists to keep living forests standing, to help degraded land recover, and to protect the web of
            species that depends on both.
          </p>
          <p data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            We believe conservation works best when it is patient, grounded in science and shaped together with the
            people who live alongside forests. Our work follows three commitments: protect what still stands, restore
            what has been lost, and safeguard the biodiversity that makes a forest more than its trees.
          </p>
        </div>
      </div>

      <figure className="mt-20 grid gap-6 lg:mt-28 lg:grid-cols-12 lg:gap-x-8">
        <div data-reveal="mask" className="lg:col-span-9 lg:col-start-2">
          <ForestImage
            src="/images/mission-misty-forest.jpg"
            alt="Dense conifer forest rising into morning mist."
            sizes="(min-width: 1024px) 70vw, 100vw"
            frameClassName="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
            className="object-[40%_50%]"
          />
        </div>
        <figcaption
          data-reveal="fade"
          className="label flex gap-3 text-mineral/80 lg:col-span-2 lg:flex-col lg:justify-end lg:gap-2"
        >
          <span className="text-bone/80">Fig. 01</span>
          <span>Forest under morning mist</span>
        </figcaption>
      </figure>
    </section>
  );
}
