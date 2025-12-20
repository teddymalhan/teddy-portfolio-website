"use client";

import { useEffect, useState } from "react";
import { Transition } from "motion/react";
import * as motion from "motion/react-client";
import { useTechMascotsStore, type Mascot } from "@/stores";

export function TechMascots() {
  // Get state and actions from Zustand store
  const mascots = useTechMascotsStore((state) => state.mascots);
  const initializeMascots = useTechMascotsStore(
    (state) => state.initializeMascots,
  );
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    initializeMascots();
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setShouldAnimate(!event.matches);
    };
    
    setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMotionChange);
    
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, [initializeMascots]);

  // Page Visibility API to pause when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setShouldAnimate(!document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
              offsetPath: shouldAnimate ? `path("${mascot.path}")` : undefined,
            }}
            className="opacity-80"
            initial={{ offsetDistance: `${mascot.initialPosition}%` }}
            animate={
              shouldAnimate
                ? {
                    offsetDistance: ["0%", "100%", "0%"], // Complete cycle animation
                  }
                : {}
            }
            transition={shouldAnimate ? transition : { duration: 0 }}
          >
            {mascot.emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
