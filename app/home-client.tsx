"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Separator } from "@/components/ui/separator"
import { AnimatedBackground } from "@/components/animated-background"
import { lazy, Suspense, useLayoutEffect, useState } from "react"

// Lazy load non-critical sections for better initial load performance
const Experience = lazy(() => import("@/components/experience").then(mod => ({ default: mod.Experience })))
const ProjectsBento = lazy(() => import("@/components/projects-bento").then(mod => ({ default: mod.ProjectsBento })))
const About = lazy(() => import("@/components/about").then(mod => ({ default: mod.About })))
const Footer = lazy(() => import("@/components/footer").then(mod => ({ default: mod.default })))

interface HomeClientProps {
  isResumeVisible: boolean
}

export function HomeClient({ isResumeVisible }: HomeClientProps) {
  const [isReady, setIsReady] = useState(false)

  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("homeScrollPosition")

    if (savedScrollPosition) {
      sessionStorage.removeItem("homeScrollPosition")
      const scrollY = parseInt(savedScrollPosition, 10)

      // Restore scroll position and wait for it to apply
      window.scrollTo(0, scrollY)

      // Small delay to ensure scroll takes effect before showing content
      requestAnimationFrame(() => {
        setIsReady(true)
      })
    } else {
      setIsReady(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-muted to-background relative overflow-hidden">
      <AnimatedBackground />

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
