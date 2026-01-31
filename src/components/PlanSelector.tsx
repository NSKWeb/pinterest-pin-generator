"use client";

import React from "react";
import { PLAN_CONFIG, PlanType } from "@/lib/config";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";

export type PlanSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PlanType) => void;
};

export const PlanSelector = ({ isOpen, onClose, onSelectPlan }: PlanSelectorProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose your plan">
      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(PLAN_CONFIG).map((plan) => (
          <div
            key={plan.id}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-4"
          >
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">{plan.ads}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-white/70">{plan.description}</p>
            </div>
            <ul className="flex-1 space-y-2 text-sm text-white/70">
              {plan.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button className="w-full" onClick={() => onSelectPlan(plan.id)}>
                Select {plan.id}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
