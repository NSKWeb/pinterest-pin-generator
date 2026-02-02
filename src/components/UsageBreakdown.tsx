"use client";

import React, { useMemo } from "react";
import type { PlanType } from "@/lib/config";
import type { UsageStats, GenerationType } from "@/types";
import { useLimitCheck } from "@/hooks/useLimitCheck";
import { getPlanLimits, formatLimit } from "@/lib/planLimits";
import { ResetCountdown } from "./ResetCountdown";

interface UsageBreakdownProps {
  usage: UsageStats;
  plan: PlanType | null;
  showLifetime?: boolean;
  className?: string;
}

interface UsageItemProps {
  label: string;
  used: number;
  limit: number;
  extraUnlocked: number;
  color: string;
}

const UsageItem = ({ label, used, limit, extraUnlocked, color }: UsageItemProps) => {
  const isUnlimited = limit === Infinity;
  const effectiveLimit = isUnlimited ? Infinity : limit + extraUnlocked;
  const percentage = isUnlimited
    ? 0
    : Math.min((used / (effectiveLimit || 1)) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80 && percentage < 100;
  const isAtLimit = !isUnlimited && percentage >= 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span
          className={`${isAtLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-white/60"}`}
        >
          {isUnlimited ? (
            <span className="text-emerald-400">Unlimited</span>
          ) : (
            <>
              {used} / {formatLimit(effectiveLimit)}
              {extraUnlocked > 0 && (
                <span className="ml-1 text-emerald-400">(+{extraUnlocked})</span>
              )}
            </>
          )}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${isUnlimited ? 100 : percentage}%` }}
        />
      </div>
    </div>
  );
};

export const UsageBreakdown = ({
  usage,
  plan,
  showLifetime = true,
  className = "",
}: UsageBreakdownProps) => {
  const { getProgressColor } = useLimitCheck(usage, plan);
  const limits = useMemo(() => getPlanLimits(plan), [plan]);

  const lifetimePercentage = useMemo(() => {
    const total =
      usage.lifetime.totalIdeas + usage.lifetime.totalPrompts + usage.lifetime.totalImages;
    if (total === 0) return { ideas: 0, prompts: 0, images: 0 };
    return {
      ideas: (usage.lifetime.totalIdeas / total) * 100,
      prompts: (usage.lifetime.totalPrompts / total) * 100,
      images: (usage.lifetime.totalImages / total) * 100,
    };
  }, [usage.lifetime]);

  if (!plan) {
    return (
      <div className={`rounded-2xl border border-white/10 bg-slate-900/60 p-4 ${className}`}>
        <p className="text-sm text-white/60">Select a plan to see usage breakdown</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900/60 p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Today&apos;s Usage</h3>
        <ResetCountdown variant="compact" />
      </div>

      <div className="space-y-4">
        <UsageItem
          label="Pin Ideas Generated"
          used={usage.today.ideasGenerated}
          limit={limits.ideasPerDay}
          extraUnlocked={usage.today.extraUnlocked}
          color={getProgressColor("idea")}
        />

        <UsageItem
          label="Prompts Generated"
          used={usage.today.promptsGenerated}
          limit={limits.promptsPerDay}
          extraUnlocked={usage.today.extraUnlocked}
          color={getProgressColor("prompt")}
        />

        <UsageItem
          label="Images Generated"
          used={usage.today.imagesGenerated}
          limit={limits.imagesPerDay}
          extraUnlocked={usage.today.extraUnlocked}
          color={getProgressColor("image")}
        />
      </div>

      {usage.today.extraUnlocked > 0 && (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-sm text-emerald-400">
            <span className="font-medium">+{usage.today.extraUnlocked}</span> extra generations
            unlocked from watching ads
          </p>
        </div>
      )}

      {showLifetime && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <h3 className="mb-3 text-sm font-medium text-white/80">Lifetime Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total Ideas</span>
              <span className="text-white">{usage.lifetime.totalIdeas.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total Prompts</span>
              <span className="text-white">{usage.lifetime.totalPrompts.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total Images</span>
              <span className="text-white">{usage.lifetime.totalImages.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total Ads Watched</span>
              <span className="text-white">{usage.lifetime.totalAdsWatched.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div className="flex h-full">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${lifetimePercentage.ideas}%` }}
                />
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${lifetimePercentage.prompts}%` }}
                />
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${lifetimePercentage.images}%` }}
                />
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-white/60">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Ideas
              </span>
              <span className="flex items-center gap-1 text-white/60">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Prompts
              </span>
              <span className="flex items-center gap-1 text-white/60">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Images
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
