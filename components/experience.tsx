"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "./ui/badge";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  logo: string;
  logoStyle?: "circular" | "square" | "padded";
  tags?: string[];
}

// Using local images to avoid external DNS lookups and improve caching
const experiences: ExperienceItem[] = [
  {
    company: "Electronic Arts",
    role: "Software Engineer Intern",
    period: "May 2025 - Aug 2025",
    location: "Vancouver, BC",
    logo: "/ea-logo-full.jpg",
    logoStyle: "padded",
    tags: ["🕹️ EADP Arrival"],
  },
  {
    company: "Dialpad",
    role: "Software Engineer Intern",
    period: "Jan 2025 - Apr 2025",
    location: "Vancouver, BC",
    logo: "/dialpad-logo-full.jpg",
    logoStyle: "square",
    tags: ["💼 Supervisor Team"],
  },
  {
    company: "SFU Blueprint",
    role: "Software Developer",
    period: "Nov 2025 - Present",
    location: "Vancouver, BC",
    logo: "https://media.licdn.com/dms/image/v2/D560BAQGUjTCDhAjcFA/company-logo_200_200/company-logo_200_200/0/1690849546053/sfu_blueprint_logo?e=2147483647&v=beta&t=JFlsmyor7g50Tsl22WLuHPB8UODRlSMUKJ91Ek3vOxU",
    logoStyle: "padded",
    tags: ["💻 Blueprint Website"],
  },
  {
    company: "Develop for Good",
    role: "Engineering Manager",
    period: "Sept 2024 - Feb 2025",
    location: "Remote",
    logo: "/dfg-logo.png",
    logoStyle: "padded",
    tags: ["🐈 Forgotten Felines of Sonoma County"],
  },
  {
    company: "Simon Fraser University",
    role: "Computer Science",
    period: "Expected May 2027",
    location: "Burnaby, BC",
    logo: "/sfu-logo.jpg",
    logoStyle: "circular",
    tags: ["📚 Education"],
  },
];

export function Experience() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      id="experience"
      className="min-h-screen will-change-[transform,opacity]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-20">
        {/* Header */}
        <h1 className="text-5xl font-bold tracking-tight text-left text-foreground mb-8">
          Experience
        </h1>

        {/* Experience List */}
        <div className="space-y-16">
          {experiences.map((experience, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16 border-b border-border/30 pb-16 last:border-0 last:pb-0"
            >
              {/* Left side - Date & Location */}
              <div className="space-y-0.5">
                <div className="text-foreground/90 font-medium text-[15px] tracking-tight">
                  {experience.period}
                </div>
                <div className="text-foreground/80 text-[14px]">
                  {experience.location}
                </div>
              </div>

              {/* Right side - Company Details */}
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <h2 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
                      {experience.company}
                    </h2>
                    <p className="text-muted-foreground/90 text-[17px] font-normal">
                      {experience.role}
                    </p>
                  </div>

                  {/* Badge (emoji + team) inspired by outlined pill */}
                  {experience.tags && experience.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {experience.tags.map((tag: string) => {
                        const emojiMatch = tag.match(
                          /^[\p{Emoji}\p{Extended_Pictographic}]/u,
                        );
                        const emoji = emojiMatch?.[0];
                        const text = emoji
                          ? tag.replace(emoji, "").trim()
                          : tag;
                        return (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="gap-1.5 px-3 py-2 rounded-full border-border/60 text-foreground/85 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/40 whitespace-normal break-words max-w-[240px] sm:max-w-none"
                          >
                            {emoji && (
                              <span className="text-[15px] leading-none">
                                {emoji}
                              </span>
                            )}
                            <span className="text-[13.5px] leading-snug font-medium tracking-tight">
                              {text}
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="p-[2px] rounded-2xl bg-[linear-gradient(135deg,hsl(var(--ring))_0%,transparent_40%,transparent_60%,hsl(var(--ring))_100%)]">
                    <div
                      className={`relative w-16 h-16 flex items-center justify-center overflow-hidden bg-background/80 border border-border/40 shadow-sm
                        ${
                          experience.logoStyle === "circular"
                            ? "rounded-full"
                            : experience.logoStyle === "padded"
                              ? "rounded-2xl p-2.5"
                              : "rounded-xl"
                        }`}
                    >
                      <div className={`relative w-full h-full`}>
                        <Image
                          src={experience.logo}
                          alt={`${experience.company} logo`}
                          fill
                          className={
                            experience.company === "Electronic Arts"
                              ? "object-cover scale-185"
                              : experience.company === "Develop for Good"
                                ? "object-cover scale-180"
                                : experience.company === "SFU Blueprint"
                                  ? "object-cover scale-180"
                                  : experience.logoStyle === "circular"
                                    ? "object-cover"
                                    : "object-contain"
                          }
                          sizes="64px"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
