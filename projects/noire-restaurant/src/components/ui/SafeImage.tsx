"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { media, type MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";

type SafeImageProps = Omit<ImageProps, "src" | "alt" | "fill"> & {
  slot: MediaKey;
  /** Override the registry alt text when the image is used decoratively, etc. */
  alt?: string;
  /** Classes for the outer positioned wrapper (fills its parent). */
  wrapperClassName?: string;
  /** "plain" drops the decorative glyph, e.g. for full-bleed backgrounds. */
  fallbackVariant?: "panel" | "plain";
};

/**
 * `next/image` (fill mode) with a graceful fallback: if the slot has no source
 * or the image fails to load, a local art-directed panel is shown instead of a
 * broken-image icon. The parent must be positioned and sized.
 */
export function SafeImage({
  slot,
  alt,
  className,
  wrapperClassName,
  sizes,
  fallbackVariant = "panel",
  ...rest
}: SafeImageProps) {
  const entry = media[slot];
  const [failed, setFailed] = useState(false);
  const label = alt ?? entry.alt;

  if (!entry.src || failed) {
    return <FallbackPanel alt={label} variant={fallbackVariant} className={wrapperClassName} />;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", wrapperClassName)}>
      <Image
        src={entry.src}
        alt={label}
        fill
        sizes={sizes ?? "100vw"}
        quality={80}
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
        {...rest}
      />
    </div>
  );
}

/**
 * Local stand-in for missing imagery: warm light pooling on a dark surface.
 * Pass `label` to print a small caption where nothing else names the image.
 */
export function FallbackPanel({
  label,
  alt,
  variant = "panel",
  className,
}: {
  label?: string;
  alt?: string;
  variant?: "panel" | "plain";
  className?: string;
}) {
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt ? `${alt} (image unavailable)` : undefined}
      className={cn("grain absolute inset-0 overflow-hidden bg-char", className)}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, rgb(217 163 95 / 0.22), transparent 70%), radial-gradient(50% 45% at 20% 85%, rgb(201 122 43 / 0.16), transparent 70%), linear-gradient(160deg, #15130f 0%, #0b0b0a 60%, #070707 100%)",
        }}
      />
      {variant === "panel" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute left-1/2 top-1/2 w-[38%] max-w-44 -translate-x-1/2 -translate-y-1/2 text-gold/20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          <circle cx="100" cy="100" r="78" />
          <circle cx="100" cy="100" r="58" strokeDasharray="1 3" />
        </svg>
      )}
      {label && (
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 font-sans text-[0.62rem] uppercase tracking-[0.3em] text-stone/60"
        >
          {label}
        </span>
      )}
    </div>
  );
}
