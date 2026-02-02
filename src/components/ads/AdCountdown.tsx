import React, { useEffect, useState } from "react";

interface AdCountdownProps {
  seconds: number;
  onComplete?: () => void;
  canSkip?: boolean;
  onSkip?: () => void;
}

export const AdCountdown = ({ 
  seconds, 
  onComplete, 
  canSkip = false, 
  onSkip 
}: AdCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [canSkipNow, setCanSkipNow] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
    setCanSkipNow(false);

    if (seconds <= 5) {
      setCanSkipNow(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        
        const newTime = prev - 1;
        if (newTime <= 5) {
          setCanSkipNow(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const formatTime = (time: number): string => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8">
          <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-white/10"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-primary"
              strokeDasharray="87.96"
              strokeDashoffset={87.96 * (1 - timeLeft / seconds)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
            {timeLeft}
          </span>
        </div>
        <span className="text-sm font-medium text-white/90">
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {canSkip && canSkipNow && onSkip && (
        <button
          onClick={onSkip}
          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 transition-colors hover:bg-white/20"
        >
          Skip
        </button>
      )}
    </div>
  );
};
