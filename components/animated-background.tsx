"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark mode: slate colors
  const darkModeGradient = `
    radial-gradient(ellipse 90% 90% at 20% 20%, rgba(100, 116, 139, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse 90% 90% at 80% 70%, rgba(148, 163, 184, 0.6) 0%, transparent 50%)
  `;

  // Don't render gradient until mounted to avoid hydration mismatch
  const background = mounted && resolvedTheme === "dark" ? darkModeGradient : "transparent";

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 h-screen"
      style={{ background }}
    />
  );
}
