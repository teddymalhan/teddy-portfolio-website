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
    posthog.capture("$pageview", {
      $current_url: url,
    })
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
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: {
          dom_event_allowlist: ["click", "change", "submit"],
          url_allowlist: [".*"],
          element_allowlist: ["a", "button", "form", "input", "select", "textarea", "label"],
          css_selector_allowlist: ["[ph-autocapture]"],
        },
        session_recording: {
          recordCrossOriginIframes: true,
          maskAllInputs: false,
          maskTextSelector: "[data-private]",
        },
        enable_heatmaps: true,
        disable_session_recording: false,
        capture_performance: true,
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
