"use client"

import { PostHogProvider, usePostHog } from "posthog-js/react"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (!pathname || !posthog) return

    let url = globalThis.window.origin + pathname
    if (searchParams?.toString()) {
      url = url + `?${searchParams.toString()}`
    }

    // Capture pageview with extended properties
    posthog.capture("$pageview", {
      $current_url: url,
      $referrer: document.referrer,
      $referring_domain: document.referrer ? new URL(document.referrer).hostname : "",
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      device_pixel_ratio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      user_agent: navigator.userAgent,
      connection_type: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType || "unknown",
    })

    // Track scroll depth
    let maxScrollDepth = 0
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent
      }
    }

    // Track time on page and scroll depth on leave
    const startTime = Date.now()
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      posthog.capture("page_engagement", {
        pathname,
        time_on_page_seconds: timeOnPage,
        max_scroll_depth_percent: maxScrollDepth,
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [pathname, searchParams, posthog])

  return null
}

export function PHProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!posthogKey || !posthogHost) {
    return <>{children}</>
  }

  return (
    <PostHogProvider
      apiKey={posthogKey}
      options={{
        api_host: posthogHost,
        person_profiles: "always", // Track all visitors, not just identified ones
        capture_pageview: false, // We handle this manually in PostHogPageView
        capture_pageleave: true, // Track when users leave pages

        // Autocapture everything
        autocapture: {
          dom_event_allowlist: ["click", "change", "submit"],
          url_allowlist: [".*"],
          element_allowlist: ["a", "button", "form", "input", "select", "textarea", "label"],
          css_selector_allowlist: ["[ph-autocapture]", "[data-track]", "[class*='btn']", "[class*='button']", "[class*='link']"],
          capture_copied_text: true, // Track when users copy text
        },

        // Dead clicks and rage clicks
        capture_dead_clicks: true, // Track clicks that don't do anything
        rageclick: true, // Track rapid frustration clicks

        // Session recording - comprehensive
        session_recording: {
          recordCrossOriginIframes: true,
          maskAllInputs: false,
          maskTextSelector: "[data-private]",
          collectFonts: true,
        },

        // Performance and vitals
        capture_performance: true, // Web vitals, resource timing, etc.

        // Heatmaps and scroll tracking
        enable_heatmaps: true,

        disable_session_recording: false,
        persistence: "localStorage+cookie",
        cross_subdomain_cookie: true,
        debug: process.env.NODE_ENV === "development",
      }}
    >
      <PostHogPageView />
      {children}
    </PostHogProvider>
  )
}
