import React from "react";

interface AdFallbackProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  message?: string;
}

export const AdFallback = ({ 
  width = "100%", 
  height = "auto", 
  className = "",
  message = "Ad unavailable"
}: AdFallbackProps) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] ${className}`}
      style={{ width, height, minHeight: "90px" }}
    >
      <span className="text-xs text-white/30">{message}</span>
    </div>
  );
};
