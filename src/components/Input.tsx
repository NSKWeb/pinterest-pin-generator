"use client";

import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/80">
      {label ? <span className="text-sm font-medium text-white/90">{label}</span> : null}
      <input
        className={`rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
};
