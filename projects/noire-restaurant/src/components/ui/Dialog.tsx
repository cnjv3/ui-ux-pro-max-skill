"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name — either visible heading id or a plain label. */
  labelledBy?: string;
  label?: string;
  children: ReactNode;
  className?: string;
  /** Extra keyboard handling (e.g. arrow keys in a lightbox). */
  onKeyDown?: (event: KeyboardEvent) => void;
};

/**
 * Accessible modal shell used by the menu, mobile navigation and lightbox.
 * - Renders in a portal and marks the page root `inert` while open.
 * - Traps Tab focus, closes on Escape, restores focus to the opener.
 * - Locks page scroll (native + Lenis); inner scroll areas use data-lenis-prevent.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  label,
  children,
  className,
  onKeyDown,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { lockScroll } = useSmoothScroll();
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const onCloseRef = useRef(onClose);
  const onKeyDownRef = useRef(onKeyDown);

  useEffect(() => {
    onCloseRef.current = onClose;
    onKeyDownRef.current = onKeyDown;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const release = lockScroll();
    const appRoot = document.getElementById("app-root");
    appRoot?.setAttribute("inert", "");

    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel)?.focus({ preventScroll: true });
    });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement,
        );
        if (nodes.length === 0) {
          event.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      onKeyDownRef.current?.(event);
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey);
      appRoot?.removeAttribute("inert");
      release();
      opener?.focus({ preventScroll: true });
    };
  }, [open, lockScroll]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog"
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-noir/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : label}
            tabIndex={-1}
            className={cn("relative h-full w-full outline-none", className)}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
