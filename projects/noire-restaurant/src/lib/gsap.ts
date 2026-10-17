"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registering is idempotent, so importing this module from several
// components (and re-running under Strict Mode) is safe.
gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 1.1 });

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
