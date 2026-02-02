"use client";

import React from "react";
import type { PlanType } from "@/lib/config";
import type { UsageStats, GenerationType } from "@/types";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { useLimitCheck } from "@/hooks/useLimitCheck";
import { useResetCountdown } from "@/hooks/useResetCountdown";
import { getPlanLimits, formatLimit } from "@/lib/planLimits";
import { PLAN_CONFIG } from "@/lib/config";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: GenerationType;
  plan: PlanType | null;
  usage: UsageStats;
  onWatchAd?: () => void;
  onUpgrade?: () => void;
}

export const LimitReachedModal = ({
  isOpen,
  onClose,
  type,
  plan,
  usage,
  onWatchAd,
  onUpgrade,
}: LimitReachedModalProps) => {
  const { getRemainingMessage, getLimitReachedMessage } = useLimitCheck(usage, plan);
  const { formattedTime } = useResetCountdown();

  if (!isOpen || !plan) return null;

  const limits = getPlanLimits(plan);
  const message = getLimitReachedMessage(type);
  const remainingMessage = getRemainingMessage(type);

  const getTypeLabel = (t: GenerationType): string => {
    switch (t) {
      case "idea":
        return "Pin Ideas";
      case "prompt":
        return "Prompts";
      case "image":
        return "Images";
      default:
        return "Generations";
    }
  };

  const getUsageForType = (t: GenerationType): number => {
    switch (t) {
      case "idea":
        return usage.today.ideasGenerated;
      case "prompt":
        return usage.today.promptsGenerated;
      case "image":
        return usage.today.imagesGenerated;
      default:
        return 0;
    }
  };

  const getLimitForType = (t: GenerationType): number => {
    switch (t) {
      case "idea":
        return limits.ideasPerDay;
      case "prompt":
        return limits.promptsPerDay;
      case "image":
        return limits.imagesPerDay;
      default:
        return 0;
    }
  };

  const getIcon = () => {
    switch (plan) {
      case "PlanA":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <svg className="h-8 w-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        );
      case "PlanB":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20">
            <svg className="h-8 w-8 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        );
      case "PlanC":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
            <svg className="h-8 w-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {getIcon()}
          <div>
            <h2 className="text-xl font-semibold text-white">Daily Limit Reached</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-white/70">{message}</p>
          </div>
        </div>

        {!limits.unlocked && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-medium text-white">Usage Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">{getTypeLabel(type)}:</span>
                <span className="text-white">
                  {getUsageForType(type)} / {formatLimit(getLimitForType(type))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Extra Unlocked:</span>
                <span className="text-emerald-400">+{usage.today.extraUnlocked}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Ads Watched Today:</span>
                <span className="text-white">{usage.today.videoAdsWatched}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Next Reset:</span>
                <span className="text-yellow-400">{formattedTime}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {plan === "PlanC" && onWatchAd && (
            <Button onClick={onWatchAd} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Ad to Unlock +2
              </span>
            </Button>
          )}

          {plan === "PlanB" && onUpgrade && (
            <Button onClick={onUpgrade} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Upgrade to Plan A
              </span>
            </Button>
          )}

          {limits.unlocked ? (
            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose} className="w-full">
              Maybe Later
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
