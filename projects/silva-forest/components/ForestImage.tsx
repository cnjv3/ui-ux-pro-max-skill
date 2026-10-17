"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ForestImageProps = Omit<ImageProps, "fill" | "onError"> & {
  /** Extra classes for the wrapper that also carries the fallback surface. */
  frameClassName?: string;
  /** Stretch the wrapper over its positioned parent instead of sizing it in flow. */
  cover?: boolean;
};

/**
 * A filled `next/image` that degrades to a quiet forest-toned surface if the
 * file cannot be loaded, so the layout and mood survive a missing photo.
 */
export default function ForestImage({ alt, className, frameClassName, cover, ...props }: ForestImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`${cover ? "absolute inset-0" : "relative"} overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,#526B4C_0%,#10241B_45%,#050706_100%)] ${frameClassName ?? ""}`}
    >
      {failed ? (
        alt ? (
          <span role="img" aria-label={alt} className="absolute inset-0" />
        ) : null
      ) : (
        <Image
          {...props}
          alt={alt}
          fill
          className={`object-cover ${className ?? ""}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
