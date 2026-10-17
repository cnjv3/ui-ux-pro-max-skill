"use client";

import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

type Variant = "gold" | "ghost" | "line";

const base =
  "group/btn relative inline-flex min-h-12 whitespace-nowrap items-center justify-center gap-3 overflow-hidden rounded-full px-5 text-[0.74rem] font-medium uppercase tracking-[0.18em] sm:px-7 sm:tracking-[0.22em] transition-[color,background-color,border-color,box-shadow,transform] duration-500 ease-luxe active:scale-[0.98]";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-noir shadow-[0_18px_50px_-18px_rgb(217_163_95/0.7)] hover:bg-[#e4b578] hover:shadow-[0_22px_60px_-18px_rgb(217_163_95/0.85)]",
  ghost: "glass text-ivory hover:border-gold/50 hover:text-gold",
  line: "border border-line text-ivory hover:border-gold/60 hover:text-gold",
};

function Inner({ children, icon }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden="true"
          className="relative size-4 transition-transform duration-500 ease-luxe group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
          strokeWidth={1.5}
        />
      )}
    </>
  );
}

type AnchorButtonProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: `#${string}`;
  variant?: Variant;
  icon?: boolean;
};

/** In-page link that scrolls via Lenis (or natively) and moves focus. */
export function AnchorButton({ href, variant = "gold", icon, className, children, onClick, ...rest }: AnchorButtonProps) {
  const { scrollToHash } = useSmoothScroll();
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    scrollToHash(href);
  };
  return (
    <a href={href} onClick={handle} className={cn(base, variants[variant], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </a>
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: Variant; icon?: boolean };

export function Button({ variant = "gold", icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}
