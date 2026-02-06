import React from "react";

interface ResultBoxProps {
  title: string;
  result: string | number | React.ReactNode;
  formula?: string;
  show?: boolean;
}

export function ResultBox({ title, result, formula, show = true }: ResultBoxProps) {
  if (!show) return null;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="mb-4 text-4xl font-bold text-blue-600 dark:text-blue-400">{result}</div>
      {formula && (
        <div className="rounded-lg bg-white/50 p-4 text-sm text-gray-700 dark:bg-slate-700/50 dark:text-gray-300">
          <span className="font-semibold">Formula:</span> {formula}
        </div>
      )}
    </div>
  );
}
