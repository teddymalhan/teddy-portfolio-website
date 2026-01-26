"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { Project } from "@/lib/projects";

interface ProjectNavigationProps {
  project: Project;
}

export function ProjectNavigation({ project }: ProjectNavigationProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        aria-label="Project navigation"
        className="hidden lg:block fixed left-0 right-0 z-50"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }
        }
        style={{
          top: "1rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div
          className="bg-gradient-to-r from-card/90 via-card/80 to-card/90 dark:from-card/95 dark:via-card/90 dark:to-card/95 backdrop-blur-xl border border-border/50 dark:border-border/90 px-6 py-3 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10 rounded-full max-w-[1152px] mx-auto"
          style={{
            minHeight: "60px",
          }}
        >
          <div className="flex items-center justify-between gap-6">
            {/* Back button */}
            <button
              onClick={handleBackClick}
              className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Theme Toggle */}
            <AnimatedThemeToggler className="w-9 h-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200 shrink-0" />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <header className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-card/98 supports-[backdrop-filter]:bg-card/90 supports-[backdrop-filter]:backdrop-blur-md dark:bg-card supports-[backdrop-filter]:dark:bg-card/95 border border-border dark:border-border/90 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10 rounded-2xl">
          <button
            onClick={handleBackClick}
            className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <AnimatedThemeToggler className="w-9 h-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200" />
        </div>
      </header>
    </>
  );
}
