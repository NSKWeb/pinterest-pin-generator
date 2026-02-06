import React from "react";

interface AdBannerProps {
  location: "header" | "middle" | "footer";
  className?: string;
}

export function AdBanner({ location, className = "" }: AdBannerProps) {
  // Placeholder for ad integration
  // Future: Replace with Google AdSense, Mediavine, or other ad network code
  
  const dimensions = {
    header: "h-[90px] w-full max-w-[728px]",
    middle: "h-[250px] w-full max-w-[300px]",
    footer: "h-[250px] w-full max-w-[728px]",
  };

  const labels = {
    header: "Advertisement",
    middle: "Advertisement",
    footer: "Advertisement",
  };

  return (
    <div
      className={`mx-auto my-4 flex flex-col items-center justify-center ${dimensions[location]} rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-slate-800 ${className}`}
    >
      <span className="text-sm text-gray-400 dark:text-gray-500">{labels[location]}</span>
      <span className="mt-2 text-xs text-gray-300 dark:text-gray-600">
        Ad space - {location}
      </span>
    </div>
  );
}
