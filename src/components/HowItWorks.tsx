import React from "react";

interface Step {
  step: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
}

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        How It Works
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-slate-800"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {item.step}
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
