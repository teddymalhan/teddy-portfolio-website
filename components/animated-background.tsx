"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BlobProps extends React.HTMLAttributes<HTMLDivElement> {
  firstBlobColor: string;
  secondBlobColor: string;
  isActive?: boolean;
}

interface AnimatedBackgroundProps {
  isActive?: boolean;
}

export function AnimatedBackground({
  isActive = true,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isActiveRef = useRef(isActive);

  // Update ref when isActive changes
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isPaused = false;
    let isVisible = true;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Intersection Observer to pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (!isVisible && animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Page Visibility API to pause when tab is inactive
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (isPaused && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? "#3B82F6" : "#6366F1",
      });
    }


    const animate = () => {
      // Only animate if active, visible, and tab is not hidden
      if (!isActiveRef.current || !isVisible || isPaused) {
        if (isActiveRef.current && isVisible && !isPaused) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(${particle.color === "#3B82F6" ? "59, 130, 246" : "99, 102, 241"}, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Animate opacity
        particle.opacity += (Math.random() - 0.5) * 0.01;
        particle.opacity = Math.max(0.05, Math.min(0.4, particle.opacity));
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = ((100 - distance) / 100) * 0.1;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: "transparent" }}
      />
      {/* Blurry blob animations */}
      <div className="absolute top-1/4 left-1/4">
        <BlurryBlob
          firstBlobColor="bg-cyan-400"
          secondBlobColor="bg-blue-500"
          isActive={isActive}
        />
      </div>
      <div className="absolute bottom-1/3 right-1/4">
        <BlurryBlob
          firstBlobColor="bg-purple-400"
          secondBlobColor="bg-pink-500"
          isActive={isActive}
        />
      </div>
      <div className="absolute top-1/2 right-1/3">
        <BlurryBlob
          firstBlobColor="bg-indigo-400"
          secondBlobColor="bg-violet-500"
          isActive={isActive}
        />
      </div>
    </div>
  );
}

export function BlurryBlob({
  className,
  firstBlobColor,
  secondBlobColor,
  isActive = true,
}: BlobProps) {
  return (
    <div className="min-h-52 min-w-52 items-center justify-center">
      <div className="relative w-full max-w-lg">
        <div
          className={cn(
            "absolute -right-24 -top-28 h-72 w-72 animate-pop-blob rounded-sm bg-blue-400 p-8 opacity-45 mix-blend-multiply blur-3xl filter",
            className,
            firstBlobColor,
          )}
          style={{ animationPlayState: isActive ? "running" : "paused" }}
        ></div>
        <div
          className={cn(
            "absolute -left-40 -top-64 h-72 w-72 animate-pop-blob rounded-sm bg-purple-400 p-8 opacity-45 mix-blend-multiply blur-3xl filter",
            className,
            secondBlobColor,
          )}
          style={{ animationPlayState: isActive ? "running" : "paused" }}
        ></div>
      </div>
    </div>
  );
}
