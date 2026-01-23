"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { Project } from "@/lib/projects";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProjectNavigationProps {
  project: Project;
}

// Create a slug from section title for IDs
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProjectNavigation({ project }: ProjectNavigationProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
      }
    );

    // Observe all sections
    project.sections.forEach((section) => {
      const element = document.getElementById(createSlug(section.title));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [project.sections]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleBackClick = () => {
    router.push("/");
  };

  const scrollToSection = (sectionTitle: string) => {
    const sectionId = createSlug(sectionTitle);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const targetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
            {/* Left side - Back button */}
            <button
              onClick={handleBackClick}
              className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Center - Section links */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
              {project.sections.map((section) => {
                const sectionId = createSlug(section.title);
                return (
                  <button
                    key={section.title}
                    onClick={() => scrollToSection(section.title)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap ${
                      activeSection === sectionId
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {section.emoji && <span className="mr-1">{section.emoji}</span>}
                    {section.title.toLowerCase()}
                  </button>
                );
              })}
            </div>

            {/* Right side - Theme Toggle */}
            <AnimatedThemeToggler className="w-9 h-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200 shrink-0" />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Using CSS transitions for faster TTI */}
      <header
        className={cn(
          "lg:hidden fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out",
          "opacity-100 translate-y-0"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 transition-all duration-300",
            // Solid background on mobile for performance, blur only on capable devices
            "bg-card/98 supports-[backdrop-filter]:bg-card/90 supports-[backdrop-filter]:backdrop-blur-md",
            "dark:bg-card supports-[backdrop-filter]:dark:bg-card/95",
            "border border-border dark:border-border/90 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10",
            // GPU acceleration for smoother animations
            "transform-gpu backface-hidden",
            isMobileMenuOpen ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-2xl",
          )}
          style={{ willChange: "transform" }}
        >
          <button
            onClick={handleBackClick}
            className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler className="w-9 h-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200" />
            <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors duration-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {/* CSS-only hamburger/X animation for faster interactivity */}
              <div className="w-5 h-5 flex items-center justify-center relative">
                <span
                  className={cn(
                    "absolute w-5 h-0.5 bg-foreground rounded-full transition-all duration-200",
                    isMobileMenuOpen ? "rotate-45" : "-translate-y-1"
                  )}
                />
                <span
                  className={cn(
                    "absolute w-5 h-0.5 bg-foreground rounded-full transition-all duration-200",
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute w-5 h-0.5 bg-foreground rounded-full transition-all duration-200",
                    isMobileMenuOpen ? "-rotate-45" : "translate-y-1"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - no blur for mobile performance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-background/90 z-40"
              onClick={toggleMobileMenu}
            />

            {/* Menu Content - solid bg for mobile performance */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              aria-label="Mobile navigation"
              className="lg:hidden fixed top-[75px] left-4 right-4 z-40 bg-card dark:bg-card border border-t-0 border-border/50 dark:border-border/90 rounded-b-2xl rounded-t-none shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10 dark:ring-t-0 p-6 max-h-[calc(100vh-120px)] overflow-y-auto transform-gpu"
            >
              <div className="space-y-2">
                {project.sections.map((section, index) => {
                  const sectionId = createSlug(section.title);
                  return (
                    <motion.div
                      key={section.title}
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1 }}
                      transition={
                        prefersReducedMotion
                          ? undefined
                          : {
                              duration: 0.15,
                              delay: index * 0.03,
                            }
                      }
                      className="last:border-b-0 transform-gpu"
                    >
                      <button
                        onClick={() => scrollToSection(section.title)}
                        className="w-full py-3 px-4 flex items-center group hover:bg-primary/10 hover:text-primary rounded-full transition-colors duration-200"
                      >
                        <span
                          className={cn(
                            "text-sm font-medium tracking-wide flex items-center gap-2",
                            activeSection === sectionId
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          {section.emoji && <span>{section.emoji}</span>}
                          {section.title.toLowerCase()}
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
