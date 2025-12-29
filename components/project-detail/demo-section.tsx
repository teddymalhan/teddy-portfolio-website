"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ProjectMedia } from "@/lib/projects";

interface DemoSectionProps {
  media: ProjectMedia;
}

export function DemoSection({ media }: DemoSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="my-16"
    >
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
        {media.type === "video" ? (
          <video
            src={media.src}
            className="w-full aspect-video object-cover"
            controls
            playsInline
            preload="metadata"
          />
        ) : media.type === "gif" ? (
          <Image
            src={media.src}
            alt={media.alt}
            width={1920}
            height={1080}
            className="w-full aspect-video object-cover"
            unoptimized
          />
        ) : (
          <div className="relative aspect-video">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {media.caption && (
          <div className="px-4 py-3 bg-muted/30 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              {media.caption}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
