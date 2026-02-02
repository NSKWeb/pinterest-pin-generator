"use client";

import { useState, useEffect, useCallback } from "react";
import type { TimeRemaining } from "@/types/usage";
import { getNextResetTime } from "@/utils/usageReset";

interface UseResetCountdownReturn {
  countdown: TimeRemaining;
  formattedTime: string;
  isResettingSoon: boolean;
  refreshCountdown: () => void;
}

function calculateTimeRemaining(): TimeRemaining {
  const nextReset = getNextResetTime();
  const now = new Date();
  const diff = Math.max(nextReset.getTime() - now.getTime(), 0);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalMilliseconds: diff,
  };
}

function formatTime(countdown: TimeRemaining): string {
  const { hours, minutes, seconds } = countdown;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }

  return `${seconds}s`;
}

export function useResetCountdown(): UseResetCountdownReturn {
  const [countdown, setCountdown] = useState<TimeRemaining>(calculateTimeRemaining);

  const refreshCountdown = useCallback(() => {
    setCountdown(calculateTimeRemaining());
  }, []);

  useEffect(() => {
    refreshCountdown();

    const interval = setInterval(() => {
      setCountdown(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshCountdown]);

  const formattedTime = formatTime(countdown);
  const isResettingSoon = countdown.totalMilliseconds < 1000 * 60 * 30;

  return {
    countdown,
    formattedTime,
    isResettingSoon,
    refreshCountdown,
  };
}
