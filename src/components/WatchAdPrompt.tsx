"use client";

import React from "react";
import { Button } from "@/components/Button";
import { UNLOCK_REWARDS } from "@/lib/adConfig";

interface WatchAdPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  extraGenerations?: number;
}

export const WatchAdPrompt = ({
  isOpen,
  onClose,
  onWatchAd,
  extraGenerations = UNLOCK_REWARDS.PlanC.extraGenerationsPerAd,
}: WatchAdPromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
            <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Watch to Unlock</h3>
            <p className="mt-1 text-sm text-white/70">
              Watch a short video ad to get {extraGenerations} extra generations instantly.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
              <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Get {extraGenerations} extra generations</p>
              <p className="text-xs text-white/50">Instantly added to your balance</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
              <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Only 30 seconds</p>
              <p className="text-xs text-white/50">Short video, skip available after 5 seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
              <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Safe and secure</p>
              <p className="text-xs text-white/50">From trusted advertisers</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Not Now
          </Button>
          <Button onClick={onWatchAd} className="flex-1 bg-indigo-500 hover:bg-indigo-600">
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Ad
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
