"use client";

import React from "react";
import { useResetCountdown } from "@/hooks/useResetCountdown";

interface ResetCountdownProps {
  showIcon?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export const ResetCountdown = ({
  showIcon = true,
  className = "",
  variant = "default",
}: ResetCountdownProps) => {
  const { countdown, formattedTime, isResettingSoon } = useResetCountdown();

  if (variant === "compact") {
    return (
      <span
        className={`text-xs ${isResettingSoon ? "text-yellow-400" : "text-white/60"} ${className}`}
      >
        Resets {formattedTime}
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 ${className}`}
      >
        {showIcon && (
          <svg
            className={`h-4 w-4 ${isResettingSoon ? "text-yellow-400" : "text-white/60"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        )}
        <div>
          <p className="text-xs text-white/60">Daily Reset</p>
          <p
            className={`text-sm font-medium ${isResettingSoon ? "text-yellow-400" : "text-white"}`}
          >
            {formattedTime}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <svg
          className={`h-4 w-4 ${isResettingSoon ? "text-yellow-400" : "text-white/60"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      )}
      <span
        className={`text-sm ${isResettingSoon ? "text-yellow-400" : "text-white/60"}`}
      >
        Resets {formattedTime}
      </span>
      {isResettingSoon && (
        <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
          Soon
        </span>
      )}
    </div>
  );
};
