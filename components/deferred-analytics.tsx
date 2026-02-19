"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { PHProvider } from "./posthog-provider"

/**
 * Deferred Analytics Component
 * Loads Vercel Analytics and SpeedInsights after user interaction or idle time
 * This improves initial page load performance by deferring non-critical scripts
 */
export default function DeferredAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Load analytics after user interaction or after idle time
    const loadAnalytics = () => {
      setShouldLoad(true)
      // Clean up event listeners once loaded
      cleanup()
    }

    // Interaction events that trigger loading
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"]
    
    const cleanup = () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadAnalytics, { capture: true })
      })
    }

    // Add event listeners for user interaction
    events.forEach((event) => {
      window.addEventListener(event, loadAnalytics, { capture: true, once: true, passive: true })
    })

    // Also load after idle time (requestIdleCallback) or timeout fallback
    let idleCallbackId: number | undefined
    let timeoutId: NodeJS.Timeout | undefined

    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(loadAnalytics, { timeout: 3000 })
    } else {
      // Fallback for browsers without requestIdleCallback (Safari)
      timeoutId = setTimeout(loadAnalytics, 2000)
    }

    return () => {
      cleanup()
      if (idleCallbackId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId)
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  if (!shouldLoad) {
    return null
  }

  return (
    <PHProvider>
      <Analytics />
      <SpeedInsights />
    </PHProvider>
  )
}


