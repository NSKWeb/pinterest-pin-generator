"use client";

import React from "react";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";

export type ToastStatus = "success" | "error" | "loading";

export type StatusToastProps = {
  status: ToastStatus;
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  actionLabel?: string;
};

const statusStyles: Record<ToastStatus, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  loading: "border-sky-500/40 bg-sky-500/10 text-sky-100",
};

export const StatusToast = ({ status, message, onClose, onRetry, actionLabel }: StatusToastProps) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-3">
        {status === "loading" ? <Spinner /> : null}
        <span>{message}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {onRetry ? (
          <Button variant="ghost" onClick={onRetry} className="px-3 py-1.5 text-xs">
            Retry
          </Button>
        ) : null}
        {actionLabel && onClose ? (
          <Button variant="ghost" onClick={onClose} className="px-3 py-1.5 text-xs">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
