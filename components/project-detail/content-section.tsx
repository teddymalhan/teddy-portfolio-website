"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ContentSection as ContentSectionType } from "@/lib/projects";

interface ContentSectionProps {
  section: ContentSectionType;
  index: number;
}

export function ContentSection({ section, index }: ContentSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
        {section.title}
      </h2>

      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {section.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-2 mt-4 ml-2">
            {section.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  );
}
