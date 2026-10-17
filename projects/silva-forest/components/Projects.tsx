import ForestImage from "./ForestImage";
import SectionLabel from "./SectionLabel";

// Illustrative placeholders only: not real initiatives, places or results.
const projects = [
  {
    name: "Canopy Corridor",
    location: "Temperate broadleaf region",
    description:
      "A sample corridor project reconnecting fragmented woodland on either side of a forest road, so wildlife can move between patches.",
    goal: "Reconnect isolated forest fragments",
    status: "Concept",
    image: "/images/project-canopy.jpg",
    alt: "Aerial view of a mixed autumn forest divided by a winding road.",
    frame: "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/11]",
    span: "lg:col-span-7",
  },
  {
    name: "Highland Mist",
    location: "Montane conifer forest",
    description:
      "A sample watershed project focused on keeping upland forest cover intact where streams begin.",
    goal: "Protect headwater forest cover",
    status: "Planning stage",
    image: "/images/project-highlands.jpg",
    alt: "Dark conifer slopes partly hidden by low cloud.",
    frame: "aspect-[4/5]",
    span: "lg:col-span-4 lg:col-start-9 lg:mt-40",
  },
  {
    name: "Living Understory",
    location: "Mixed woodland",
    description:
      "A sample restoration project rebuilding the native ground layer and soil health beneath an existing canopy.",
    goal: "Restore native understory and soil",
    status: "Exploratory",
    image: "/images/project-understory.jpg",
    alt: "A moss-lined path running through a shaded green forest.",
    frame: "aspect-[4/5] sm:aspect-[16/9]",
    span: "lg:col-span-6 lg:col-start-3",
  },
] as const;

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative scroll-mt-6 bg-gradient-to-b from-ink via-forest/40 to-ink px-5 py-24 sm:px-[4vw] lg:px-[7vw] lg:py-36"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <SectionLabel index="03">Forest projects</SectionLabel>
          <h2
            id="projects-title"
            data-reveal
            className="mt-8 max-w-[18ch] font-display text-[clamp(2rem,4.2vw,3.5rem)] font-light leading-[1.06] tracking-[-0.03em]"
          >
            Field work, shown the way we intend to share it.
          </h2>
        </div>
        <p
          data-reveal
          className="flex gap-3 self-end border-l border-lime/60 pl-4 text-sm font-light leading-relaxed text-mineral lg:col-span-4 lg:col-start-9"
        >
          <span>
            <strong className="label mb-2 block text-[0.65rem] text-bone">Illustrative content</strong>
            The projects below are design examples. They are not active SILVA initiatives, the locations are generic,
            and no results are claimed.
          </span>
        </p>
      </div>

      <ul className="mt-16 grid gap-20 lg:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
        {projects.map((project, i) => (
          <li key={project.name} className={project.span}>
            <article aria-labelledby={`project-${i}`}>
              <div data-reveal="mask" className="group relative">
                <ForestImage
                  src={project.image}
                  alt={project.alt}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  frameClassName={project.frame}
                  className="transition-transform duration-[1.6s] ease-cinema group-hover:scale-[1.03]"
                />
                <span className="label absolute left-4 top-4 rounded-full border border-bone/30 bg-ink/50 px-3 py-1.5 text-[0.6rem] text-bone backdrop-blur-sm">
                  Illustrative
                </span>
              </div>

              <div data-reveal className="mt-6 flex items-baseline justify-between gap-4 border-b border-bone/15 pb-4">
                <h3 id={`project-${i}`} className="font-display text-2xl font-light tracking-[-0.015em] text-bone">
                  {project.name}
                </h3>
                <span className="label shrink-0 text-mineral">0{i + 1}</span>
              </div>
              <p data-reveal className="mt-4 max-w-lg font-light leading-relaxed text-mineral">
                {project.description}
              </p>
              <dl data-reveal className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="label text-[0.6rem] text-mineral/80">Location</dt>
                  <dd className="mt-1.5 text-bone/90">{project.location}</dd>
                </div>
                <div>
                  <dt className="label text-[0.6rem] text-mineral/80">Goal</dt>
                  <dd className="mt-1.5 text-bone/90">{project.goal}</dd>
                </div>
                <div>
                  <dt className="label text-[0.6rem] text-mineral/80">Status</dt>
                  <dd className="mt-1.5 flex items-center gap-2 text-bone/90">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
                    {project.status}
                  </dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
