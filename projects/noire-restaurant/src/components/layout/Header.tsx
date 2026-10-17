"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { AnchorButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif text-[1.45rem] tracking-[0.18em] text-ivory", className)}>
      NOIR<span className="text-gold">É</span>
    </span>
  );
}

export { Wordmark };

export function Header() {
  const { scrollToHash } = useSmoothScroll();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  // Track the section in view for aria-current.
  useEffect(() => {
    const sections = siteConfig.nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    if (open) {
      setOpen(false);
      // Wait for the dialog to release the scroll lock and restore focus.
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(href)));
    } else {
      scrollToHash(href);
    }
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-noir focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-ivory"
      >
        Skip to content
      </a>

      <motion.header
        data-intro="nav"
        className="fixed inset-x-0 top-0 z-50"
        animate={{
          backgroundColor: scrolled ? "rgba(7,7,7,0.72)" : "rgba(7,7,7,0.18)",
          borderColor: scrolled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <div className="absolute inset-0 -z-10 backdrop-blur-xl backdrop-saturate-150" aria-hidden="true" />
        <nav aria-label="Primary" className="frame flex h-[var(--header-h)] items-center justify-between gap-6">
          <a
            href="#home"
            onClick={(e) => go(e, "#home")}
            aria-label={`${siteConfig.fullName} — back to top`}
            className="shrink-0"
          >
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  aria-current={active === item.href ? "location" : undefined}
                  className={cn(
                    "relative inline-flex min-h-11 items-center px-3.5 text-[0.7rem] uppercase tracking-[0.24em] transition-colors duration-300",
                    active === item.href ? "text-ivory" : "text-stone hover:text-ivory",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3.5 bottom-2 h-px origin-left bg-gold transition-transform duration-500 ease-luxe",
                      active === item.href ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <AnchorButton href="#reserve" variant="line" className="min-h-11 px-5">
                Reserve a Table
              </AnchorButton>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-gold/60 hover:text-gold lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </motion.header>

      <Dialog open={open} onClose={() => setOpen(false)} label="Site navigation">
        <div id="mobile-menu" className="grain flex h-full flex-col bg-noir/95">
          <div className="frame flex h-[var(--header-h)] items-center justify-between">
            <Wordmark />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ivory hover:border-gold/60 hover:text-gold"
            >
              <X className="size-5" strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="frame flex flex-1 flex-col justify-center overflow-y-auto py-8" data-lenis-prevent>
            <ol className="space-y-1">
              {siteConfig.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={active === item.href ? "location" : undefined}
                    className="group flex items-baseline gap-5 border-b border-line py-4"
                  >
                    <span className="w-6 font-sans text-[0.65rem] tracking-[0.2em] text-gold/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[clamp(2rem,9vw,3rem)] leading-none text-ivory transition-colors group-hover:text-gold group-aria-[current]:italic">
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ol>
            <AnchorButton href="#reserve" onClick={(e) => go(e, "#reserve")} className="mt-10 w-full" icon>
              Reserve a Table
            </AnchorButton>
          </nav>
        </div>
      </Dialog>
    </>
  );
}
