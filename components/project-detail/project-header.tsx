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
            <Badge className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold shadow-lg border-0">
              <Trophy className="w-3 h-3 mr-1" />
              {project.award}
            </Badge>
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
