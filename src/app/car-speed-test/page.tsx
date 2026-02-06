"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { ResultBox } from "@/components/ResultBox";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { calculateSpeed } from "@/lib/calculators/speed";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function CarSpeedTestPage() {
  const [distance, setDistance] = useState<number>(60);
  const [time, setTime] = useState<number>(1);
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    try {
      const calculationResult = calculateSpeed(distance, time, unit);
      setResult(calculationResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation failed");
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Car Speed Test Calculator", url: "/car-speed-test" },
  ]);

  const toolSchema = generateToolSchema(
    "Car Speed Test Calculator",
    "Calculate vehicle speed from distance and time measurements in km/h and mph",
    "/car-speed-test"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter Distance",
      description: "Input the distance traveled, either in miles or kilometers.",
    },
    {
      step: 2,
      title: "Enter Time",
      description: "Input the time taken to travel that distance in hours.",
    },
    {
      step: 3,
      title: "View Speed",
      description: "Get instant speed calculations in km/h, mph, and m/s.",
    },
  ];

  const faqs = [
    {
      question: "How accurate is this speed calculator?",
      answer: "Our calculator uses the basic speed formula (distance ÷ time). For precise measurements, use GPS or calibrated speed measuring devices. This tool is best for estimates and educational purposes.",
    },
    {
      question: "What is the formula for calculating speed?",
      answer: "Speed = Distance ÷ Time. This is the fundamental formula in physics for calculating average speed over a given period.",
    },
    {
      question: "Can I use minutes for time?",
      answer: "This calculator uses hours for time input. If you have minutes, divide by 60 to convert to hours. For example, 30 minutes = 0.5 hours.",
    },
    {
      question: "What's the difference between km/h and mph?",
      answer: "km/h stands for kilometers per hour, used in most countries. mph stands for miles per hour, used primarily in the US and UK. 1 mph = 1.60934 km/h.",
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
            Car Speed Test Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculate vehicle speed from distance and time measurements. 
            Get results in km/h, mph, and m/s instantly.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Enter Distance and Time
              </h2>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Distance Unit
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUnit("miles")}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      unit === "miles"
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Miles
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("km")}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      unit === "km"
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Kilometers
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Distance"
                  type="number"
                  value={distance}
                  onChange={setDistance}
                  placeholder="60"
                  min="0"
                  suffix={unit}
                />
                <InputField
                  label="Time"
                  type="number"
                  value={time}
                  onChange={setTime}
                  placeholder="1"
                  min="0"
                  step="0.01"
                  suffix="hours"
                />

                <ToolButton onClick={handleCalculate} className="w-full">
                  Calculate Speed
                </ToolButton>
              </div>
            </div>

            {result && (
              <div className="mt-8 space-y-6">
                <ResultBox
                  title="Speed in km/h"
                  result={`${result.kmPerHour} km/h`}
                  formula={result.formula}
                />
                <ResultBox
                  title="Speed in mph"
                  result={`${result.milesPerHour} mph`}
                />
                <ResultBox
                  title="Speed in m/s"
                  result={`${result.metersPerSecond} m/s`}
                />
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About Car Speed Calculation
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Understanding vehicle speed is essential for safe driving, performance testing, and analyzing travel efficiency. Our car speed calculator helps you determine average speed based on distance traveled and time taken.
                </p>
                <p>
                  Whether you're calculating the average speed of a road trip, testing vehicle performance, or analyzing fuel efficiency, this tool provides quick and accurate speed conversions between different units.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "Asphalt Calculator", href: "/asphalt-calculator", description: "Calculate asphalt quantity" },
                { title: "Flight Speed Estimator", href: "/flight-speed-estimator", description: "Calculate airplane speed" },
              ]}
            />
          </div>
        </div>
      </div>

      <AdBanner location="footer" />
    </div>
  );
}
