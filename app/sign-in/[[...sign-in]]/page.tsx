"use client"

import { SignIn } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/'

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn fallbackRedirectUrl={redirectUrl} />
    </div>
  )
}