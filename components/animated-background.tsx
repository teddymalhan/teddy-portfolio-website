"use client";

import { useTheme } from "next-themes";

export function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Light mode: lightish professional blue
  // Dark mode: slate colors
  const lightModeGradient = `
    radial-gradient(ellipse 90% 90% at 20% 20%, rgba(147, 197, 253, 0.5) 0%, transparent 50%),
    radial-gradient(ellipse 90% 90% at 80% 70%, rgba(191, 219, 254, 0.5) 0%, transparent 50%)
  `;
  
  const darkModeGradient = `
    radial-gradient(ellipse 90% 90% at 20% 20%, rgba(100, 116, 139, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse 90% 90% at 80% 70%, rgba(148, 163, 184, 0.6) 0%, transparent 50%)
  `;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 h-screen"
      style={{
        background: isDark ? darkModeGradient : lightModeGradient,
      }}
    />
  );
}
