"use client";

import { useEffect, useRef, useState, lazy, Suspense, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useNavigationStore } from "@/stores";
import { cn } from "@/lib/utils";

// Lazy load heavy components since they're not critical for initial render
const Fireworks = lazy(() => import("react-canvas-confetti/dist/presets/fireworks"));
const CommandPalette = lazy(() => import("@/components/command-palette"));

const navItems = [
  { name: "🏠 home", href: "#home", emoji: "" },
  { name: "💼 my experience", href: "#experience", emoji: "" },
  { name: "🛠️ projects", href: "#projects", emoji: "" },
  { name: "👤 about me", href: "#about", emoji: "" },
];

function MobileNavAccordionItem({
  item,
  index,
  scrollToSection,
  prefersReducedMotion,
}: {
  item: { name: string; href: string; emoji: string };
  index: number;
  scrollToSection: (href: string) => void;
  prefersReducedMotion: boolean;
}) {
  return (
    <m.div
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
        onClick={() => {
          scrollToSection(item.href);
        }}
        className="w-full py-3 px-4 flex items-center group hover:bg-primary/10 hover:text-primary rounded-full transition-colors duration-200"
      >
        <span className="text-sm font-medium tracking-wide text-foreground flex items-center gap-2">
          {item.emoji && <span>{item.emoji}</span>}
          <span>{item.name.replace(/^[^\s]+\s/, "")}</span>
        </span>
      </button>
    </m.div>
  );
}

interface NavProps {
  scrollToSection: (href: string) => void;
  triggerConfetti: () => void;
  prefersReducedMotion: boolean;
  isResumeVisible: boolean;
}

function DesktopNavigation({ scrollToSection, triggerConfetti, prefersReducedMotion }: NavProps) {
  const activeSection = useNavigationStore((state) => state.activeSection);
  const isVisible = useNavigationStore((state) => state.isVisible);
  const setCommandOpen = useNavigationStore((state) => state.setCommandOpen);

  return (
    <m.nav
      aria-label="Primary navigation"
      className="hidden lg:block fixed left-0 right-0 z-50"
      initial={prefersReducedMotion ? false : { opacity: 1 }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : -20,
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 0.2,
              ease: [0.5, 1, 0.89, 1],
            }
      }
      style={{
        top: "1rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      <div
        className={`bg-gradient-to-r from-card/90 via-card/80 to-card/90 dark:from-card/95 dark:via-card/90 dark:to-card/95 backdrop-blur-xl border border-border/50 dark:border-border/90 px-6 py-3 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10 rounded-full max-w-[1152px] mx-auto`}
        style={{
          minHeight: "60px",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={triggerConfetti}
              className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
              aria-label="Trigger confetti"
            >
              🧸
            </button>

            <div className="flex space-x-1" aria-label="Sections">
              {navItems.map((item) => (
                <m.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    activeSection === item.href.slice(1)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  aria-current={
                    activeSection === item.href.slice(1) ? "page" : undefined
                  }
                  aria-label={`Go to ${item.name}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </m.button>
              ))}
            </div>
          </div>

          {/* Right side - Search Bar, Auth, and Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium bg-background border border-border rounded-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors duration-200"
              style={{
                minWidth: "240px",
              }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Search website...</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                <span className="text-xs">⌘</span>
                <span className="text-xs">K</span>
              </div>
            </button>

            <AnimatedThemeToggler className="w-9 h-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200" />
          </div>
        </div>
      </div>
    </m.nav>
  );
}

function MobileNavHeader({ triggerConfetti }: { triggerConfetti: () => void }) {
  const isVisible = useNavigationStore((state) => state.isVisible);
  const isMobileMenuOpen = useNavigationStore((state) => state.isMobileMenuOpen);
  const setIsMobileMenuOpen = useNavigationStore((state) => state.setIsMobileMenuOpen);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header
      className={cn(
        "lg:hidden fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-all duration-300",
          "bg-card/98 supports-[backdrop-filter]:bg-card/90 supports-[backdrop-filter]:backdrop-blur-md",
          "dark:bg-card supports-[backdrop-filter]:dark:bg-card/95",
          "border border-border dark:border-border/90 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10",
          "transform-gpu backface-hidden",
          isMobileMenuOpen ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-2xl",
        )}
      >
        <button
          onClick={triggerConfetti}
          className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
          aria-label="Trigger confetti"
        >
          🧸
        </button>

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="w-9 h-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200" />
          <button
            onClick={toggleMobileMenu}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors duration-200"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
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
  );
}

function MobileMenuPanel({
  scrollToSection,
  prefersReducedMotion,
}: {
  scrollToSection: (href: string) => void;
  prefersReducedMotion: boolean;
}) {
  const isMobileMenuOpen = useNavigationStore((state) => state.isMobileMenuOpen);
  const setIsMobileMenuOpen = useNavigationStore((state) => state.setIsMobileMenuOpen);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-background/90 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <m.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            aria-label="Mobile navigation"
            className="lg:hidden fixed top-[75px] left-4 right-4 z-40 bg-card dark:bg-card border border-t-0 border-border/50 dark:border-border/90 rounded-b-2xl rounded-t-none shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10 dark:ring-t-0 p-6 max-h-[calc(100vh-120px)] overflow-y-auto transform-gpu"
          >
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <MobileNavAccordionItem
                  key={item.name}
                  item={item}
                  index={index}
                  scrollToSection={scrollToSection}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </m.nav>
        </>
      )}
    </AnimatePresence>
  );
}

export function Navigation({ isResumeVisible }: { isResumeVisible: boolean }) {
  const {
    handleScroll: handleScrollAction,
    setIsMobileMenuOpen,
    updateCanvasDimensions,
    fetchResumePath,
    toggleCommand,
    handleEscape,
  } = useNavigationStore();

  const isMobileMenuOpen = useNavigationStore((state) => state.isMobileMenuOpen);
  const commandOpen = useNavigationStore((state) => state.commandOpen);
  const resumePath = useNavigationStore((state) => state.resumePath);
  const canvasDimensions = useNavigationStore((state) => state.canvasDimensions);

  const conductorRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      handleScrollAction(!!prefersReducedMotion, navItems);
    };

    globalThis.window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      globalThis.window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScrollAction, prefersReducedMotion]);

  useEffect(() => {
    setIsMounted(true);
    updateCanvasDimensions();
    globalThis.window.addEventListener("resize", updateCanvasDimensions);
    globalThis.window.addEventListener("orientationchange", updateCanvasDimensions);
    return () => {
      globalThis.window.removeEventListener("resize", updateCanvasDimensions);
      globalThis.window.removeEventListener("orientationchange", updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

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

  useEffect(() => {
    fetchResumePath(isResumeVisible);
  }, [isResumeVisible, fetchResumePath]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommand();
      } else if (e.key === "Escape") {
        handleEscape();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommand, handleEscape]);

  const scrollToSection = useCallback((href: string) => {
    const sectionId = href.slice(1);
    const element = document.getElementById(sectionId);
    if (element) {
      useNavigationStore.getState().setIsVisible(true);
      const offset = sectionId === "experience" ? 40 : 20;
      const targetPosition =
        element.getBoundingClientRect().top +
        globalThis.window.pageYOffset -
        offset;
      globalThis.window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  }, [prefersReducedMotion, setIsMobileMenuOpen]);

  const triggerConfetti = () => {
    if (conductorRef.current) {
      conductorRef.current.run({ speed: 3, duration: 1000 });
    }
  };

  const handleConfettiInit = ({ conductor }: { conductor: any }) => {
    conductorRef.current = conductor;
  };

  const navProps: NavProps = {
    scrollToSection,
    triggerConfetti,
    prefersReducedMotion: !!prefersReducedMotion,
    isResumeVisible,
  };

  return (
    <>
      <DesktopNavigation {...navProps} />
      <MobileNavHeader triggerConfetti={triggerConfetti} />
      <MobileMenuPanel
        scrollToSection={scrollToSection}
        prefersReducedMotion={!!prefersReducedMotion}
      />

      {/* Command Dialog - Lazy loaded */}
      {commandOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            open={commandOpen}
            onOpenChange={(open: boolean) => useNavigationStore.getState().setCommandOpen(open)}
            isResumeVisible={isResumeVisible}
            resumePath={resumePath}
            scrollToSection={scrollToSection}
            triggerConfetti={triggerConfetti}
          />
        </Suspense>
      )}

      {/* Confetti Component - Lazy loaded */}
      {isMounted && (
        <Suspense fallback={null}>
          <Fireworks
            onInit={handleConfettiInit}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            style={{
              position: "fixed",
              pointerEvents: "none",
              top: 0,
              left: 0,
              zIndex: 9999,
            }}
          />
        </Suspense>
      )}
    </>
  );
}
