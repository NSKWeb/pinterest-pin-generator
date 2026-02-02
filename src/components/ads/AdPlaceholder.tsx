import React from "react";

interface AdPlaceholderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  label?: string;
}

export const AdPlaceholder = ({ 
  width = "100%", 
  height = "auto", 
  className = "",
  label = "Ad Loading..."
}: AdPlaceholderProps) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 ${className}`}
      style={{ width, height }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/50" />
        <span className="text-xs text-white/50">{label}</span>
      </div>
    </div>
  );
};
