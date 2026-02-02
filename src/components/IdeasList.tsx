"use client";

import React from "react";
import { Button } from "@/components/Button";
import type { PinIdea } from "@/types";

type IdeasListProps = {
  ideas: PinIdea[];
  onGeneratePrompts: (idea: PinIdea) => void;
  onCopy: (value: string) => void;
  onRemove: (ideaId: string) => void;
  isLoading?: boolean;
  isPromptsLoading?: boolean;
};

export const IdeasList = ({
  ideas,
  onGeneratePrompts,
  onCopy,
  onRemove,
  isLoading,
  isPromptsLoading,
}: IdeasListProps) => {
  if (!ideas.length && !isLoading) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Generated Ideas</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-white/50">{ideas.length} ideas</span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-3 w-full rounded bg-white/10" />
                <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
                <div className="mt-4 h-8 w-1/2 rounded bg-white/10" />
              </div>
            ))
          : ideas.map((idea) => (
              <div
                key={idea.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <div>
                  <h3 className="text-base font-semibold text-white">{idea.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{idea.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {idea.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => onGeneratePrompts(idea)}
                    className="flex-1"
                    disabled={isPromptsLoading}
                  >
                    Generate Prompts
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onCopy(`${idea.title}\n${idea.description}\n${idea.keywords.join(", ")}`)}
                  >
                    Copy
                  </Button>
                  <Button variant="ghost" onClick={() => onRemove(idea.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
