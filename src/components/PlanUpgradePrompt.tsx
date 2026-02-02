"use client";

import React from "react";
import type { PlanType } from "@/lib/config";
import { PLAN_CONFIG } from "@/lib/config";
import { Button } from "@/components/Button";

interface PlanUpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  currentPlan: PlanType | null;
}

export const PlanUpgradePrompt = ({
  isOpen,
  onClose,
  onUpgrade,
  currentPlan,
}: PlanUpgradePromptProps) => {
  if (!isOpen) return null;

  const planAConfig = PLAN_CONFIG.PlanA;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
            <svg className="h-6 w-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Upgrade to Plan A</h3>
            <p className="mt-1 text-sm text-white/70">
              Get unlimited generations and never worry about daily limits again.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {planAConfig.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
              <svg
                className="h-4 w-4 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {highlight}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={onUpgrade} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Upgrade Now
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
