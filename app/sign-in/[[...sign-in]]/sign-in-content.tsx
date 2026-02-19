"use client"

import { SignIn } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignInWithParams() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/'
  return <SignIn fallbackRedirectUrl={redirectUrl} />
}

export function SignInContent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={null}>
        <SignInWithParams />
      </Suspense>
    </div>
  )
}
