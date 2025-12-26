"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TextHighlighter } from "@/components/fancy/text/text-highlighter";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function Hero({ isResumeVisible }: { isResumeVisible: boolean }) {
  const [resumePath, setResumePath] = useState("/Teddy_Malhan_Resume.pdf");

  useEffect(() => {
    async function fetchResumePath() {
      try {
        const res = await fetch("/api/resume", {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
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

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
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
              />
              <TextHighlighter
                highlightColor="rgb(212, 40, 55)"
                className="text-white px-2 py-1 rounded font-bold"
                instant={true}
              >
                simon fraser university
              </TextHighlighter>
            </span>
            , graduating{" "}
            <TextHighlighter
              highlightColor="rgb(16, 185, 129)"
              className="text-white px-2 py-1 rounded font-bold"
              instant={true}
            >
              2027
            </TextHighlighter>
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
              />
              <TextHighlighter
                highlightColor="rgb(37, 99, 235)"
                className="text-white px-2 py-1 rounded font-bold"
                instant={true}
              >
                electronic arts
              </TextHighlighter>
            </span>{" "}
            &{" "}
            <span className="inline-flex items-center gap-1">
              <Image
                src="/dialpad-logo.jpg"
                alt="Dialpad logo"
                width={20}
                height={20}
                className="w-5 h-5 rounded"
              />
              <TextHighlighter
                highlightColor="rgb(147, 51, 234)"
                className="text-white px-2 py-1 rounded font-bold"
                instant={true}
              >
                dialpad
              </TextHighlighter>
            </span>
          </h2>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isResumeVisible && (
              <InteractiveHoverButton
                onClick={() => {
                  // Force fresh fetch by adding current timestamp
                  const freshUrl = resumePath.includes("&t=")
                    ? `${resumePath.split("&t=")[0]}&t=${Date.now()}`
                    : `${resumePath}?t=${Date.now()}`;
                  window.open(freshUrl, "_blank", "noopener,noreferrer");
                }}
                className="bg-teal-700 hover:bg-amber-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 [&>div>div]:bg-white [&>div>div]:opacity-90 [&>div:last-child]:bg-amber-600 [&>div:last-child]:text-white"
              >
                view resume!
              </InteractiveHoverButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
