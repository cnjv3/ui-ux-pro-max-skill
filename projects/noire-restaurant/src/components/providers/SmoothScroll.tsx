"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type SmoothScrollApi = {
  /** Scroll to an in-page anchor ("#menu") and move focus there. */
  scrollToHash: (hash: string) => void;
  /** Reference-counted page scroll lock for dialogs. */
  lockScroll: () => () => void;
};

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScroll>");
  return ctx;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      // Lenis only smooths wheel input; touch devices keep native momentum.
      const lenis = new Lenis({
        lerp: 0.11,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (lockCount.current > 0) lenis.stop();
      lenisRef.current = lenis;

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    let stop = reduce.matches ? undefined : start();

    const onChange = () => {
      stop?.();
      stop = reduce.matches ? undefined : start();
      ScrollTrigger.refresh();
    };
    reduce.addEventListener("change", onChange);

    return () => {
      reduce.removeEventListener("change", onChange);
      stop?.();
    };
  }, []);

  const scrollToHash = useCallback((hash: string) => {
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const focusTarget = () => {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        // Lenis already honours the target's scroll-margin-top (header height).
        duration: 1.3,
        onComplete: focusTarget,
      });
    } else {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      focusTarget();
    }
    try {
      history.replaceState(null, "", hash);
    } catch {
      // Sandboxed frames may refuse history updates; scrolling still works.
    }
  }, []);

  const lockScroll = useCallback(() => {
    lockCount.current += 1;
    const root = document.documentElement;
    if (lockCount.current === 1) {
      const scrollbar = window.innerWidth - root.clientWidth;
      root.style.overflow = "hidden";
      if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
      lenisRef.current?.stop();
    }
    let released = false;
    return () => {
      if (released) return;
      released = true;
      lockCount.current -= 1;
      if (lockCount.current === 0) {
        root.style.overflow = "";
        root.style.paddingRight = "";
        lenisRef.current?.start();
      }
    };
  }, []);

  const api = useMemo(() => ({ scrollToHash, lockScroll }), [scrollToHash, lockScroll]);

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}
