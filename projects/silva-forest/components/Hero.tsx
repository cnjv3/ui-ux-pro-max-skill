import HeroBackdrop from "./HeroBackdrop";
import PillButton from "./PillButton";
import SiteNav from "./SiteNav";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate pb-16 sm:pb-20">
      <HeroBackdrop />

      <div className="relative px-3 pt-3 sm:px-[4vw] sm:pt-[3vh] lg:px-[7vw]">
        {/* The editorial frame: a hairline rectangle laid directly on the photograph. */}
        <div
          className="enter-fade relative flex min-h-[calc(100svh-0.75rem-4.5rem)] flex-col border border-bone/40 sm:min-h-[calc(100svh-3vh-5rem)]"
          style={delay(250)}
        >
          {/* Corner ticks, a quiet survey-map detail. */}
          <span aria-hidden="true" className="absolute -left-px -top-px h-3 w-3 border-l border-t border-bone" />
          <span aria-hidden="true" className="absolute -right-px -top-px h-3 w-3 border-r border-t border-bone" />
          <span aria-hidden="true" className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-bone" />
          <span aria-hidden="true" className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-bone" />

          <SiteNav />

          <div id="hero-content" className="flex flex-1 scroll-mt-4 flex-col justify-center px-5 pb-10 pt-14 sm:px-8 lg:px-10 lg:pb-[9vh] lg:pt-12">
            <p className="label enter-rise mb-6 flex items-center gap-3 text-bone/70 lg:mb-8" style={delay(900)}>
              <span aria-hidden="true" className="h-px w-8 bg-lime" />
              The future is rooted in nature.
            </p>

            <h1
              id="hero-title"
              className="max-w-[13ch] font-display text-[clamp(2.6rem,8.4vw,3.6rem)] font-normal leading-[1.02] tracking-[-0.035em] text-bone sm:max-w-[20ch] sm:text-[clamp(3rem,5.6vw,4.9rem)] lg:max-w-none"
            >
              <span className="enter-rise block" style={delay(1000)}>
                Protecting Our Forests.
              </span>
              <span className="enter-rise block text-bone/80" style={delay(1150)}>
                Restoring Our Future.
              </span>
            </h1>

            <p
              className="enter-rise mt-6 max-w-[34rem] text-[0.95rem] font-light leading-relaxed text-bone/80 sm:mt-8 sm:text-base"
              style={delay(1350)}
            >
              Preserving the world&apos;s forests, restoring damaged ecosystems and protecting the biodiversity that
              sustains life on Earth.
            </p>

            <div className="enter-rise mt-9 sm:mt-11" style={delay(1500)}>
              <PillButton href="#mission">Explore our mission</PillButton>
            </div>
          </div>

          <div className="grid gap-6 border-t border-bone/20 px-5 py-6 sm:grid-cols-[1fr_auto] sm:items-end sm:px-8 lg:px-10 lg:py-7">
            <div className="enter-rise" style={delay(1700)}>
              <p className="font-display text-base font-medium tracking-[-0.01em] text-bone sm:text-lg">
                Every forest protected is a future preserved.
              </p>
              <p className="mt-1.5 text-sm font-light text-bone/65">Biodiversity. Restoration. A future in balance.</p>
            </div>

            <div className="enter-rise flex items-center gap-4 sm:justify-end" style={delay(1850)}>
              <span aria-hidden="true" className="relative grid h-9 w-9 place-items-center rounded-full border border-bone/35">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              </span>
              <p className="label text-bone/80">A shared responsibility</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex h-[4.5rem] items-center justify-center sm:h-20">
        <a
          href="#mission"
          className="enter-fade flex flex-col items-center gap-2.5 py-2 text-bone/60 transition-colors hover:text-bone"
          style={delay(2300)}
        >
          <span className="label text-[0.6rem]">Scroll</span>
          <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-bone/20">
            <span className="scroll-cue-dot absolute inset-x-0 top-0 h-1/3 bg-lime" />
          </span>
          <span className="sr-only">to our mission</span>
        </a>
      </div>
    </section>
  );
}
