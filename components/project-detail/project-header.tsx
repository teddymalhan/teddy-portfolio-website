"use client";

import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/projects";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="mb-12"
    >
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to projects</span>
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {project.title}
          </h1>
          {project.award && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            >
              <Badge className="bg-foreground text-background dark:bg-background dark:text-foreground font-medium px-3 py-1.5 rounded-full border-0 text-sm flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                {project.award}
              </Badge>
            </motion.div>
          )}
        </div>

        <p className="text-lg text-muted-foreground">{project.period}</p>

        {project.tagline && (
          <p className="text-xl text-muted-foreground max-w-2xl mt-2">
            {project.tagline}
          </p>
        )}
      </div>
    </motion.header>
  );
}
