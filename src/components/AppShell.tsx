"use client";

import React, { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlanSelector } from "@/components/PlanSelector";
import { usePlanContext } from "@/hooks/usePlanContext";
import type { PlanType } from "@/lib/config";

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const { selectedPlan, selectPlan } = usePlanContext();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    setIsPlanModalOpen(!selectedPlan);
  }, [selectedPlan]);

  const handleSelectPlan = (plan: PlanType) => {
    selectPlan(plan);
    setIsPlanModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenPlanSelector={() => setIsPlanModalOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <PlanSelector
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
};
