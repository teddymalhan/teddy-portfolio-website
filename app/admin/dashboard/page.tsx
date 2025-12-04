"use client";

// Force dynamic rendering - this page requires authentication
export const dynamic = "force-dynamic";

import { useAuth, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, StepBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ResumeManager } from "@/components/admin/resume-manager";
import Link from "next/link";
import { handleApiResponse } from "@/lib/api-client";

export default function AdminDashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        console.log("Not signed in - redirecting to home");
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await handleApiResponse<{ authorized: boolean }>(response);

        if (!data.authorized) {
          console.log("Not authorized as admin");
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <StepBack className="w-4 h-4" />
                Go Back
              </Button>
            </Link>
          </div>
        </div>
        <ResumeManager />
      </div>
    </div>
  );
}
