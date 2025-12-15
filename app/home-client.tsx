"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { ProjectsBento } from "@/components/projects-bento"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { TechMascots } from "@/components/tech-mascots"
import Footer from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState, useRef } from "react"

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
      <AnimatedBackground isActive={isHeroVisible} />
      <FloatingElements isActive={isHeroVisible} />
      <TechMascots />

      <div className="relative z-10">
        <Navigation isResumeVisible={isResumeVisible} />
        <main>
          <Hero isResumeVisible={isResumeVisible} />
          <div className="relative bg-background">
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <Experience />
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <ProjectsBento />
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <About />
            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
            <Footer isResumeVisible={isResumeVisible} />
          </div>
        </main>
      </div>
    </div>
  )
}
