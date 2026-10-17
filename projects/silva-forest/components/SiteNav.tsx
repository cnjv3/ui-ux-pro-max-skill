"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { navLinks } from "@/lib/site";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the drawer if the viewport grows into the desktop layout.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="relative z-20">
      <nav
        aria-label="Primary"
        className="flex items-center justify-between gap-6 border-b border-bone/20 px-5 py-4 sm:px-8 lg:px-10 lg:py-5"
      >
        <a
          href="#top"
          aria-label="SILVA, back to top"
          className="enter-rise text-bone transition-opacity duration-500 hover:opacity-80"
          style={{ "--d": "500ms" } as React.CSSProperties}
        >
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-11">
          {navLinks.map((link, i) => (
            <li key={link.href} className="enter-rise" style={{ "--d": `${650 + i * 80}ms` } as React.CSSProperties}>
              <a
                href={link.href}
                className="label group relative py-2 text-bone/80 transition-colors duration-500 hover:text-bone"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-bone/70 transition-transform duration-500 ease-cinema group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div
          className="enter-rise hidden items-center gap-6 lg:flex"
          style={{ "--d": "1100ms" } as React.CSSProperties}
        >
          <span className="label flex items-center gap-2 text-bone/70" title="Site language">
            <GlobeIcon />
            English
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-bone/25" />
          <a
            href="#contact"
            className="label rounded-full border border-bone/40 bg-bone/[0.06] px-5 py-2.5 text-bone backdrop-blur-[2px] transition-colors duration-500 hover:border-bone/80 hover:bg-bone hover:text-ink"
          >
            Contact us
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="enter-rise label relative z-50 -mr-2 flex min-h-11 items-center gap-3 px-2 text-bone lg:hidden"
          style={{ "--d": "700ms" } as React.CSSProperties}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-cinema ${open ? "top-1.5 rotate-45" : "top-0.5"}`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-cinema ${open ? "top-1.5 -rotate-45" : "top-2.5"}`}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-sm lg:hidden"
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-24">
          <ul className="border-t border-bone/15">
            {navLinks.map((link, i) => (
              <li key={link.href} className="border-b border-bone/15">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5 font-display text-3xl font-light text-bone"
                >
                  {link.label}
                  <span className="label text-mineral">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <span className="label flex items-center gap-2 text-mineral">
              <GlobeIcon />
              English
            </span>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="label rounded-full border border-bone/40 px-6 py-3.5 text-bone"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M1.5 8h13M8 1.5c1.8 1.8 2.6 4 2.6 6.5S9.8 12.7 8 14.5M8 1.5C6.2 3.3 5.4 5.5 5.4 8s.8 4.7 2.6 6.5" />
    </svg>
  );
}
