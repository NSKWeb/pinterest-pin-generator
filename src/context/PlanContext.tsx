"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { PLAN_CONFIG, PlanType, STORAGE_KEYS } from "@/lib/config";
import { safeStorage } from "@/utils/storage";
import type { UsageState } from "@/types";

export type PlanContextValue = {
  selectedPlan: PlanType | null;
  usage: UsageState;
  selectPlan: (plan: PlanType) => void;
  incrementIdeaUsage: (count?: number) => void;
  incrementPromptUsage: (count?: number) => void;
  resetUsage: () => void;
};

export const PlanContext = createContext<PlanContextValue | undefined>(undefined);

const defaultUsage: UsageState = {
  plan: null,
  ideasUsed: 0,
  promptsUsed: 0,
  limit: null,
  lastReset: null,
};

const getResetKey = () => new Date().toDateString();

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [usage, setUsage] = useState<UsageState>(defaultUsage);

  useEffect(() => {
    const storedPlan = safeStorage.get<PlanType | null>(STORAGE_KEYS.plan, null);
    const storedUsage = safeStorage.get<UsageState & { used?: number }>(STORAGE_KEYS.usage, defaultUsage);
    const storedReset = safeStorage.get<string | null>(STORAGE_KEYS.lastReset, null);
    const resetKey = getResetKey();
    const shouldReset = storedReset !== resetKey;
    const initialPlan = storedPlan;
    const initialIdeasUsed = shouldReset
      ? 0
      : (storedUsage.ideasUsed ?? storedUsage.used ?? 0);
    const initialPromptsUsed = shouldReset ? 0 : (storedUsage.promptsUsed ?? 0);
    const initialLimit = initialPlan ? PLAN_CONFIG[initialPlan].limit : null;

    setSelectedPlan(initialPlan);
    setUsage({
      ...storedUsage,
      plan: initialPlan,
      ideasUsed: initialIdeasUsed,
      promptsUsed: initialPromptsUsed,
      limit: initialLimit,
      lastReset: resetKey,
    });
  }, []);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.plan, selectedPlan);
    safeStorage.set(STORAGE_KEYS.usage, usage);
    safeStorage.set(STORAGE_KEYS.lastReset, usage.lastReset);
  }, [selectedPlan, usage]);

  useEffect(() => {
    if (!selectedPlan) {
      return;
    }
    setUsage((prev) => ({
      ...prev,
      plan: selectedPlan,
      limit: PLAN_CONFIG[selectedPlan].limit,
    }));
  }, [selectedPlan]);

  const selectPlan = useCallback((plan: PlanType) => {
    const resetKey = getResetKey();
    const limit = PLAN_CONFIG[plan].limit;
    const updatedUsage: UsageState = {
      plan,
      ideasUsed: 0,
      promptsUsed: 0,
      limit,
      lastReset: resetKey,
    };
    setSelectedPlan(plan);
    setUsage(updatedUsage);
  }, []);

  const incrementIdeaUsage = useCallback((count = 1) => {
    setUsage((prev) => {
      if (prev.plan === null) {
        return prev;
      }
      const newUsed = prev.ideasUsed + count;
      if (prev.limit !== null && newUsed > prev.limit) {
        return {
          ...prev,
          ideasUsed: prev.limit,
        };
      }
      return {
        ...prev,
        ideasUsed: newUsed,
      };
    });
  }, []);

  const incrementPromptUsage = useCallback((count = 1) => {
    setUsage((prev) => {
      if (prev.plan === null) {
        return prev;
      }
      return {
        ...prev,
        promptsUsed: prev.promptsUsed + count,
      };
    });
  }, []);

  const resetUsage = useCallback(() => {
    setUsage((prev) => ({
      ...prev,
      ideasUsed: 0,
      promptsUsed: 0,
      lastReset: getResetKey(),
    }));
  }, []);

  const value = useMemo(
    () => ({
      selectedPlan,
      usage,
      selectPlan,
      incrementIdeaUsage,
      incrementPromptUsage,
      resetUsage,
    }),
    [selectedPlan, usage, selectPlan, incrementIdeaUsage, incrementPromptUsage, resetUsage],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
