"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
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
  UserPlus,
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

const navItems = [
  { name: "🏠 home", href: "#home", emoji: "" },
  { name: "💼 my experience", href: "#experience", emoji: "" },
  { name: "🛠️ projects", href: "#projects", emoji: "" },
  { name: "👤 about me", href: "#about", emoji: "" },
];

export function Navigation({ isResumeVisible }: { isResumeVisible: boolean }) {
  const [resumePath, setResumePath] = useState("/Teddy_Malhan_Resume.pdf");
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [commandOpen, setCommandOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMorphed, setIsMorphed] = useState(false);
  const [isNavContentVisible, setIsNavContentVisible] = useState(true);
  const conductorRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Navigation always visible on both mobile and desktop
      setIsVisible(true);

      setLastScrollY(scrollPosition);

      // Calculate scroll progress with smooth easing and edge case handling
      const heroHeight = windowHeight;
      const morphStart = 0;
      const morphEnd = heroHeight * 0.25; // 25% threshold

      // Binary state: either fully up (0) or fully down (1) - no partial states
      let rawProgress = (scrollPosition - morphStart) / morphEnd;
      let wasMorphed = rawProgress >= 0.5;

      // Only update if state has changed
      if (wasMorphed === isMorphed) {
        // State unchanged, skip update
      } else if (prefersReducedMotion) {
        // State has changed, handle update with reduced motion
        // Skip fade animation for reduced motion
        setIsMorphed(wasMorphed);
        const progress = wasMorphed ? 1 : 0;
        setScrollProgress(progress);
        setIsNavContentVisible(true);
      } else {
        // State has changed, handle update with full animation
        // Fade out all navigation content first
        setIsNavContentVisible(false);
        // Wait for fade out to complete, then update position
        setTimeout(() => {
          setIsMorphed(wasMorphed);
          const progress = wasMorphed ? 1 : 0;
          setScrollProgress(progress);
          // Wait for morph transition to complete, then fade back in
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsNavContentVisible(true);
              });
            });
          }, 200); // Wait for morph transition (0.2s) to complete
        }, 100); // Fade out duration
      }

      // If near top, mark home as active
      if (scrollPosition < windowHeight / 2) {
        setActiveSection("home");
        return;
      }

      // Check which section we're currently in
      let currentSection = "";
      for (const item of navItems) {
        const sectionId = item.href.slice(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementHeight = rect.height;
          const navOffset = 100; // Offset for navigation bar

          // Check if the section is currently in the viewport
          if (
            scrollPosition + navOffset >= elementTop &&
            scrollPosition + navOffset < elementTop + elementHeight
          ) {
            currentSection = sectionId;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    globalThis.window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Re-check on resize
    handleScroll(); // Check initial position
    return () => {
      globalThis.window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [lastScrollY, isMorphed, prefersReducedMotion]);

  useEffect(() => {
    const updateCanvasDimensions = () => {
      setCanvasDimensions({
        width: globalThis.window.innerWidth,
        height: globalThis.window.innerHeight,
      });
    };

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
  }, []);

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
    async function fetchResumePath() {
      try {
        const res = await fetch("/api/resume", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          // Use resume ID + timestamp as cache-buster - ensures fresh fetch every time
          const timestamp = Date.now();
          setResumePath(`/Teddy_Malhan_Resume.pdf?v=${data.id}&t=${timestamp}`);
        }
      } catch (error) {
        console.error("Failed to fetch resume info:", error);
        // Fallback to timestamp-based cache-busting
        setResumePath(`/Teddy_Malhan_Resume.pdf?t=${Date.now()}`);
      }
    }

    if (isResumeVisible) {
      fetchResumePath();
    }
  }, [isResumeVisible]);

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
      setIsVisible(true);

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
        setCommandOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setCommandOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
          top: prefersReducedMotion ? "1rem" : `${scrollProgress}rem`,
          paddingLeft: prefersReducedMotion
            ? "1.5rem"
            : `${scrollProgress * 1.5}rem`,
          paddingRight: prefersReducedMotion
            ? "1.5rem"
            : `${scrollProgress * 1.5}rem`,
          transition: prefersReducedMotion
            ? undefined
            : "top 0.2s cubic-bezier(0.5, 1, 0.89, 1), padding-left 0.2s cubic-bezier(0.5, 1, 0.89, 1), padding-right 0.2s cubic-bezier(0.5, 1, 0.89, 1)",
        }}
      >
        <div
          className={`bg-gradient-to-r from-card/90 via-card/80 to-card/90 dark:from-card/95 dark:via-card/90 dark:to-card/95 backdrop-blur-xl border border-border/50 dark:border-border/90 px-6 py-3 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10`}
          style={(() => {
            const shouldUseMorphedStyle = prefersReducedMotion || isMorphed;

            let borderRadius: string;
            if (shouldUseMorphedStyle) {
              borderRadius = "9999px";
            } else {
              borderRadius = "0px";
            }

            let maxWidth: string;
            if (shouldUseMorphedStyle) {
              maxWidth = "1152px";
            } else {
              maxWidth = "100%";
            }

            let marginLeft: string;
            if (shouldUseMorphedStyle) {
              marginLeft = "auto";
            } else {
              marginLeft = "0";
            }

            let marginRight: string;
            if (shouldUseMorphedStyle) {
              marginRight = "auto";
            } else {
              marginRight = "0";
            }

            return {
              borderRadius,
              maxWidth,
              marginLeft,
              marginRight,
              minHeight: "60px",
              transition: prefersReducedMotion
                ? undefined
                : "border-radius 0.2s cubic-bezier(0.5, 1, 0.89, 1), max-width 0.2s cubic-bezier(0.5, 1, 0.89, 1), margin-left 0.2s cubic-bezier(0.5, 1, 0.89, 1), margin-right 0.2s cubic-bezier(0.5, 1, 0.89, 1)",
            };
          })()}
        >
          <div
            className="flex items-center justify-between"
            style={{
              transition: prefersReducedMotion
                ? undefined
                : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1)",
            }}
          >
            {/* Left side - Logo and Navigation */}
            <motion.div
              initial={false}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      opacity: isNavContentVisible ? 1 : 0,
                      visibility: isNavContentVisible ? "visible" : "hidden",
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 0.1,
                      ease: [0.5, 1, 0.89, 1],
                    }
              }
              className="flex items-center gap-6"
              style={{
                transition: prefersReducedMotion
                  ? undefined
                  : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1)",
                pointerEvents: isNavContentVisible ? "auto" : "none",
              }}
            >
              <button
                onClick={triggerConfetti}
                className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
                aria-label="Trigger confetti"
                style={{
                  transition: prefersReducedMotion
                    ? undefined
                    : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1), transform 0.2s ease",
                }}
              >
                🧸
              </button>

              <div
                className="flex space-x-1"
                role="menubar"
                aria-label="Sections"
                style={{
                  transition: prefersReducedMotion
                    ? undefined
                    : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1)",
                }}
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
                    style={{
                      transition: prefersReducedMotion
                        ? undefined
                        : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1), transform 0.2s ease, colors 0.2s ease",
                    }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right side - Search Bar, Auth, and Theme Toggle */}
            <motion.div
              initial={false}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      opacity: isNavContentVisible ? 1 : 0,
                      visibility: isNavContentVisible ? "visible" : "hidden",
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 0.1,
                      ease: [0.5, 1, 0.89, 1],
                    }
              }
              className="flex items-center gap-3"
              style={{
                transition: prefersReducedMotion
                  ? undefined
                  : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1)",
                pointerEvents: isNavContentVisible ? "auto" : "none",
              }}
            >
              <button
                onClick={() => setCommandOpen(true)}
                className="flex items-center gap-3 px-4 py-2 text-sm bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground text-muted-foreground"
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

              <div
                style={{
                  transition: prefersReducedMotion
                    ? undefined
                    : "all 0.4s cubic-bezier(0.5, 1, 0.89, 1)",
                }}
              >
                <AnimatedThemeToggler className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        role="nav"
        aria-label="Mobile"
        className="md:hidden fixed top-4 left-0 right-0 z-50 px-6"
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
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-card/90 via-card/80 to-card/90 dark:from-card/95 dark:via-card/90 dark:to-card/95 backdrop-blur-xl rounded-full border border-border/50 dark:border-border/90 px-6 py-3 shadow-lg dark:shadow-2xl dark:shadow-black/30 shadow-blue-500/10 dark:ring-1 dark:ring-white/10">
          <div className="flex items-center justify-between">
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-foreground hover:text-primary hover:bg-accent/20 transition-all duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-gradient-to-br from-background/95 via-background/90 to-card/95 backdrop-blur-xl"
            style={{ paddingTop: "100px" }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              id="mobile-menu"
              className="flex flex-col items-center justify-center h-full space-y-6 px-8"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              role="none"
              tabIndex={-1}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center gap-4 text-xl font-medium text-foreground hover:text-primary transition-colors py-4 px-6 rounded-2xl hover:bg-accent/10 w-full max-w-xs justify-center"
                  aria-label={`Go to ${item.name}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
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
    </>
  );
}
