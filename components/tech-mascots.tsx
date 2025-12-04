"use client";

import { useEffect } from "react";
import { Transition } from "motion/react";
import * as motion from "motion/react-client";
import { useTechMascotsStore, type Mascot } from "@/stores";

export function TechMascots() {
  // Get state and actions from Zustand store
  const mascots = useTechMascotsStore((state) => state.mascots);
  const initializeMascots = useTechMascotsStore(
    (state) => state.initializeMascots,
  );

  useEffect(() => {
    initializeMascots();
  }, [initializeMascots]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {mascots.map((mascot) => {
        const transition: Transition = {
          duration: mascot.duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear", // Changed to linear for consistent speed
          delay: mascot.delay,
        };

        return (
          <motion.div
            key={mascot.id}
            style={{
              width: mascot.size,
              height: mascot.size,
              fontSize: mascot.size * 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0,
              filter: "drop-shadow(0 4px 12px rgba(100, 255, 218, 0.3))",
              zIndex: 1,
              offsetPath: `path("${mascot.path}")`,
            }}
            className="opacity-80"
            initial={{ offsetDistance: `${mascot.initialPosition}%` }}
            animate={{
              offsetDistance: ["0%", "100%", "0%"], // Complete cycle animation
            }}
            transition={transition}
          >
            {mascot.emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
