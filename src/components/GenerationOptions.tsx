"use client";

import React from "react";
import { Button } from "./Button";

interface GenerationOptionsProps {
  quality: "fast" | "best";
  setQuality: (quality: "fast" | "best") => void;
  variations: 1 | 2 | 3;
  setVariations: (variations: 1 | 2 | 3) => void;
  aspectRatio: "1000x1500" | "square" | "vertical";
  setAspectRatio: (ratio: "1000x1500" | "square" | "vertical") => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const GenerationOptions: React.FC<GenerationOptionsProps> = ({
  quality,
  setQuality,
  variations,
  setVariations,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isLoading,
  disabled,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quality
          </label>
          <div className="flex gap-2">
            {(["fast", "best"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 py-2 px-3 text-sm rounded-md border ${
                  quality === q
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variations
          </label>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVariations(v)}
                className={`flex-1 py-2 px-3 text-sm rounded-md border ${
                  variations === v
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aspect Ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as any)}
            className="w-full py-2 px-3 text-sm rounded-md border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1000x1500">Pinterest (2:3)</option>
            <option value="square">Square (1:1)</option>
            <option value="vertical">Vertical (9:16)</option>
          </select>
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={disabled || isLoading}
        className="w-full"
      >
        {isLoading ? "Generating..." : "Generate Images"}
      </Button>
    </div>
  );
};

export default GenerationOptions;
