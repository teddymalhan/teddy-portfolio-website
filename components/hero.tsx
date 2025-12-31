import Image from "next/image";
import { InstantHighlighter } from "@/components/fancy/text/instant-highlighter";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ChevronDown } from "lucide-react";

export function Hero({ isResumeVisible }: { isResumeVisible: boolean }) {
  // Resume path is handled by Navigation component, no need to fetch here
  // This reduces initial client-side JavaScript execution

  const scrollToExperience = () => {
    const experienceSection = document.getElementById("experience");
    if (experienceSection) {
      const y = experienceSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen h-dvh w-full overflow-hidden flex items-center justify-center"
    >
      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl text-center">
          {/* Heading */}
          <h1 className="text-6xl tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-7xl font-bold mb-6 text-foreground drop-shadow-lg">
            <span className="relative inline-flex flex-wrap items-center justify-center gap-2">
              <span className="text-foreground drop-shadow-md">
                hi!
              </span>
              <span className="text-foreground drop-shadow-md">
                i&apos;m teddy!
              </span>
              <span
                style={{ transformOrigin: "70% 70%", display: "inline-block", transform: "rotate(20deg)" }}
              >
                👋
              </span>
            </span>
          </h1>

          {/* Description - CS Major */}
          <h2 className="text-foreground/90 text-xl md:text-2xl mb-4 font-medium drop-shadow-md">
            cs major @{" "}
            <span className="inline-flex items-center gap-1">
              <Image
                src="/sfu-logo.jpg"
                alt="SFU logo"
                width={20}
                height={20}
                className="w-5 h-5 rounded-full"
                priority
                fetchPriority="high"
              />
              <InstantHighlighter
                highlightColor="rgb(212, 40, 55)"
                className="text-white px-2 py-1 rounded font-bold"
              >
                simon fraser university
              </InstantHighlighter>
            </span>
            , graduating{" "}
            <InstantHighlighter
              highlightColor="rgb(16, 185, 129)"
              className="text-white px-2 py-1 rounded font-bold"
            >
              2027
            </InstantHighlighter>
          </h2>

          {/* Description - Previous Experience */}
          <h2 className="text-foreground/90 text-xl md:text-2xl mb-8 font-medium drop-shadow-md">
            prev. swe intern at{" "}
            <span className="inline-flex items-center gap-1">
              <Image
                src="/ea-logo.jpg"
                alt="EA logo"
                width={20}
                height={20}
                className="w-5 h-5 rounded-full"
                priority
                fetchPriority="high"
              />
              <InstantHighlighter
                highlightColor="rgb(37, 99, 235)"
                className="text-white px-2 py-1 rounded font-bold"
              >
                electronic arts
              </InstantHighlighter>
            </span>{" "}
            &{" "}
            <span className="inline-flex items-center gap-1">
              <Image
                src="/dialpad-logo.jpg"
                alt="Dialpad logo"
                width={20}
                height={20}
                className="w-5 h-5 rounded"
                priority
                fetchPriority="high"
              />
              <InstantHighlighter
                highlightColor="rgb(147, 51, 234)"
                className="text-white px-2 py-1 rounded font-bold"
              >
                dialpad
              </InstantHighlighter>
            </span>
          </h2>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isResumeVisible && (
              <InteractiveHoverButton
                onClick={() => {
                  // Use navigation store's resume path or fallback
                  const timestamp = Date.now();
                  window.open(`/Teddy_Malhan_Resume.pdf?t=${timestamp}`, "_blank", "noopener,noreferrer");
                }}
                className="bg-teal-700 hover:bg-amber-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 [&>div>div]:bg-white [&>div>div]:opacity-90 [&>div:last-child]:bg-amber-600 [&>div:last-child]:text-white"
              >
                view resume!
              </InteractiveHoverButton>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToExperience}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 group cursor-pointer"
        aria-label="Scroll to experience"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            scroll
          </span>
          <div className="relative">
            <ChevronDown 
              className="h-6 w-6 text-muted-foreground animate-bounce group-hover:text-foreground transition-colors duration-300" 
              strokeWidth={1.5}
            />
          </div>
        </div>
      </button>
    </section>
  );
}
