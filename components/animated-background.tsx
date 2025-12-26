"use client";

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
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
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
