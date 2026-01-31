"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlanSelector } from "@/components/PlanSelector";
import { PinForm } from "@/components/PinForm";
import { usePlanContext } from "@/hooks/usePlanContext";

const features = [
  {
    title: "Smart topic insights",
    description: "Generate Pinterest-ready ideas tailored to your niche instantly.",
  },
  {
    title: "Plan-based usage",
    description: "Choose a plan that fits your workflow and usage goals.",
  },
  {
    title: "Performance ready",
    description: "Built on Next.js 15 with Tailwind CSS for fast experiences.",
  },
];

export default function HomePage() {
  const { selectedPlan, selectPlan } = usePlanContext();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedPlan) {
      setIsPlanModalOpen(true);
    }
  }, [selectedPlan]);

  const handleSelectPlan = (plan: Parameters<typeof selectPlan>[0]) => {
    selectPlan(plan);
    setIsPlanModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenPlanSelector={() => setIsPlanModalOpen(true)} />
      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              Pinterest Pin Generator
            </div>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Create scroll-stopping pins with AI-powered idea generation.
            </h1>
            <p className="text-base text-white/70">
              Choose your plan, set your topic, and generate fresh Pinterest pin ideas in seconds.
              The next generation of creator workflows starts here.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow">
                Start Generating
              </button>
              <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/70">
                Explore Plans
              </button>
            </div>
          </div>
          <div className="flex-1">
            {selectedPlan ? (
              <PinForm />
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-white/70">
                Select a plan to unlock the generator.
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <PlanSelector
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}
