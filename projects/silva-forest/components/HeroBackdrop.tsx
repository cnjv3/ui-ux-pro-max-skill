"use client";

import { useEffect, useRef } from "react";
import ForestImage from "./ForestImage";

/**
 * Full-bleed aerial photograph with a restrained parallax: the layer moves at
 * a fraction of the scroll speed and only while the hero is on screen.
 */
export default function HeroBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      layer.style.transform = `translate3d(0, ${y * 0.16}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div ref={layerRef} className="absolute inset-x-0 -top-[3%] h-[108%] will-change-transform">
        <div className="hero-settle absolute inset-0">
          <div className="hero-drift absolute inset-0">
            <ForestImage
              src="/images/hero-forest-aerial.jpg"
              alt=""
              priority
              quality={80}
              sizes="100vw"
              cover
              className="object-[62%_50%] md:object-[70%_50%]"
            />
          </div>
        </div>
      </div>

      {/* Legibility: a soft left-to-right veil, a vignette, and a fade into the page below. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,7,6,0.45)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent via-ink/60 to-ink" />
    </div>
  );
}
