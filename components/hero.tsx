"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TextHighlighter } from "@/components/fancy/text/text-highlighter";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function Hero({ isResumeVisible }: { isResumeVisible: boolean }) {
  const [resumePath, setResumePath] = useState("/Teddy_Malhan_Resume.pdf");

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

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl text-center">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-7xl font-bold mb-6 text-foreground drop-shadow-lg"
          >
            <span className="relative inline-flex flex-wrap items-center justify-center gap-2">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="text-foreground drop-shadow-md"
              >
                hi!
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-foreground drop-shadow-md"
              >
                i&apos;m teddy!
              </motion.span>
              <motion.span
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 20 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                style={{ transformOrigin: "70% 70%", display: "inline-block" }}
              >
                👋
              </motion.span>
            </span>
          </motion.h1>

          {/* Description - CS Major */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-foreground/90 text-xl md:text-2xl mb-4 font-medium drop-shadow-md"
          >
            cs major @{" "}
            <span className="inline-flex items-center gap-1">
              <img
                src="https://praxis.encommun.io/media/notes/note_12478/sfu.jpg"
                alt="SFU logo"
                className="w-5 h-5 rounded-full"
              />
              <TextHighlighter
                highlightColor="rgb(212, 40, 55)"
                className="text-white px-2 py-1 rounded font-bold"
              >
                simon fraser university
              </TextHighlighter>
            </span>
            , graduating{" "}
            <TextHighlighter
              highlightColor="rgb(16, 185, 129)"
              className="text-white px-2 py-1 rounded font-bold"
            >
              2027
            </TextHighlighter>
          </motion.h2>

          {/* Description - Previous Experience */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-foreground/90 text-xl md:text-2xl mb-8 font-medium drop-shadow-md"
          >
            prev. swe intern at{" "}
            <span className="inline-flex items-center gap-1">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5EbAYJ4fnvZp8PBJa0gDeO7uEvmlAJjurig&s"
                alt="EA logo"
                className="w-5 h-5 rounded-full"
              />
              <TextHighlighter
                highlightColor="rgb(37, 99, 235)"
                className="text-white px-2 py-1 rounded font-bold"
              >
                electronic arts
              </TextHighlighter>
            </span>{" "}
            &{" "}
            <span className="inline-flex items-center gap-1">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzji6wOPSF5w3pA8ATOaizQN2w-wFIs8FhKA&s"
                alt="Dialpad logo"
                className="w-5 h-5 rounded"
              />
              <TextHighlighter
                highlightColor="rgb(147, 51, 234)"
                className="text-white px-2 py-1 rounded font-bold"
              >
                dialpad
              </TextHighlighter>
            </span>
          </motion.h2>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {isResumeVisible && (
              <InteractiveHoverButton
                onClick={() => {
                  // Force fresh fetch by adding current timestamp
                  const freshUrl = resumePath.includes("&t=")
                    ? `${resumePath.split("&t=")[0]}&t=${Date.now()}`
                    : `${resumePath}?t=${Date.now()}`;
                  window.open(freshUrl, "_blank", "noopener,noreferrer");
                }}
                className="bg-teal-600 hover:bg-amber-500 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 [&>div>div]:bg-amber-400 [&>div:last-child]:bg-amber-500"
              >
                view resume!
              </InteractiveHoverButton>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
