"use client";

import React, { useState } from "react";
import { APP_NAME, PLAN_CONFIG, PlanType } from "@/lib/config";
import { Button } from "@/components/Button";
import { UsageBar } from "@/components/UsageBar";
import { UsageBreakdown } from "@/components/UsageBreakdown";
import { Modal } from "@/components/Modal";
import { usePlanContext } from "@/hooks/usePlanContext";
import { useLimitCheck } from "@/hooks/useLimitCheck";
import { AdBannerHeader } from "@/components/ads";

type HeaderProps = {
  onOpenPlanSelector: () => void;
};

const planOptions: { value: PlanType; label: string }[] = Object.values(PLAN_CONFIG).map((plan) => ({
  value: plan.id,
  label: plan.name,
}));

export const Header = ({ onOpenPlanSelector }: HeaderProps) => {
  const { selectedPlan, usage, selectPlan } = usePlanContext();
  const { isAtLimit, getRemainingMessage } = useLimitCheck(usage, selectedPlan);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  const isIdeasAtLimit = isAtLimit("idea");
  const remainingMessage = getRemainingMessage("idea");

  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
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
            <div
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                isIdeasAtLimit
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-white/15 bg-white/5 text-white/70"
              }`}
            >
              {selectedPlan ? PLAN_CONFIG[selectedPlan].name : "Select a plan"}
            </div>

            {selectedPlan && (
              <button
                onClick={() => setIsUsageModalOpen(true)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/10"
              >
                {remainingMessage}
              </button>
            )}

            <select
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
              value={selectedPlan ?? ""}
              onChange={(event) => {
                if (event.target.value) {
                  selectPlan(event.target.value as PlanType);
                }
              }}
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
        </div>

        {selectedPlan && (
          <div className="w-full">
            <UsageBar plan={selectedPlan} usage={usage} compact />
          </div>
        )}

        <AdBannerHeader />
      </div>

      <Modal isOpen={isUsageModalOpen} onClose={() => setIsUsageModalOpen(false)}>
        <div className="max-h-[80vh] overflow-y-auto">
          <h2 className="mb-4 text-xl font-semibold text-white">Usage Summary</h2>
          <UsageBreakdown usage={usage} plan={selectedPlan} showLifetime />
        </div>
      </Modal>
    </header>
  );
};
