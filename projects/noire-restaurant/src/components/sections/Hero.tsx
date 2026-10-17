"use client";

import { MapPin, Wine } from "lucide-react";
import { useRef, useState } from "react";
import { AnchorButton } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { siteConfig } from "@/config/site";
import { media } from "@/content/media";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const headline = [
  { text: "Where Flavor", accent: false },
  { text: "Becomes", accent: false, tail: "Art." },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const nav = document.querySelector("[data-intro='nav']");
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(q("[data-hero-bg]"), { scale: 1.14 }, { scale: 1, duration: 2.4, ease: "power3.out" }, 0)
          .fromTo(nav, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.15)
          .fromTo(q("[data-line-inner]"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.3)
          .set(q("[data-intro='headline']"), { autoAlpha: 1 }, 0.3)
          .fromTo(q("[data-intro='copy']"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out" }, 0.85)
          .fromTo(q("[data-intro='cta'] > *"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, 1.0)
          .set(q("[data-intro='cta']"), { autoAlpha: 1 }, 1.0)
          .fromTo(
            q("[data-intro='media']"),
            { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0% round 28px)" },
            { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.5, ease: "power4.inOut" },
            0.7,
          )
          .fromTo(q("[data-media-inner]"), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0.7)
          .fromTo(q("[data-intro='detail']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 1.7);

        // Gentle, low-amplitude float once the card has landed.
        gsap.to(q("[data-float]"), { y: -10, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.3 });

        // Subtle depth as the hero scrolls away.
        gsap.to(q("[data-hero-bg]"), {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      // Reduced motion (or no animation): make sure everything is visible.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(["[data-intro]", document.querySelector("[data-intro='nav']")], { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-noir pb-16 pt-[calc(var(--header-h)+3rem)] sm:pb-20 lg:items-center lg:pb-12"
    >
      {/* Background photograph */}
      <div className="absolute inset-0 -z-20" data-hero-bg>
        <SafeImage
          slot="heroBackground"
          alt=""
          fallbackVariant="plain"
          preload
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-[60%_center] lg:object-center"
        />
      </div>

      {/* Legibility: left gradient, bottom fade, edge vignette */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.9)_0%,rgba(7,7,7,0.62)_34%,rgba(7,7,7,0.12)_68%,rgba(7,7,7,0.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-noir via-noir/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-noir/70 to-transparent" />
        <div className="absolute inset-0 shadow-[inset_0_0_220px_60px_rgba(0,0,0,0.75)]" />
      </div>

      <div className="frame relative grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="lg:col-span-7">
          <p data-intro="detail" className="eyebrow mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              {siteConfig.atmosphereLabel}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            <span className="text-stone">{siteConfig.serviceLabel}</span>
          </p>

          <h1 id="hero-title" data-intro="headline" className="text-display text-ivory">
            {headline.map((line) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                <span data-line-inner className="block whitespace-nowrap">
                  {line.text}
                  {line.tail && (
                    <>
                      {" "}
                      <em className="text-gilded pr-[0.06em] italic">{line.tail}</em>
                    </>
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p data-intro="copy" className="mt-8 max-w-[44ch] text-lede text-stone">
            An intimate dining experience inspired by seasonal ingredients, thoughtful craftsmanship, and the
            pleasure of sharing something extraordinary.
          </p>

          <div data-intro="cta" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <AnchorButton href="#reserve" icon>
              Reserve Your Experience
            </AnchorButton>
            <AnchorButton href="#menu" variant="ghost">
              Explore Our Menu
            </AnchorButton>
          </div>
        </div>

        {/* Floating media card */}
        <div className="relative mx-auto w-full max-w-[min(430px,82vw)] sm:mr-0 lg:col-span-5 lg:col-start-8 xl:col-start-8">
          {/* Angular gold frame echoing the card */}
          <svg
            data-intro="detail"
            aria-hidden="true"
            viewBox="0 0 100 125"
            preserveAspectRatio="none"
            className="absolute -right-4 -top-5 h-[calc(100%+2.5rem)] w-[calc(100%+1.5rem)] text-gold/35 sm:-right-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 2 L98 9 L94 123 L2 116 Z" vectorEffect="non-scaling-stroke" />
          </svg>

          <div data-float className="relative">
            <figure
              data-intro="media"
              className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/15 shadow-[var(--shadow-deep)]"
            >
              <div data-media-inner className="absolute inset-0">
                <HeroVideo />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/75 via-transparent to-noir/10" />
              <figcaption className="glass absolute inset-x-4 bottom-4 rounded-2xl px-5 py-4 sm:inset-x-5 sm:bottom-5">
                <span className="eyebrow block text-[0.62rem]">The Signature Experience</span>
                <span className="mt-1.5 block font-serif text-lg italic text-ivory">Seasonal tasting menu</span>
              </figcaption>
            </figure>
          </div>

          <div
            data-intro="detail"
            className="glass absolute -left-4 top-10 hidden items-center gap-3 rounded-full px-4 py-2.5 sm:-left-10 sm:flex"
          >
            <Wine aria-hidden="true" className="size-4 text-gold" strokeWidth={1.4} />
            <span className="text-[0.66rem] uppercase tracking-[0.24em] text-ivory/90">Curated wines</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-intro="detail"
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/70">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </div>
    </section>
  );
}

/**
 * Muted, looping, inline video with a static fallback. If the source fails
 * (or is not configured) the dish photograph — or the local panel — remains.
 */
function HeroVideo() {
  const [failed, setFailed] = useState(false);
  const src = media.heroVideo.src;

  return (
    <>
      <SafeImage slot="candidateA" alt="" sizes="(min-width: 1024px) 430px, 82vw" loading="eager" />
      {src && !failed && (
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.heroVideo.alt}
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
    </>
  );
}
