"use client";

import React, { useState, useCallback } from "react";
import { usePlanContext } from "@/hooks/usePlanContext";
import { useAdUnlock } from "@/hooks/useAdUnlock";
import { AdVideoPlayer } from "./AdVideoPlayer";
import { UNLOCK_REWARDS } from "@/lib/adConfig";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";

interface WatchAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock?: (count: number) => void;
}

type ModalState = "intro" | "playing" | "completed" | "error";

export const WatchAdModal = ({ isOpen, onClose, onUnlock }: WatchAdModalProps) => {
  const { selectedPlan } = usePlanContext();
  const { watchAdToUnlock, isWatching, watchError, unlockState } = useAdUnlock(selectedPlan);
  const [modalState, setModalState] = useState<ModalState>("intro");
  const [error, setError] = useState<string | null>(null);

  const extraGenerations = UNLOCK_REWARDS.PlanC.extraGenerationsPerAd;

  const resetModal = useCallback(() => {
    setModalState("intro");
    setError(null);
  }, []);

  const handleWatch = useCallback(async () => {
    setModalState("playing");
    setError(null);

    const success = await watchAdToUnlock(extraGenerations);

    if (success) {
      setModalState("completed");
      onUnlock?.(extraGenerations);
    } else {
      setModalState("error");
      setError(watchError || "Failed to play ad. Please try again.");
    }
  }, [watchAdToUnlock, extraGenerations, watchError, onUnlock]);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  const handleTryAgain = useCallback(() => {
    resetModal();
  }, [resetModal]);

  const handleAdComplete = useCallback((completed: boolean) => {
    if (completed) {
      setModalState("completed");
      onUnlock?.(extraGenerations);
    } else {
      setModalState("error");
      setError("Ad was skipped. Please watch the full video to unlock.");
    }
  }, [extraGenerations, onUnlock]);

  if (!isOpen) {
    return null;
  }

  if (selectedPlan !== "PlanC") {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-6">
        {modalState === "intro" && (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Watch Ad to Unlock
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Watch a short video ad to get <span className="font-semibold text-primary">{extraGenerations} extra generations</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Get {extraGenerations} extra generations</p>
                  <p className="text-xs text-white/50">Instantly added to your balance</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Short video ad</p>
                  <p className="text-xs text-white/50">Only 30 seconds, skip after 5</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
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
              <Button variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleWatch} className="flex-1" disabled={isWatching}>
                {isWatching ? "Loading..." : "Watch Ad"}
              </Button>
            </div>
          </>
        )}

        {modalState === "playing" && (
          <>
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-sm text-white/70">
                Please watch the video ad to unlock your extra generations
              </p>
              <AdVideoPlayer
                onComplete={handleAdComplete}
                autoPlay={true}
                showCountdown={true}
                skipAfterSeconds={5}
              />
            </div>
          </>
        )}

        {modalState === "completed" && (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <svg className="h-8 w-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Unlocked!
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  You've earned <span className="font-semibold text-emerald-400">{extraGenerations} extra generations</span>
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Continue
            </Button>
          </>
        )}

        {modalState === "error" && (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <svg className="h-8 w-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Oops!
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {error}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleTryAgain} className="flex-1">
                Try Again
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
