"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState, useRef, lazy, Suspense } from "react"

// Lazy load heavy animation components
const AnimatedBackground = lazy(() => import("@/components/animated-background").then(mod => ({ default: mod.AnimatedBackground })))

// Lazy load non-critical sections for better initial load performance
const Experience = lazy(() => import("@/components/experience").then(mod => ({ default: mod.Experience })))
const ProjectsBento = lazy(() => import("@/components/projects-bento").then(mod => ({ default: mod.ProjectsBento })))
const About = lazy(() => import("@/components/about").then(mod => ({ default: mod.About })))
const Footer = lazy(() => import("@/components/footer").then(mod => ({ default: mod.default })))

interface HomeClientProps {
  isResumeVisible: boolean
}

export function HomeClient({ isResumeVisible }: HomeClientProps) {
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Find the hero section by its id
    const heroSection = document.getElementById("home")
    if (!heroSection) return

    heroRef.current = heroSection

    // Set up Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if hero section is visible (with some threshold)
          // We'll consider it visible if at least 20% is in view
          setIsHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.2)
        })
      },
      {
        threshold: [0, 0.2, 0.5, 1], // Multiple thresholds for smoother transitions
        rootMargin: "0px", // No margin
      }
    )

    observer.observe(heroSection)

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-muted to-background relative overflow-hidden">
      <Suspense fallback={null}>
        <AnimatedBackground isActive={isHeroVisible} />
      </Suspense>

      <div className="relative z-10">
        <Navigation isResumeVisible={isResumeVisible} />
        <main>
          <Hero isResumeVisible={isResumeVisible} />
          <div className="relative bg-background">
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="lazy-section">
              <Suspense fallback={<div className="min-h-screen" />}>
                <Experience />
              </Suspense>
            </div>
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="lazy-section">
              <Suspense fallback={<div className="min-h-screen" />}>
                <ProjectsBento />
              </Suspense>
            </div>
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="lazy-section">
              <Suspense fallback={<div className="py-24" />}>
                <About />
              </Suspense>
            </div>
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <Suspense fallback={null}>
              <Footer isResumeVisible={isResumeVisible} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
