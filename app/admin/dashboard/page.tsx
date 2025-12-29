"use client";

// Force dynamic rendering - this page requires authentication
export const dynamic = "force-dynamic";

import { useAuth, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  const prefersReducedMotion = useReducedMotion();

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
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          className="text-muted-foreground"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <AnimatedThemeToggler />
              <SignOutButton>
                <Button variant="outline" size="sm" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your resume and site settings
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ResumeManager />
        </motion.main>
      </div>
    </div>
  );
}
