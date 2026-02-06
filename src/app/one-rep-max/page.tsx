"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { ResultBox } from "@/components/ResultBox";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { calculateOneRepMax } from "@/lib/calculators/oneRepMax";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function OneRepMaxPage() {
  const [weight, setWeight] = useState<number>(225);
  const [reps, setReps] = useState<number>(5);
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    try {
      const calculationResult = calculateOneRepMax(weight, reps, unit);
      setResult(calculationResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation failed");
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "One Rep Max Calculator", url: "/one-rep-max" },
  ]);

  const toolSchema = generateToolSchema(
    "One Rep Max Calculator",
    "Calculate your one repetition maximum lift with training percentages using the Epley formula",
    "/one-rep-max"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter Weight Lifted",
      description: "Input the weight you lifted for your working set, in pounds or kilograms.",
    },
    {
      step: 2,
      title: "Enter Reps Completed",
      description: "Input the number of repetitions you completed with good form.",
    },
    {
      step: 3,
      title: "View 1RM & Training Zones",
      description: "See your estimated one rep max and training percentages for different goals.",
    },
  ];

  const faqs = [
    {
      question: "What is one rep max?",
      answer: "One Rep Max (1RM) is the maximum amount of weight you can lift for a single repetition of a given exercise with proper form. It's a key metric for tracking strength progress.",
    },
    {
      question: "How accurate is the Epley formula?",
      answer: "The Epley formula is most accurate for 1-12 repetitions. It provides a good estimate but actual 1RM may vary. Always test gradually with proper spotting when attempting new maxes.",
    },
    {
      question: "How do I use the training percentages?",
      answer: "Different percentages target different goals: 50-60% for warm-up, 70-80% for muscle building (hypertrophy), 85-90% for strength, and 95%+ for power training.",
    },
    {
      question: "Is it safe to test my actual 1RM?",
      answer: "Testing true 1RM carries injury risk. Most lifters use calculators to estimate 1RM and train at percentages. Always use a spotter and proper form when attempting heavy lifts.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            One Rep Max Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculate your estimated one repetition maximum lift and training percentages 
            using the Epley formula.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Enter Your Lift Details
              </h2>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight Unit
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUnit("lbs")}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      unit === "lbs"
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Pounds (lbs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("kg")}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      unit === "kg"
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Weight Lifted"
                  type="number"
                  value={weight}
                  onChange={setWeight}
                  placeholder="225"
                  min="0"
                  suffix={unit}
                />
                <InputField
                  label="Reps Completed"
                  type="number"
                  value={reps}
                  onChange={setReps}
                  placeholder="5"
                  min="1"
                  max="12"
                />

                <ToolButton onClick={handleCalculate} className="w-full">
                  Calculate 1RM
                </ToolButton>
              </div>
            </div>

            {result && (
              <div className="mt-8 space-y-6">
                <ResultBox
                  title="Estimated One Rep Max"
                  result={`${result.oneRepMax} ${result.unit}`}
                  formula={result.formula}
                />

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Training Percentages
                  </h3>
                  <div className="space-y-3">
                    {result.trainingWeights.map((item: any) => (
                      <div
                        key={item.percentage}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-slate-700"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.percentage}% of 1RM
                        </span>
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {item.weight} {result.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  <strong>Training Zones:</strong> Use 50-60% for warm-up, 70-80% for hypertrophy, 
                  85-90% for strength, and 95%+ for power training.
                </div>
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About One Rep Max
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Your one repetition max (1RM) is the foundation of strength training programming. It helps you determine appropriate training weights for different goals, from building muscle to increasing strength or power.
                </p>
                <p>
                  Our calculator uses the Epley formula, which is widely regarded as one of the most accurate formulas for estimating 1RM based on submaximal lifts. This allows you to plan your training without the risk and fatigue of regularly testing actual maxes.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "SAT Score Estimator", href: "/sat-score-estimator", description: "Estimate SAT scores" },
                { title: "Couple Name Generator", href: "/couple-name-generator", description: "Generate couple names" },
              ]}
            />
          </div>
        </div>
      </div>

      <AdBanner location="footer" />
    </div>
  );
}
