"use client";

import React, { useMemo } from "react";
import { PLAN_CONFIG, PlanType } from "@/lib/config";

export type UsageBarProps = {
  plan: PlanType | null;
  ideasUsed: number;
  promptsUsed: number;
  limit: number | null;
  resetLabel: string;
};

const planColors: Record<PlanType, string> = {
  PlanA: "from-emerald-500 to-teal-400",
  PlanB: "from-sky-500 to-blue-500",
  PlanC: "from-indigo-500 to-purple-500",
};

export const UsageBar = ({ plan, ideasUsed, promptsUsed, limit, resetLabel }: UsageBarProps) => {
  const progress = useMemo(() => {
    if (limit === null) {
      return 100;
    }
    if (limit === 0) {
      return 0;
    }
    return Math.min((ideasUsed / limit) * 100, 100);
  }, [ideasUsed, limit]);

  if (!plan) {
    return null;
  }

  const planLabel = PLAN_CONFIG[plan].name;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">{planLabel}</p>
          <p className="text-sm text-white/90">
            {limit === null ? "Unlimited" : `${ideasUsed}/${limit}`} ideas used
          </p>
          <p className="text-xs text-white/60">Prompts generated: {promptsUsed}</p>
        </div>
        <span className="text-xs text-white/60">Resets {resetLabel}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full bg-gradient-to-r ${planColors[plan]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
