import ArrowIcon from "./ArrowIcon";
import ForestImage from "./ForestImage";
import PillButton from "./PillButton";
import SectionLabel from "./SectionLabel";
import { contactEmail, mailto } from "@/lib/site";

const ways = [
  {
    title: "Learn",
    text: "Start with why forests matter and what protecting them involves.",
    href: "#journal",
    cta: "Read the journal",
    arrow: "down",
  },
  {
    title: "Share an initiative",
    text: "Know of a conservation or restoration effort worth amplifying? Tell us about it.",
    href: mailto("Sharing a conservation initiative"),
    cta: "Email us",
    arrow: "up-right",
  },
] as const;

export default function Participate() {
  return (
    <section id="participate" aria-labelledby="participate-title" className="relative isolate scroll-mt-6 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <ForestImage
          src="/images/participate-trees.jpg"
          alt=""
          sizes="100vw"
          cover
          className="object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-ink/70" />
      </div>

      <div className="px-5 py-28 sm:px-[4vw] lg:px-[7vw] lg:py-44">
        <SectionLabel index="05">Take part</SectionLabel>
        <h2
          id="participate-title"
          data-reveal
          className="mt-8 max-w-[15ch] font-display text-[clamp(2.4rem,6vw,5rem)] font-light leading-[1.02] tracking-[-0.035em]"
        >
          The future is rooted in nature.
        </h2>
        <p data-reveal className="mt-6 max-w-lg font-light leading-relaxed text-bone/80 sm:text-lg">
          Protecting forests is a shared responsibility. Learn, pass on what works, or start a conversation with us.
        </p>

        <div className="mt-16 grid border-t border-bone/20 md:grid-cols-3 lg:mt-24">
          {ways.map((way) => (
            <a
              key={way.title}
              href={way.href}
              data-reveal
              className="group flex flex-col justify-between gap-10 border-b border-bone/20 py-8 transition-colors duration-500 hover:bg-bone/[0.03] md:border-b-0 md:border-r md:px-8 md:first:pl-0"
            >
              <div>
                <h3 className="font-display text-xl font-normal text-bone sm:text-2xl">{way.title}</h3>
                <p className="mt-3 max-w-xs font-light leading-relaxed text-mineral">{way.text}</p>
              </div>
              <span className="label flex items-center gap-3 text-bone">
                {way.cta}
                <ArrowIcon
                  direction={way.arrow}
                  className="h-3.5 w-3.5 text-lime transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </a>
          ))}

          <div id="contact" data-reveal className="flex scroll-mt-24 flex-col justify-between gap-8 py-8 md:pl-8">
            <div>
              <h3 className="font-display text-xl font-normal text-bone sm:text-2xl">Contact</h3>
              <p className="mt-3 font-light leading-relaxed text-mineral">
                Write to us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-bone underline decoration-bone/30 underline-offset-4 hover:decoration-lime">
                  {contactEmail}
                </a>
              </p>
            </div>
            <PillButton href={mailto("Hello SILVA")} arrow="up-right" className="self-start">
              Contact us
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
