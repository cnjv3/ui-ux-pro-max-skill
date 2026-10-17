import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  copy?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Eyebrow + serif title + lede. Children carry `data-reveal` for scroll reveals. */
export function SectionHeading({ id, eyebrow, title, copy, align = "left", className }: SectionHeadingProps) {
  return (
    <header className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p data-reveal className={cn("eyebrow flex items-center gap-4", align === "center" && "justify-center")}>
        <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
        {eyebrow}
      </p>
      <h2 id={id} data-reveal className="mt-6 text-title text-ivory">
        {title}
      </h2>
      {copy && (
        <p data-reveal className={cn("mt-6 max-w-[46ch] text-lede text-stone", align === "center" && "mx-auto")}>
          {copy}
        </p>
      )}
    </header>
  );
}
