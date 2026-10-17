import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AeroHeroProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  className?: string;
}

const DEFAULT_BACKGROUND =
  "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=2400&q=80";

export function AeroHero({
  title = "Sustainable Solutions for a Better Future",
  description = "Empowering businesses and communities to thrive in a low-carbon world through tailored clean energy solutions.",
  ctaLabel = "Start a Project",
  onCtaClick,
  backgroundImage = DEFAULT_BACKGROUND,
  className,
}: AeroHeroProps) {
  return (
    <section
      className={cn(
        "relative flex h-screen w-full items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Decorative 1 / 3 / 4 / 3 / 1 column grid lines */}
      <div className="absolute inset-0 z-10 size-full" aria-hidden="true">
        <div className="grid w-full grid-cols-12 divide-x divide-white/20">
          <div className="col-span-1 h-screen" />
          <div className="col-span-3 h-screen" />
          <div className="col-span-4 h-screen" />
          <div className="col-span-3 h-screen" />
          <div className="col-span-1 h-screen" />
        </div>
      </div>
      <div
        className="absolute inset-0 bg-[#122023] bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-20 max-w-5xl px-6 text-center text-white">
        <h1 className="mb-6 text-center font-kanturmuy text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-8xl">
          {title}
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-center text-lg font-light text-white/90 md:text-xl">
          {description}
        </p>

        <Button
          onClick={onCtaClick}
          className="group mx-auto flex h-auto cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-5 font-normal shadow-none hover:bg-transparent"
        >
          <span className="rounded-full bg-[#e1fcad] px-6 py-3 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
            {ctaLabel}
          </span>
          <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-[#e1fcad] p-5 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
            <ArrowUpRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
            <ArrowUpRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
          </div>
        </Button>
      </div>
    </section>
  );
}
