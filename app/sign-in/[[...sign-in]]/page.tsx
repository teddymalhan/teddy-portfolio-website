import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SignInContent } from './sign-in-content'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access the admin dashboard',
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen" />}>
      <SignInContent />
    </Suspense>
  )
}
