"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], label, select, summary, [data-cursor]';
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Dot + ring cursor for fine-pointer devices. It is purely decorative:
 * pointer-events are disabled, the native cursor returns over text fields,
 * and nothing renders on touch devices or with reduced motion.
 */
export function Cursor() {
  const enabled = useMediaQuery(QUERY);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.classList.remove("has-custom-cursor");
      return;
    }
    root.classList.add("has-custom-cursor");

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setHovering(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringScale = pressed ? 0.85 : hovering ? 1.75 : 1;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 -ml-5 -mt-5 size-10 rounded-full border border-gold/50"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: ringScale,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? "rgba(217,163,95,0.08)" : "rgba(217,163,95,0)",
          borderColor: hovering ? "rgba(217,163,95,0.8)" : "rgba(217,163,95,0.45)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-gold"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.5 : 1 }}
        transition={{ duration: 0.25 }}
      />
    </div>
  );
}
