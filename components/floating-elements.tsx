"use client";

import { useEffect, useRef } from "react";
import {
  useFloatingElementsStore,
  animateFloatingElements,
  type FloatingElement,
} from "@/stores";

interface FloatingElementsProps {
  isActive?: boolean;
}

export function FloatingElements({ isActive = true }: FloatingElementsProps) {
  // Get state and actions from Zustand store
  const elements = useFloatingElementsStore((state) => state.elements);
  const storeIsActive = useFloatingElementsStore((state) => state.isActive);
  const initializeElements = useFloatingElementsStore(
    (state) => state.initializeElements,
  );
  const updateAllElements = useFloatingElementsStore(
    (state) => state.updateAllElements,
  );
  const setIsActive = useFloatingElementsStore((state) => state.setIsActive);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  // Initialize elements on mount
  useEffect(() => {
    initializeElements();
  }, [initializeElements]);

  // Update store's isActive state when prop changes
  useEffect(() => {
    setIsActive(isActive);
  }, [isActive, setIsActive]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = globalThis.window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsActive(false);
      } else {
        setIsActive(isActive);
      }
    };
    
    if (mediaQuery.matches) {
      setIsActive(false);
    }
    
    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, [isActive, setIsActive]);

  // Shared animate function
  const createAnimateFunction = () => {
    return () => {
      const currentIsActive = useFloatingElementsStore.getState().isActive;
      if (!currentIsActive || isPausedRef.current) {
        return;
      }
      animateFloatingElements(updateAllElements, currentIsActive);
    };
  };

  // Page Visibility API to pause when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
      if (document.hidden && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (!document.hidden && storeIsActive && !intervalRef.current) {
        intervalRef.current = setInterval(createAnimateFunction(), 25);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [storeIsActive, updateAllElements]);

  // Animation loop
  useEffect(() => {
    if (!storeIsActive || isPausedRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const animate = createAnimateFunction();

    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start animation interval (40ms = ~25fps for less intensive animation)
    intervalRef.current = setInterval(animate, 40);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [storeIsActive, updateAllElements]);

  const renderElement = (element: FloatingElement) => {
    const style = {
      position: "absolute" as const,
      left: element.x,
      top: element.y,
      width: element.size,
      height: element.size,
      transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
      transition: "none",
      pointerEvents: "none" as const,
      zIndex: 1, // Ensure elements stay behind text content
    };

    switch (element.type) {
      case "cube":
        return (
          <div
            key={element.id}
            style={{
              ...style,
              background: `linear-gradient(135deg, ${element.color}, ${element.color}dd)`,
              boxShadow: `0 4px 20px ${element.color}33`,
              borderRadius: "8px",
            }}
            className="opacity-40" // Reduced opacity to be less distracting
          />
        );
      case "star":
        return (
          <div key={element.id} style={style} className="opacity-50">
            {" "}
            {/* Reduced opacity */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill={element.color}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      case "circle":
        return (
          <div
            key={element.id}
            style={{
              ...style,
              background: `radial-gradient(circle, ${element.color}, ${element.color}aa)`,
              borderRadius: "50%",
              boxShadow: `0 0 20px ${element.color}44`,
            }}
            className="opacity-30" // Reduced opacity
          />
        );
      case "triangle":
        return (
          <div key={element.id} style={style} className="opacity-40">
            {" "}
            {/* Reduced opacity */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill={element.color}
            >
              <path d="M12 2l10 18H2L12 2z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map(renderElement)}
    </div>
  );
}
