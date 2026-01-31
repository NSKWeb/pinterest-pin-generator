"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { PLAN_CONFIG, PlanType, STORAGE_KEYS } from "@/lib/config";
import { safeStorage } from "@/utils/storage";
import type { UsageState } from "@/types";

export type PlanContextValue = {
  selectedPlan: PlanType | null;
  usage: UsageState;
  selectPlan: (plan: PlanType) => void;
  incrementUsage: (count?: number) => void;
  resetUsage: () => void;
};

export const PlanContext = createContext<PlanContextValue | undefined>(undefined);

const defaultUsage: UsageState = {
  plan: null,
  used: 0,
  limit: null,
  lastReset: null,
};

const getResetKey = () => new Date().toDateString();

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [usage, setUsage] = useState<UsageState>(defaultUsage);

  useEffect(() => {
    const storedPlan = safeStorage.get<PlanType | null>(STORAGE_KEYS.plan, null);
    const storedUsage = safeStorage.get<UsageState>(STORAGE_KEYS.usage, defaultUsage);
    const storedReset = safeStorage.get<string | null>(STORAGE_KEYS.lastReset, null);
    const resetKey = getResetKey();
    const shouldReset = storedReset !== resetKey;

    setSelectedPlan(storedPlan);
    setUsage({
      ...storedUsage,
      plan: storedPlan,
      used: shouldReset ? 0 : storedUsage.used,
      limit: storedPlan ? PLAN_CONFIG[storedPlan].limit : null,
      lastReset: resetKey,
    });
  }, []);

  useEffect(() => {
    if (!selectedPlan) {
      return;
    }
    safeStorage.set(STORAGE_KEYS.plan, selectedPlan);
    safeStorage.set(STORAGE_KEYS.usage, usage);
    safeStorage.set(STORAGE_KEYS.lastReset, usage.lastReset);
  }, [selectedPlan, usage]);

  const selectPlan = useCallback((plan: PlanType) => {
    const resetKey = getResetKey();
    const limit = PLAN_CONFIG[plan].limit;
    const updatedUsage: UsageState = {
      plan,
      used: 0,
      limit,
      lastReset: resetKey,
    };
    setSelectedPlan(plan);
    setUsage(updatedUsage);
  }, []);

  const incrementUsage = useCallback((count = 1) => {
    setUsage((prev) => {
      if (prev.plan === null) {
        return prev;
      }
      const newUsed = prev.used + count;
      return {
        ...prev,
        used: newUsed,
      };
    });
  }, []);

  const resetUsage = useCallback(() => {
    setUsage((prev) => ({
      ...prev,
      used: 0,
      lastReset: getResetKey(),
    }));
  }, []);

  const value = useMemo(
    () => ({
      selectedPlan,
      usage,
      selectPlan,
      incrementUsage,
      resetUsage,
    }),
    [selectedPlan, usage, selectPlan, incrementUsage, resetUsage],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
