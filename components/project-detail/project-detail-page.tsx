"use client";

import { Suspense, lazy } from "react";
import type { Project } from "@/lib/projects";
import { ProjectHeader } from "./project-header";
import { ProjectHero } from "./project-hero";
import { ProjectSidebar } from "./project-sidebar";
import { ContentSection } from "./content-section";

// Lazy load heavier components
const DemoSection = lazy(() =>
  import("./demo-section").then((m) => ({ default: m.DemoSection }))
);

interface ProjectDetailPageProps {
  project: Project;
}

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
        <ProjectHeader project={project} />

        <ProjectHero project={project} />

        {/* Demo Video/GIF */}
        {project.demoMedia && (
          <Suspense
            fallback={
              <div className="aspect-video bg-muted rounded-xl animate-pulse my-16" />
            }
          >
            <DemoSection media={project.demoMedia} />
          </Suspense>
        )}

        {/* Main Content with Sidebar */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
          <main>
            {project.sections.map((section, i) => (
              <ContentSection key={section.title} section={section} index={i} />
            ))}
          </main>

          <ProjectSidebar project={project} />
        </div>
      </div>
    </div>
  );
}
