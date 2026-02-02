"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Spinner } from "@/components/Spinner";
import { UsageBar } from "@/components/UsageBar";
import { usePlanContext } from "@/hooks/usePlanContext";

const nicheOptions = [
  "Gardening",
  "Cooking & Food",
  "Fitness & Health",
  "Home & DIY",
  "Beauty & Fashion",
  "Self-Development",
];

const ideaOptions = [3, 5, 10];

const getResetCountdown = () => {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setHours(24, 0, 0, 0);
  const diff = Math.max(nextReset.getTime() - now.getTime(), 0);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return `in ${hours}h ${minutes}m`;
};

export const PinForm = () => {
  const { selectedPlan, usage, incrementUsage } = usePlanContext();
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState(nicheOptions[0]);
  const [ideas, setIdeas] = useState(ideaOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetLabel, setResetLabel] = useState("daily");

  useEffect(() => {
    if (usage.limit === null) {
      setResetLabel("No reset needed");
      return;
    }

    const updateLabel = () => setResetLabel(getResetCountdown());
    updateLabel();
    const interval = setInterval(updateLabel, 60_000);
    return () => clearInterval(interval);
  }, [usage.limit]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPlan || isLoading) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      incrementUsage(ideas);
      setIsLoading(false);
    }, 800);
  };

  const isDisabled = !selectedPlan || isLoading || topic.trim().length === 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Input
          label="Topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          maxLength={50}
          placeholder="e.g. Cozy home office ideas"
          required
        />
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="text-sm font-medium text-white/90">Niche</span>
          <select
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white focus:border-primary focus:outline-none"
            value={niche}
            onChange={(event) => setNiche(event.target.value)}
          >
            {nicheOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="text-sm font-medium text-white/90">Number of Ideas</span>
          <div className="flex flex-wrap gap-3">
            {ideaOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIdeas(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  ideas === option
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/10 text-white/60 hover:border-primary/60"
                }`}
              >
                {option} Ideas
              </button>
            ))}
          </div>
        </label>
        <Button type="submit" disabled={isDisabled} className="w-full">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner /> Generating
            </span>
          ) : (
            "Generate Pin Ideas"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <UsageBar plan={selectedPlan} used={usage.used} limit={usage.limit} resetLabel={resetLabel} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
        Results will appear here once the generator is connected.
      </div>
    </div>
  );
};
