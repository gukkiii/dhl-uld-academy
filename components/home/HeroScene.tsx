"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";
import { UldIllustration } from "@/components/uld/UldIllustration";

/**
 * Animated hero centrepiece: a ULD is "loaded" into a freighter. The aircraft
 * silhouette settles in first, then a container slides in from the left and
 * comes to rest with a gentle, continuous float — evoking ground handling on
 * the ramp. A secondary yellow pallet drifts in behind it for depth.
 *
 * Respects `prefers-reduced-motion`: when set, everything renders in its final
 * resting position with no movement.
 */
export function HeroScene() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative flex aspect-[5/4] w-full max-w-md items-center justify-center sm:aspect-[3/2] lg:max-w-none"
      aria-hidden
    >
      {/* Soft brand glow behind the scene */}
      <div className="dhl-gradient-soft absolute inset-6 rounded-full blur-2xl" />

      {/* Freighter silhouette */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        initial={reduce ? false : { opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <AircraftSilhouette
          variant="b747"
          color="var(--dhl-ink)"
          className="opacity-90"
        />
      </motion.div>

      {/* Dashed loading path */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <line
          x1="6"
          y1="72"
          x2="58"
          y2="64"
          stroke="var(--dhl-red)"
          strokeWidth="0.6"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>

      {/* Secondary pallet drifting in for depth */}
      <motion.div
        className="absolute bottom-[6%] right-[10%]"
        initial={reduce ? false : { opacity: 0, x: -60, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <UldIllustration
            shape="pallet"
            accent="var(--dhl-yellow)"
            size={120}
            className="opacity-95 drop-shadow-sm sm:size-[150px]"
          />
        </motion.div>
      </motion.div>

      {/* Hero container being loaded — slides in from the left, then floats */}
      <motion.div
        className="absolute left-[2%] top-[14%]"
        initial={reduce ? false : { opacity: 0, x: -120, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <UldIllustration
            shape="container"
            accent="var(--dhl-red)"
            size={150}
            className="drop-shadow-md sm:size-[190px]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
