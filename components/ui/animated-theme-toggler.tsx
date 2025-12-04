"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: Props) => {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsDark(theme === "dark")
  }, [theme])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    // Type assertion for View Transition API
    const doc = document as Document & { 
      startViewTransition?: (callback: () => void) => { ready: Promise<void> }
    }
    
    const updateTheme = () => {
      flushSync(() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        setIsDark(newTheme === "dark")
      })
    }

    if (doc.startViewTransition) {
      const transition = doc.startViewTransition(updateTheme)
      await transition.ready
    } else {
      updateTheme()
      return
    }

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    const easing = "cubic-bezier(0.5, 1, 0.89, 1)"
    
    // Animate the new view (expanding circle)
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing,
        pseudoElement: "::view-transition-new(root)",
      }
    )

    // Animate the old view (contracting circle) - reverse animation
    document.documentElement.animate(
      {
        clipPath: [
          `circle(${maxRadius}px at ${x}px ${y}px)`,
          `circle(0px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing,
        pseudoElement: "::view-transition-old(root)",
      }
    )
  }, [theme, setTheme])

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={cn(className)}>
      {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
    </button>
  )
}
