"use client";

import { ArrowUpRight, Info } from "lucide-react";
import { useState, type FormEvent, type MouseEvent } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { siteConfig } from "@/config/site";
import { Wordmark } from "./Header";

export function Footer({ year }: { year: number }) {
  const { scrollToHash } = useSmoothScroll();
  const { email, phone } = siteConfig.contact;
  const hasContact = Boolean(email || phone);

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    scrollToHash(href);
  };

  return (
    <footer id="contact" aria-labelledby="footer-title" className="relative border-t border-line pt-20 pb-10 sm:pt-28">
      <h2 id="footer-title" className="sr-only">
        Contact and newsletter
      </h2>
      <div className="frame">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <Wordmark className="text-3xl" />
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-stone">{siteConfig.description}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h3 className="eyebrow text-[0.62rem]">Explore</h3>
            <ul className="mt-5 space-y-1">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className="inline-flex min-h-10 items-center text-sm text-stone transition-colors hover:text-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h3 className="eyebrow text-[0.62rem]">Contact</h3>
            {hasContact ? (
              <ul className="mt-5 space-y-3 text-sm">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="text-stone transition-colors hover:text-ivory">
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-stone transition-colors hover:text-ivory">
                      {phone}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-stone/70">
                Contact details will appear here once configured.
              </p>
            )}
            {siteConfig.socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {siteConfig.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone transition-colors hover:text-gold"
                    >
                      {social.label}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <Newsletter />
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-xs text-stone/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.fullName}. All rights reserved.
          </p>
          <p>NOIRÉ is a fictional brand created for a design demonstration.</p>
        </div>
      </div>

      {/* Oversized wordmark — decorative */}
      <p
        aria-hidden="true"
        className="pointer-events-none mt-12 select-none overflow-hidden text-center font-serif text-[26vw] leading-[0.8] tracking-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(217,163,95,0.14)]"
      >
        NOIRÉ
      </p>
    </footer>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "demo">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? "demo" : "invalid");
  };

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="newsletter-title">
      <h3 id="newsletter-title" className="eyebrow text-[0.62rem]">
        Letters from NOIRÉ
      </h3>
      <p className="mt-5 text-sm leading-relaxed text-stone">
        Seasonal menus and occasional evenings, delivered quietly.
        {!siteConfig.newsletterConnected && " (Demo — no subscription service is connected.)"}
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-line bg-field p-1.5 focus-within:border-gold/60">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          aria-invalid={state === "invalid" || undefined}
          aria-describedby="newsletter-status"
          className="min-h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-ivory placeholder:text-stone/50 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-gold px-5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-noir transition-colors hover:bg-[#e4b578]"
        >
          Subscribe
        </button>
      </div>
      <div id="newsletter-status" aria-live="polite" className="mt-3 min-h-5 text-xs">
        {state === "invalid" && <p className="text-[#f0a48f]">Please enter a valid email address.</p>}
        {state === "demo" && (
          <p className="flex items-start gap-2 text-stone">
            <Info aria-hidden="true" className="mt-px size-3.5 shrink-0 text-gold" strokeWidth={1.5} />
            Demo only — your email has not been sent or saved anywhere.
          </p>
        )}
      </div>
    </form>
  );
}
