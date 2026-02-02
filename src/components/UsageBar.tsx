"use client";

import React, { useMemo } from "react";
import type { PlanType } from "@/lib/config";
import type { UsageStats, GenerationType } from "@/types";
import { PLAN_CONFIG } from "@/lib/config";
import { getPlanLimits, formatLimit, getPlanDisplayName } from "@/lib/planLimits";
import { useLimitCheck } from "@/hooks/useLimitCheck";
import { useResetCountdown } from "@/hooks/useResetCountdown";
import { Button } from "@/components/Button";

export type UsageBarProps = {
  plan: PlanType | null;
  usage: UsageStats;
  onWatchAd?: () => void;
  onUpgrade?: () => void;
  showDetails?: boolean;
  compact?: boolean;
};

const planColors: Record<PlanType, string> = {
  PlanA: "from-emerald-500 to-teal-400",
  PlanB: "from-sky-500 to-blue-500",
  PlanC: "from-indigo-500 to-purple-500",
};

const planBgColors: Record<PlanType, string> = {
  PlanA: "bg-emerald-500",
  PlanB: "bg-sky-500",
  PlanC: "bg-indigo-500",
};

export const UsageBar = ({
  plan,
  usage,
  onWatchAd,
  onUpgrade,
  showDetails = true,
  compact = false,
}: UsageBarProps) => {
  const { getRemainingMessage, isNearLimit, isAtLimit, getProgressColor, canWatchAd } =
    useLimitCheck(usage, plan);
  const { formattedTime, isResettingSoon } = useResetCountdown();

  const limits = useMemo(() => getPlanLimits(plan), [plan]);

  const ideasProgress = useMemo(() => {
    if (!plan || limits.ideasPerDay === Infinity) return 0;
    const totalLimit = limits.ideasPerDay + usage.today.extraUnlocked;
    const percentage = (usage.today.ideasGenerated / totalLimit) * 100;
    return Math.min(percentage, 100);
  }, [plan, limits.ideasPerDay, usage.today.ideasGenerated, usage.today.extraUnlocked]);

  const promptsProgress = useMemo(() => {
    if (!plan || limits.promptsPerDay === Infinity) return 0;
    const totalLimit = limits.promptsPerDay + usage.today.extraUnlocked;
    const percentage = (usage.today.promptsGenerated / totalLimit) * 100;
    return Math.min(percentage, 100);
  }, [plan, limits.promptsPerDay, usage.today.promptsGenerated, usage.today.extraUnlocked]);

  const imagesProgress = useMemo(() => {
    if (!plan || limits.imagesPerDay === Infinity) return 0;
    const totalLimit = limits.imagesPerDay + usage.today.extraUnlocked;
    const percentage = (usage.today.imagesGenerated / totalLimit) * 100;
    return Math.min(percentage, 100);
  }, [plan, limits.imagesPerDay, usage.today.imagesGenerated, usage.today.extraUnlocked]);

  if (!plan) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <p className="text-sm text-white/60">Select a plan to see usage</p>
      </div>
    );
  }

  const planLabel = PLAN_CONFIG[plan].name;
  const displayName = getPlanDisplayName(plan);

  const isIdeasNearLimit = isNearLimit("idea", 0.8);
  const isIdeasAtLimit = isAtLimit("idea");
  const ideasMessage = getRemainingMessage("idea");

  if (compact) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${planBgColors[plan]}`}
            />
            <span className="text-xs text-white/60">{displayName}</span>
          </div>
          {limits.unlocked ? (
            <span className="text-xs text-emerald-400">Unlimited</span>
          ) : (
            <span
              className={`text-xs ${isIdeasAtLimit ? "text-red-400" : isIdeasNearLimit ? "text-yellow-400" : "text-white/60"}`}
            >
              {ideasMessage}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white ${planBgColors[plan]}`}
            >
              {plan === "PlanA" ? "A" : plan === "PlanB" ? "B" : "C"}
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">{planLabel}</p>
          </div>

          <p className="mt-1 text-sm text-white/90">{ideasMessage}</p>

          {showDetails && !limits.unlocked && (
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/60">
              <span>Prompts: {getRemainingMessage("prompt")}</span>
              <span>Images: {getRemainingMessage("image")}</span>
            </div>
          )}

          {usage.today.extraUnlocked > 0 && (
            <p className="mt-1 text-xs text-emerald-400">
              +{usage.today.extraUnlocked} extra unlocked from ads
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {limits.unlocked ? (
            <span className="text-xs text-emerald-400">✨ Unlimited</span>
          ) : (
            <>
              <span
                className={`text-xs ${isResettingSoon ? "text-yellow-400" : "text-white/60"}`}
              >
                Resets {formattedTime}
              </span>

              {plan === "PlanC" && canWatchAd && (isIdeasNearLimit || isIdeasAtLimit) && (
                <Button
                  variant="primary"
                  onClick={onWatchAd}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Ad for +2
                </Button>
              )}

              {plan === "PlanB" && isIdeasAtLimit && onUpgrade && (
                <Button
                  variant="primary"
                  onClick={onUpgrade}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Upgrade
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {!limits.unlocked && showDetails && (
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-white/60">Ideas</span>
              <span
                className={`${isIdeasAtLimit ? "text-red-400" : isIdeasNearLimit ? "text-yellow-400" : "text-white/60"}`}
              >
                {usage.today.ideasGenerated}/{formatLimit(limits.ideasPerDay + usage.today.extraUnlocked)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor("idea")}`}
                style={{ width: `${ideasProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-white/60">Prompts</span>
              <span className="text-white/60">
                {usage.today.promptsGenerated}/{formatLimit(limits.promptsPerDay + usage.today.extraUnlocked)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full bg-blue-500 transition-all duration-300`}
                style={{ width: `${promptsProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-white/60">Images</span>
              <span className="text-white/60">
                {usage.today.imagesGenerated}/{formatLimit(limits.imagesPerDay + usage.today.extraUnlocked)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full bg-purple-500 transition-all duration-300`}
                style={{ width: `${imagesProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {limits.unlocked && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className={`h-full bg-gradient-to-r ${planColors[plan]}`} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
};
