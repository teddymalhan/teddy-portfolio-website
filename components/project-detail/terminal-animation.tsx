"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TerminalStep } from "@/lib/projects";

interface TerminalAnimationProps {
  steps: TerminalStep[];
  progressMessage?: string;
  className?: string;
}

export function TerminalAnimation({
  steps,
  progressMessage,
  className,
}: TerminalAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [completedSteps, setCompletedSteps] = useState<TerminalStep[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Show all immediately for reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setCompletedSteps(steps);
      setIsTyping(false);
      if (progressMessage) setShowProgress(true);
    }
  }, [prefersReducedMotion, steps, progressMessage]);

  // Typewriter effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (currentStepIndex >= steps.length) {
      setIsTyping(false);
      if (progressMessage) {
        const timeout = setTimeout(() => setShowProgress(true), 300);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const currentStep = steps[currentStepIndex];
    const delay = currentStep.delay || 30;

    if (displayedText.length < currentStep.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentStep.text.slice(0, displayedText.length + 1));
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setDisplayedText("");
        setCurrentStepIndex((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [currentStepIndex, displayedText, steps, prefersReducedMotion, progressMessage]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [completedSteps, displayedText, showProgress]);

  const getStepClasses = useCallback((type: TerminalStep["type"]) => {
    switch (type) {
      case "command":
        return "text-foreground";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "progress":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "rounded-xl overflow-hidden border border-border bg-card shadow-lg",
        className
      )}
    >
      {/* Terminal header - macOS style */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">
          terminal
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="p-4 font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto bg-background/50"
      >
        {completedSteps.map((step, i) => (
          <div key={i} className={cn("mb-1.5", getStepClasses(step.type))}>
            {step.type === "command" && (
              <span className="text-green-500 mr-2">$</span>
            )}
            {step.type === "success" && (
              <span className="mr-2">&#10003;</span>
            )}
            {step.text}
          </div>
        ))}

        {isTyping && currentStepIndex < steps.length && (
          <div
            className={cn(
              "mb-1.5",
              getStepClasses(steps[currentStepIndex].type)
            )}
          >
            {steps[currentStepIndex].type === "command" && (
              <span className="text-green-500 mr-2">$</span>
            )}
            {displayedText}
            <span className="animate-pulse ml-0.5">|</span>
          </div>
        )}

        {showProgress && progressMessage && (
          <div className="flex items-center gap-2 text-yellow-500 mt-3 pt-3 border-t border-border/50">
            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <span>{progressMessage}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
