"use client";

import { useEffect, useState } from "react";
import { TextHighlighter } from "@/components/fancy/text/text-highlighter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
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
    <>
      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(10px) translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translateY(4px) scale(0.3);
          }
          50% {
            opacity: 0.7;
            transform: translateY(4px) scale(1.05);
          }
          70% {
            opacity: 0.9;
            transform: translateY(4px) scale(0.95);
          }
          85% {
            opacity: 1;
            transform: translateY(4px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(4px) scale(1);
          }
        }

        @keyframes rotateHand {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(20deg);
          }
        }
      `}</style>
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative"
      >
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 text-balance">
              <span className="relative inline-block pb-2">
                hi! i&apos;m teddy!{" "}
                <span
                  style={{
                    display: "inline-block",
                    animation:
                      "rotateHand 1s linear(0, 0.315 10.5%, 0.502 18.4%, 0.567 22.2%, 0.613 25.9%, 0.64 29.6%, 0.65 33.3%, 0.628 39.2%, 0.563 45.6%, 0.202 67.6%, 0.082 77.1%, 0.041 82.1%, 0.016 87.2%, 0.003 92.7%, 0) forwards",
                    transformOrigin: "70% 70%",
                  }}
                >
                  👋
                </span>
                {/* <svg 
                className="absolute bottom-0 left-0 w-full h-8 overflow-visible" 
                viewBox="0 0 438.6328125 70.77084350585938"
                preserveAspectRatio="none"
                style={{ 
                  transform: 'translateY(4px)',
                  opacity: 0,
                  animation: 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
                  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))'
                }}
              >
                <g transform="translate(10 60.770843505859375) rotate(0 209.31640625 -25.385421752929688)">
                  <path 
                    fill="none"
                    className="stroke-[#575757] dark:stroke-foreground" 
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      filter: 'url(#pencilTexture)'
                    }}
                    d="M -1.15,-2.90 Q -1.15,-2.90 4.01,-4.87 9.17,-6.85 19.05,-10.34 28.94,-13.84 39.33,-16.90 49.72,-19.95 62.75,-22.68 75.78,-25.42 88.70,-27.25 101.62,-29.08 112.66,-29.96 123.70,-30.84 132.85,-30.88 142.00,-30.91 150.18,-30.08 158.35,-29.25 165.08,-27.62 171.80,-26.00 177.09,-24.10 182.38,-22.21 190.16,-19.06 197.94,-15.91 206.88,-13.38 215.82,-10.84 227.49,-9.67 239.16,-8.51 253.72,-8.99 268.29,-9.47 285.09,-12.02 301.90,-14.58 321.37,-19.44 340.84,-24.30 357.59,-29.83 374.34,-35.36 384.94,-39.39 395.54,-43.42 401.58,-46.05 407.63,-48.68 410.39,-50.14 413.15,-51.61 415.17,-52.77 417.20,-53.93 417.74,-54.08 418.28,-54.22 418.84,-54.19 419.40,-54.15 419.92,-53.94 420.44,-53.73 420.87,-53.36 421.29,-52.99 421.58,-52.51 421.87,-52.02 421.98,-51.47 422.10,-50.92 422.03,-50.37 421.97,-49.81 421.73,-49.30 421.49,-48.79 421.10,-48.39 420.71,-47.98 420.21,-47.72 419.71,-47.46 419.15,-47.38 418.60,-47.29 418.04,-47.39 417.49,-47.48 417.00,-47.75 416.50,-48.02 416.12,-48.43 415.74,-48.84 415.50,-49.35 415.27,-49.87 415.22,-50.43 415.16,-50.98 415.29,-51.53 415.41,-52.08 415.71,-52.56 416.00,-53.04 416.43,-53.40 416.86,-53.76 417.39,-53.96 417.91,-54.16 418.47,-54.19 419.03,-54.22 419.57,-54.06 420.11,-53.91 420.58,-53.59 421.04,-53.27 421.38,-52.82 421.71,-52.37 421.89,-51.83 422.06,-51.30 422.06,-50.73 422.05,-50.17 421.87,-49.64 421.68,-49.11 421.34,-48.67 420.99,-48.22 420.53,-47.91 420.06,-47.60"
                  />
                </g>
                <defs>
                  <filter id="pencilTexture" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.0"/>
                    <feGaussianBlur stdDeviation="0.3" result="blur"/>
                  </filter>
                </defs>
              </svg> */}
              </span>
            </h1>

            <h2 className="text-xl md:text-2xl mb-6 font-medium text-foreground">
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
            </h2>

            <h2 className="text-xl md:text-2xl mb-6 font-medium text-foreground">
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
            </h2>
          </div>

          {isResumeVisible && (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
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
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() =>
                window.open("https://linkedin.com/in/teddymalhan", "_blank")
              }
              className="fill rounded-md p-2"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                window.open("https://github.com/teddymalhan", "_blank")
              }
              className="fill rounded-md p-2"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
