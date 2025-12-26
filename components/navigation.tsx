"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 0.4,
              delay: index * 0.08,
              ease: [0.32, 0.72, 0, 1],
            }
      }
      className="last:border-b-0"
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
    </motion.div>
  );
}

export function Navigation({ isResumeVisible }: { isResumeVisible: boolean }) {
  // Get state from Zustand store using selective subscriptions
  const resumePath = useNavigationStore((state) => state.resumePath);
  const activeSection = useNavigationStore((state) => state.activeSection);
  const isMobileMenuOpen = useNavigationStore((state) => state.isMobileMenuOpen);
  const canvasDimensions = useNavigationStore((state) => state.canvasDimensions);
  const commandOpen = useNavigationStore((state) => state.commandOpen);
  const isVisible = useNavigationStore((state) => state.isVisible);

  // Get actions from store
  const {
    handleScroll: handleScrollAction,
    setIsMobileMenuOpen,
    setCommandOpen,
    updateCanvasDimensions,
    fetchResumePath,
  } = useNavigationStore();

  const conductorRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      handleScrollAction(!!prefersReducedMotion, navItems);
    };

    globalThis.window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Check initial position
    return () => {
      globalThis.window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScrollAction, prefersReducedMotion]);

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setIsMounted(true);
    
    // Set initial dimensions
    updateCanvasDimensions();

    // Update on resize
    globalThis.window.addEventListener("resize", updateCanvasDimensions);
    globalThis.window.addEventListener(
      "orientationchange",
      updateCanvasDimensions,
    );

    return () => {
      globalThis.window.removeEventListener("resize", updateCanvasDimensions);
      globalThis.window.removeEventListener(
        "orientationchange",
        updateCanvasDimensions,
      );
    };
  }, [updateCanvasDimensions]);

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

  // Fetch resume path with cache-busting
  useEffect(() => {
    fetchResumePath(isResumeVisible);
  }, [isResumeVisible, fetchResumePath]);

  const scrollToSection = (href: string) => {
    const sectionId = href.slice(1);
    const element = document.getElementById(sectionId);
    if (element) {
      // Show navigation temporarily for smooth UX
      useNavigationStore.getState().setIsVisible(true);

      // Add offset for desktop to account for fixed navigation bar
      const isMobile = globalThis.window.innerWidth < 768; // md breakpoint
      const navBarHeight = 80; // Approximate height of the navigation bar
      const additionalOffset = 20; // Extra pixels for breathing room
      const offset = isMobile ? 0 : navBarHeight + additionalOffset;

      // Calculate target position
      const targetPosition =
        element.getBoundingClientRect().top +
        globalThis.window.pageYOffset -
        offset;

      // Use native smooth scrolling - GPU accelerated and fast
      globalThis.window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const triggerConfetti = () => {
    if (conductorRef.current) {
      conductorRef.current.run({ speed: 3, duration: 1000 });
    }
  };

  const handleConfettiInit = ({ conductor }: { conductor: any }) => {
    conductorRef.current = conductor;
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setCommandOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandOpen, setCommandOpen, setIsMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        aria-label="Primary navigation"
        className="hidden md:block fixed left-0 right-0 z-50"
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
                  <motion.button
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
                  </motion.button>
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
      </motion.nav>

      {/* Mobile Navigation - Using CSS transitions for faster TTI */}
      <header
        className={cn(
          "md:hidden fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 transition-all duration-300 bg-gradient-to-r from-card/90 via-card/80 to-card/90 dark:from-card/95 dark:via-card/90 dark:to-card/95 backdrop-blur-xl border border-border dark:border-border/90 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10",
            isMobileMenuOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl",
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={toggleMobileMenu}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              aria-label="Mobile navigation"
              className="md:hidden fixed top-[76px] left-4 right-4 z-40 bg-gradient-to-r from-card/95 via-card/90 to-card/95 dark:from-card/98 dark:via-card/95 dark:to-card/98 backdrop-blur-xl border border-border/50 dark:border-border/90 rounded-b-2xl rounded-t-none shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10 p-6 max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <MobileNavAccordionItem
                    key={item.name}
                    item={item}
                    index={index}
                    scrollToSection={scrollToSection}
                    prefersReducedMotion={!!prefersReducedMotion}
                  />
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Command Dialog - Lazy loaded */}
      {commandOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
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
