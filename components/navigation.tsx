"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Search,
  Home,
  Hammer,
  Briefcase,
  Mail,
  FileText,
  Github,
  Linkedin,
  LogIn,
  Shield,
  LogOut,
} from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/stores";
import { cn } from "@/lib/utils";

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
      className="border-b border-border/50 last:border-b-0"
    >
      <button
        onClick={() => {
          scrollToSection(item.href);
        }}
        className="w-full py-4 flex items-center group hover:bg-secondary/50 rounded-lg transition-colors duration-200"
      >
        <span className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
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
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
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

  // Cubic bezier easing function for smooth scrolling
  // Evaluates cubic-bezier(0.5, 1, 0.89, 1) at progress t (0 to 1)
  const cubicBezierEase = (t: number): number => {
    // Cubic bezier control points: (0.5, 1, 0.89, 1)
    // P0 = (0, 0), P1 = (0.5, 1), P2 = (0.89, 1), P3 = (1, 1)
    const p1x = 0.5;
    const p1y = 1;
    const p2x = 0.89;
    const p2y = 1;

    // Binary search to find the t value that gives us the desired x
    // We need to find t such that bezier_x(t) = input_t
    let start = 0;
    let end = 1;
    const targetX = t;

    // Binary search for the t parameter that gives us targetX
    for (let i = 0; i < 14; i++) {
      const mid = (start + end) / 2;
      // Evaluate bezier x at mid: Bx(t) = 3(1-t)²t*p1x + 3(1-t)t²*p2x + t³
      const oneMinusT = 1 - mid;
      const bezierX =
        3 * oneMinusT * oneMinusT * mid * p1x +
        3 * oneMinusT * mid * mid * p2x +
        mid * mid * mid;

      if (bezierX < targetX) {
        start = mid;
      } else {
        end = mid;
      }
    }

    // Now evaluate bezier y at the found t
    const tParam = (start + end) / 2;
    const oneMinusT = 1 - tParam;
    const bezierY =
      3 * oneMinusT * oneMinusT * tParam * p1y +
      3 * oneMinusT * tParam * tParam * p2y +
      tParam * tParam * tParam;

    return bezierY;
  };

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

      // Use getBoundingClientRect for accurate positioning with complex layouts
      const targetPosition =
        element.getBoundingClientRect().top +
        globalThis.window.pageYOffset -
        offset;
      const startPosition = globalThis.window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 180; // milliseconds
      let startTime: number | null = null;

      // Custom scroll animation with cubic-bezier easing
      const animateScroll = (currentTime: number) => {
        startTime ??= currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Apply cubic-bezier easing: cubic-bezier(0.5, 1, 0.89, 1)
        const easedProgress = cubicBezierEase(progress);

        const currentPosition = startPosition + distance * easedProgress;
        globalThis.window.scrollTo(0, currentPosition);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      if (prefersReducedMotion) {
        // Fallback to instant scroll for reduced motion preference
        globalThis.window.scrollTo({
          top: targetPosition,
          behavior: "auto",
        });
      } else {
        globalThis.requestAnimationFrame(animateScroll);
      }
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

  const runCommand = (command: () => void) => {
    setCommandOpen(false);
    command();
  };

  const handleAdminClick = () => {
    if (isSignedIn) {
      router.push("/admin/dashboard");
    } else {
      router.push("/sign-in?redirect_url=/admin/dashboard");
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        role="nav"
        aria-label="Primary"
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

              <div
                className="flex space-x-1"
                role="menubar"
                aria-label="Sections"
              >
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

      {/* Mobile Navigation */}
      <motion.header
        className="md:hidden fixed top-4 left-4 right-4 z-50"
        initial={prefersReducedMotion ? false : { y: 0, opacity: 1 }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: isVisible ? 0 : -100,
                opacity: isVisible ? 1 : 0,
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 0.3,
                ease: "easeInOut",
              }
        }
      >
        <motion.div
          className={cn(
            "flex items-center justify-between px-4 py-3 transition-colors duration-300",
            isMobileMenuOpen ? "bg-card/95 shadow-lg shadow-primary/5 rounded-t-2xl rounded-b-none" : "bg-card/90 shadow-md shadow-primary/5 rounded-2xl",
          )}
          layout
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          <button
            onClick={triggerConfetti}
            className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
            aria-label="Trigger confetti"
          >
            🧸
          </button>

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center" />
            <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors duration-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <X className="w-5 h-5 text-foreground" strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hamburger"
                      initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                      className="flex flex-col gap-1"
                    >
                      <span className="w-5 h-0.5 bg-foreground rounded-full" />
                      <span className="w-5 h-0.5 bg-foreground rounded-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.header>

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
              className="md:hidden fixed inset-0 bg-background/80 z-40"
              onClick={toggleMobileMenu}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="md:hidden fixed top-[76px] left-4 right-4 z-40 bg-card/95 rounded-b-2xl rounded-t-none shadow-xl shadow-primary/5 p-6 max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              <div className="space-y-0">
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

      {/* Command Dialog */}
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Search Portfolio"
        description="Quickly navigate to any section or find what you're looking for"
      >
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => scrollToSection("#home"))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => scrollToSection("#experience"))}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>My Experience</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => scrollToSection("#projects"))}
            >
              <Hammer className="mr-2 h-4 w-4" />
              <span>Projects</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => scrollToSection("#about"))}
            >
              <Mail className="mr-2 h-4 w-4" />
              <span>About Me</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            {isResumeVisible && (
              <CommandItem
                onSelect={() =>
                  runCommand(() => {
                    // Force fresh fetch by adding current timestamp
                    const freshUrl = resumePath.includes("&t=")
                      ? `${resumePath.split("&t=")[0]}&t=${Date.now()}`
                      : `${resumePath}?t=${Date.now()}`;
                    window.open(freshUrl, "_blank", "noopener,noreferrer");
                  })
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Download Resume</span>
              </CommandItem>
            )}
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  window.open("https://github.com/teddymalhan", "_blank");
                })
              }
            >
              <Github className="mr-2 h-4 w-4" />
              <span>View GitHub Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  window.open("https://linkedin.com/in/teddymalhan", "_blank");
                })
              }
            >
              <Linkedin className="mr-2 h-4 w-4" />
              <span>Connect on LinkedIn</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Authentication">
            {!isSignedIn ? (
              <>
                <CommandItem
                  onSelect={() => runCommand(() => router.push("/sign-in"))}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </CommandItem>
              </>
            ) : (
              <>
                <CommandItem onSelect={() => runCommand(handleAdminClick)}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() => signOut(() => router.push("/")))
                  }
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </CommandItem>
              </>
            )}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Fun">
            <CommandItem onSelect={() => runCommand(() => triggerConfetti())}>
              <span className="mr-2">🎉</span>
              <span>Trigger Confetti</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Confetti Component */}
      {isMounted && (
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
      )}
    </>
  );
}
