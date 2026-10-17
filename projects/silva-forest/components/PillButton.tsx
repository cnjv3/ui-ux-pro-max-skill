import ArrowIcon from "./ArrowIcon";

type PillButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  arrow?: "right" | "down" | "up-right";
};

/** Capsule CTA: translucent forest body with a lime disc carrying the arrow. */
export default function PillButton({ href, children, className, arrow = "right" }: PillButtonProps) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-12 items-center gap-5 rounded-full border border-bone/20 bg-forest/70 py-1.5 pl-6 pr-1.5 text-bone backdrop-blur-md transition-[background-color,border-color] duration-300 ease-cinema hover:border-lime/50 hover:bg-forest/90 ${className ?? ""}`}
    >
      <span className="label text-[0.72rem]">{children}</span>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 ease-cinema group-hover:translate-x-1 group-focus-visible:translate-x-1">
        <ArrowIcon direction={arrow} className="h-4 w-4" />
      </span>
    </a>
  );
}
