import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Teddy Malhan",
  description:
    "Software Engineer with experience at EA and Dialpad. Computer Science student at Simon Fraser University.",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧸</text></svg>",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ClerkProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              <Suspense fallback={null}>
                {children}
              </Suspense>
              <Analytics />
              <SpeedInsights />
            </div>
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  )
}
