"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/projects";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mb-16"
    >
      {/* Large hero image - Cluely style */}
      <div className="relative -mx-6 lg:-mx-16 xl:-mx-24">
        <div className="relative aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/8] rounded-2xl overflow-hidden mx-4 lg:mx-8 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>

    </motion.section>
  );
}
