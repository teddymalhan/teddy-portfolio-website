import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  try {
    // Protect admin routes - require authentication
    if (isAdminRoute(req)) {
      await auth.protect()
    }

    // Helper function to add security headers
    const addSecurityHeaders = (response: NextResponse) => {
      // Content Security Policy
      // Allows: self, Clerk (including custom domains), Vercel Analytics/Live, Google Fonts, Vercel Blob, and necessary inline scripts
       const csp = [
         "default-src 'self'",
         "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.malhan.ca https://vitals.vercel-insights.com https://vercel.live https://va.vercel-scripts.com blob:",
         "worker-src 'self' blob:",
         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
         "font-src 'self' https://fonts.gstatic.com data:",
         "img-src 'self' data: https: blob:",
         "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.malhan.ca https://vitals.vercel-insights.com https://vercel.live https://*.vercel-storage.com https://clerk-telemetry.com",
         "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.malhan.ca https://vercel.live https://*.vercel-storage.com",
         "object-src 'none'",
         "base-uri 'self'",
         "form-action 'self'",
         "frame-ancestors 'none'",
         "upgrade-insecure-requests",
       ].join('; ')

      response.headers.set('Content-Security-Policy', csp)
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
      
      return response
    }

    // Intercept resume PDF requests to use dynamic resume
    if (req.nextUrl.pathname === '/Teddy_Malhan_Resume.pdf') {
      // Preserve query parameters (for cache-busting)
      const rewriteUrl = new URL('/api/resume/file', req.url)
      rewriteUrl.search = req.nextUrl.search // Preserve query params
      const rewriteResponse = NextResponse.rewrite(rewriteUrl)
      return addSecurityHeaders(rewriteResponse)
    }

    // Add security headers to all other responses
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  } catch (error) {
    // If middleware fails, still return a response with security headers
    console.error('Middleware error:', error)
    const response = NextResponse.next()
    // Add basic security headers even on error
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  }
})

export const config = {
  matcher: [
    // Explicitly match the resume PDF
    '/Teddy_Malhan_Resume.pdf',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
