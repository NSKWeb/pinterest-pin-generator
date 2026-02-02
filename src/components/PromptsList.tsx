"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import type { ImagePrompt, PinIdea } from "@/types";

type PromptsListProps = {
  idea: PinIdea | null;
  prompts: ImagePrompt[];
  onCopy: (value: string) => void;
};

export const PromptsList = ({ idea, prompts, onCopy }: PromptsListProps) => {
  const [activePromptId, setActivePromptId] = useState<string | null>(prompts[0]?.id ?? null);

  useEffect(() => {
    setActivePromptId(prompts[0]?.id ?? null);
  }, [prompts]);

  if (!idea || !prompts.length) {
    return null;
  }

  const activePrompt = prompts.find((prompt) => prompt.id === activePromptId) ?? prompts[0];

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Prompt Variations</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{idea.title}</h2>
          <p className="mt-2 text-sm text-white/70">{idea.description}</p>
        </div>
        <Button variant="ghost" onClick={() => onCopy(prompts.map((prompt) => prompt.main_prompt).join("\n\n"))}>
          Copy All
        </Button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={prompt.id}
            type="button"
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              prompt.id === activePrompt.id
                ? "border-primary bg-primary/20 text-white"
                : "border-white/10 text-white/60 hover:border-primary/60"
            }`}
            onClick={() => setActivePromptId(prompt.id)}
          >
            Variation {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <details className="rounded-2xl border border-white/10 bg-white/5 p-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
            Main Prompt
          </summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Prompt details</span>
            <Button variant="ghost" onClick={() => onCopy(activePrompt.main_prompt)} className="px-3 py-1.5 text-xs">
              Copy
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/70">{activePrompt.main_prompt}</p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 p-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
            Style Guide
          </summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Style notes</span>
            <Button variant="ghost" onClick={() => onCopy(activePrompt.style_guide)} className="px-3 py-1.5 text-xs">
              Copy
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/70">{activePrompt.style_guide}</p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 p-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
            Negative Prompt
          </summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Avoid</span>
            <Button
              variant="ghost"
              onClick={() => onCopy(activePrompt.negative_prompt)}
              className="px-3 py-1.5 text-xs"
            >
              Copy
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/70">{activePrompt.negative_prompt}</p>
        </details>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" disabled>
          Use for Image Generation
        </Button>
        <Button variant="ghost" onClick={() => onCopy(activePrompt.main_prompt)}>
          Copy Current Prompt
        </Button>
      </div>
    </div>
  );
};
