"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { IdeasList } from "@/components/IdeasList";
import { Input } from "@/components/Input";
import { PromptsList } from "@/components/PromptsList";
import { Spinner } from "@/components/Spinner";
import { StatusToast } from "@/components/StatusToast";
import { UsageBar } from "@/components/UsageBar";
import { usePlanContext } from "@/hooks/usePlanContext";
import { useToast } from "@/hooks/useToast";
import { IDEA_OPTIONS, PIN_NICHES, PROMPT_VARIATIONS, STORAGE_KEYS } from "@/lib/config";
import { copyToClipboard } from "@/utils/clipboard";
import { safeStorage } from "@/utils/storage";
import type { ImagePrompt, IdeaResponse, PinIdea, PromptResponse } from "@/types";

const getResetCountdown = () => {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setHours(24, 0, 0, 0);
  const diff = Math.max(nextReset.getTime() - now.getTime(), 0);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return `in ${hours}h ${minutes}m`;
};

const createIdeaMap = (entries: [string, ImagePrompt[]][]) => {
  return entries.reduce<Record<string, ImagePrompt[]>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

export const PinForm = () => {
  const { selectedPlan, usage, incrementIdeaUsage, incrementPromptUsage } = usePlanContext();
  const { toast, showToast, clearToast } = useToast();
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState<(typeof PIN_NICHES)[number]>(PIN_NICHES[0]);
  const [ideasCount, setIdeasCount] = useState<(typeof IDEA_OPTIONS)[number]>(IDEA_OPTIONS[0]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [resetLabel, setResetLabel] = useState("daily");
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<PinIdea[]>(() => safeStorage.get(STORAGE_KEYS.ideas, []));
  const [promptsByIdea, setPromptsByIdea] = useState<Record<string, ImagePrompt[]>>(() =>
    createIdeaMap(Object.entries(safeStorage.get(STORAGE_KEYS.prompts, {}))),
  );
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(() =>
    safeStorage.get(STORAGE_KEYS.selectedIdea, null),
  );
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [lastAction, setLastAction] = useState<"ideas" | "prompts" | null>(null);
  const [lastIdea, setLastIdea] = useState<PinIdea | null>(null);

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

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.ideas, ideas);
  }, [ideas]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.prompts, promptsByIdea);
  }, [promptsByIdea]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.selectedIdea, selectedIdeaId);
  }, [selectedIdeaId]);

  useEffect(() => {
    if (!isLoadingIdeas && !isLoadingPrompts) {
      return;
    }

    setEstimatedTime(30);
    const interval = setInterval(() => {
      setEstimatedTime((prev) => Math.max(prev - 5, 5));
    }, 5_000);

    return () => clearInterval(interval);
  }, [isLoadingIdeas, isLoadingPrompts]);

  const isOverLimit = useMemo(() => {
    if (usage.limit === null) {
      return false;
    }
    return usage.ideasUsed + ideasCount > usage.limit;
  }, [ideasCount, usage.ideasUsed, usage.limit]);

  const selectedIdea = useMemo(() => ideas.find((idea) => idea.id === selectedIdeaId) ?? null, [ideas, selectedIdeaId]);

  const handleCopy = async (value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      showToast("Copied to clipboard!", "success");
    } else {
      showToast("Unable to copy to clipboard.", "error");
    }
  };

  const handleGenerateIdeas = async () => {
    if (!selectedPlan || isLoadingIdeas) {
      return;
    }

    if (!topic.trim()) {
      setError("Invalid input. Please check your topic and niche.");
      showToast("Invalid input. Please check your topic and niche.", "error");
      return;
    }

    if (isOverLimit) {
      setError("Daily limit reached. Upgrade to Plan A for unlimited.");
      showToast("Daily limit reached. Upgrade to Plan A for unlimited.", "error");
      return;
    }

    setError(null);
    setLastAction("ideas");
    setLastIdea(null);
    setIsLoadingIdeas(true);
    showToast(`Generating ideas... ~${estimatedTime} seconds`, "loading");

    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          niche,
          count: ideasCount,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json()) as { message?: string };
        throw new Error(errorBody.message || "API error. Please try again in a few moments.");
      }

      const data = (await response.json()) as IdeaResponse;
      setIdeas(data.ideas);
      setPromptsByIdea({});
      setSelectedIdeaId(data.ideas[0]?.id ?? null);
      incrementIdeaUsage(data.ideas.length);
      showToast(`${data.ideas.length} ideas generated successfully!`, "success");
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Network error. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const handleGeneratePrompts = async (idea: PinIdea) => {
    if (isLoadingPrompts) {
      return;
    }

    setIsLoadingPrompts(true);
    setSelectedIdeaId(idea.id);
    setError(null);
    setLastAction("prompts");
    setLastIdea(idea);
    showToast(`Generating prompts... ~${estimatedTime} seconds`, "loading");

    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ideaId: idea.id,
          idea,
          variations: PROMPT_VARIATIONS[0],
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json()) as { message?: string };
        throw new Error(errorBody.message || "API error. Please try again in a few moments.");
      }

      const data = (await response.json()) as PromptResponse;
      setPromptsByIdea((prev) => ({
        ...prev,
        [idea.id]: data.prompts,
      }));
      incrementPromptUsage(data.prompts.length);
      showToast(`${data.prompts.length} prompts generated!`, "success");
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Network error. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleRemoveIdea = (ideaId: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
    setPromptsByIdea((prev) => {
      const next = { ...prev };
      delete next[ideaId];
      return next;
    });
    if (selectedIdeaId === ideaId) {
      setSelectedIdeaId(null);
    }
  };

  const handleCancelLoading = () => {
    setIsLoadingIdeas(false);
    setIsLoadingPrompts(false);
    showToast("Request canceled.", "error");
  };

  const activePrompts = promptsByIdea[selectedIdeaId ?? ""] ?? [];

  const isDisabled =
    !selectedPlan ||
    isLoadingIdeas ||
    isLoadingPrompts ||
    topic.trim().length === 0 ||
    isOverLimit ||
    !process.env.NEXT_PUBLIC_REPLICATE_API_KEY;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
      {!process.env.NEXT_PUBLIC_REPLICATE_API_KEY ? (
        <div className="mb-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Missing Replicate configuration. Add your API key to continue.
        </div>
      ) : null}
      {isOverLimit ? (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          Daily limit reached. Upgrade to Plan A for unlimited.
        </div>
      ) : null}
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          handleGenerateIdeas();
        }}
      >
        <Input
          label="Topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          maxLength={50}
          placeholder="e.g. Cozy home office ideas"
          required
          disabled={isLoadingIdeas || isLoadingPrompts}
        />
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="text-sm font-medium text-white/90">Niche</span>
          <select
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white focus:border-primary focus:outline-none"
            value={niche}
            onChange={(event) => setNiche(event.target.value as (typeof PIN_NICHES)[number])}
            disabled={isLoadingIdeas || isLoadingPrompts}
          >
            {PIN_NICHES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="text-sm font-medium text-white/90">Number of Ideas</span>
          <div className="flex flex-wrap gap-3">
            {IDEA_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIdeasCount(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  ideasCount === option
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/10 text-white/60 hover:border-primary/60"
                }`}
                disabled={isLoadingIdeas || isLoadingPrompts}
              >
                {option} Ideas
              </button>
            ))}
          </div>
        </label>
        <Button type="submit" disabled={isDisabled} className="w-full">
          {isLoadingIdeas ? (
            <span className="flex items-center gap-2">
              <Spinner /> Generating
            </span>
          ) : (
            "Generate Pin Ideas"
          )}
        </Button>
      </form>

      <div className="mt-4 space-y-3">
        {toast ? (
          <StatusToast
            status={toast.kind}
            message={toast.message}
            onRetry={
              error
                ? () => {
                    if (lastAction === "prompts" && lastIdea) {
                      handleGeneratePrompts(lastIdea);
                    } else {
                      handleGenerateIdeas();
                    }
                  }
                : undefined
            }
            actionLabel={toast.kind === "loading" ? "Cancel" : "Dismiss"}
            onClose={toast.kind === "loading" ? handleCancelLoading : clearToast}
          />
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <UsageBar
          plan={selectedPlan}
          ideasUsed={usage.ideasUsed}
          promptsUsed={usage.promptsUsed}
          imagesUsed={usage.imagesUsed}
          limit={usage.limit}
          resetLabel={resetLabel}
        />
      </div>

      <IdeasList
        ideas={ideas}
        isLoading={isLoadingIdeas}
        isPromptsLoading={isLoadingPrompts}
        onGeneratePrompts={handleGeneratePrompts}
        onCopy={handleCopy}
        onRemove={handleRemoveIdea}
      />

      {isLoadingPrompts ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Generating prompts... ~{estimatedTime} seconds
        </div>
      ) : null}

      <PromptsList idea={selectedIdea} prompts={activePrompts} onCopy={handleCopy} />
    </div>
  );
};
