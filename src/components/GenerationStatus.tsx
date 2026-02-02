"use client";

import React from "react";

interface GenerationStatusProps {
  status: "idle" | "loading" | "success" | "error";
  progress: number;
  message?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

const GenerationStatus: React.FC<GenerationStatusProps> = ({
  status,
  progress,
  message,
  onCancel,
  onRetry,
}) => {
  if (status === "idle") return null;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "loading" && (
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          )}
          {status === "error" && <span className="text-red-500 font-bold">!</span>}
          <span className="font-medium text-gray-900">
            {status === "loading"
              ? "Generating your pins..."
              : status === "error"
              ? "Generation failed"
              : "Generation complete"}
          </span>
        </div>
        {status === "loading" && onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {status === "loading" && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{message || "Processing..."}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-600">{message || "An error occurred"}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerationStatus;
