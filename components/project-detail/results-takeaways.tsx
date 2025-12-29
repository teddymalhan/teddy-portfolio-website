"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, Lightbulb } from "lucide-react";
import type { Project } from "@/lib/projects";

interface ResultsTakeawaysProps {
  project: Project;
}

export function ResultsTakeaways({ project }: ResultsTakeawaysProps) {
  const prefersReducedMotion = useReducedMotion();
  const hasResults = project.results && project.results.length > 0;
  const hasTakeaways = project.takeaways && project.takeaways.length > 0;

  if (!hasResults && !hasTakeaways) return null;

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16 pt-12 border-t border-border"
    >
      <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">
        Results & Takeaways
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        {hasResults && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Results
            </h3>
            <ul className="space-y-3">
              {project.results!.map((result, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasTakeaways && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {project.takeaways!.map((takeaway, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.section>
  );
}
