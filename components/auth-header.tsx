"use client"

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function AuthHeader() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  
  const handleAdminClick = () => {
    if (isSignedIn) {
      router.push('/admin/dashboard')
    } else {
      // Redirect to sign in page with dashboard as redirect after auth
      router.push('/sign-in?redirect_url=/admin/dashboard')
    }
  }
  
  return (
    <header className="flex items-center gap-2">
      {!isSignedIn ? (
        <div className="flex gap-2">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdminClick}
            className="gap-2"
          >
            <Shield className="w-4 h-4" />
            Admin
          </Button>
          <UserButton />
        </div>
      )}
    </header>
  )
}


