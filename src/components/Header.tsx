"use client";

import React from "react";
import { APP_NAME, PLAN_CONFIG, PlanType } from "@/lib/config";
import { Button } from "@/components/Button";
import { usePlanContext } from "@/hooks/usePlanContext";

type HeaderProps = {
  onOpenPlanSelector: () => void;
};

const planOptions: { value: PlanType; label: string }[] = Object.values(PLAN_CONFIG).map((plan) => ({
  value: plan.id,
  label: plan.name,
}));

export const Header = ({ onOpenPlanSelector }: HeaderProps) => {
  const { selectedPlan, selectPlan } = usePlanContext();

  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-xl font-bold text-primary">
            P
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{APP_NAME}</p>
            <p className="text-xs text-white/50">Pinterest Pin Generator</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-3">
          <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {selectedPlan ? PLAN_CONFIG[selectedPlan].name : "Select a plan"}
          </div>
          <select
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={selectedPlan ?? ""}
            onChange={(event) => selectPlan(event.target.value as PlanType)}
          >
            <option value="" disabled>
              Choose plan
            </option>
            {planOptions.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>
          <Button variant="ghost" onClick={onOpenPlanSelector}>
            Change Plan
          </Button>
        </div>

        <div className="w-full max-w-[970px] rounded-xl border border-dashed border-white/20 bg-white/5 px-6 py-4 text-center text-xs text-white/50 md:w-auto">
          Ad Banner Placeholder (970x90)
        </div>
      </div>
    </header>
  );
};
