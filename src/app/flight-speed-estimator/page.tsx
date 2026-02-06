"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { ResultBox } from "@/components/ResultBox";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { calculateFlightSpeed } from "@/lib/calculators/flightSpeed";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function FlightSpeedEstimatorPage() {
  const [distance, setDistance] = useState<number>(500);
  const [time, setTime] = useState<number>(1);
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    try {
      const calculationResult = calculateFlightSpeed(distance, time, unit);
      setResult(calculationResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation failed");
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Flight Speed Estimator", url: "/flight-speed-estimator" },
  ]);

  const toolSchema = generateToolSchema(
    "Flight Speed Estimator",
    "Calculate airplane speed in mph, km/h, and knots from flight distance and time",
    "/flight-speed-estimator"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter Flight Distance",
      description: "Input the total flight distance in miles or kilometers.",
    },
    {
      step: 2,
      title: "Enter Flight Time",
      description: "Input the total flight time in hours including any stops.",
    },
    {
      step: 3,
      title: "View Results",
      description: "Get average flight speed in mph, km/h, and knots with aviation context.",
    },
  ];

  const faqs = [
    {
      question: "What is knots in aviation?",
      answer: "Knots is a unit of speed equal to one nautical mile per hour. It's the standard unit for airspeed and maritime speed. 1 knot = 1.15078 mph.",
    },
    {
      question: "What is the typical speed of a commercial airliner?",
      answer: "Commercial airliners typically cruise at speeds between 450-575 knots (520-660 mph or 835-1,060 km/h), depending on the aircraft type and conditions.",
    },
    {
      question: "How is flight speed calculated?",
      answer: "Flight speed is calculated using the formula: Speed = Distance ÷ Time. This gives the average ground speed of the aircraft.",
    },
    {
      question: "Why use knots instead of mph?",
      answer: "Knots are used in aviation because they're based on nautical miles, which are directly related to latitude and longitude coordinates used in navigation.",
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
            Flight Speed Estimator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculate airplane speed from flight distance and time. 
            Get results in mph, km/h, and knots with aviation context.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Enter Flight Information
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
                  label="Flight Distance"
                  type="number"
                  value={distance}
                  onChange={setDistance}
                  placeholder="500"
                  min="0"
                  suffix={unit}
                />
                <InputField
                  label="Flight Time"
                  type="number"
                  value={time}
                  onChange={setTime}
                  placeholder="1"
                  min="0"
                  step="0.01"
                  suffix="hours"
                />

                <ToolButton onClick={handleCalculate} className="w-full">
                  Calculate Flight Speed
                </ToolButton>
              </div>
            </div>

            {result && (
              <div className="mt-8 space-y-6">
                <ResultBox
                  title="Speed in Knots"
                  result={`${result.knots} knots`}
                  formula={result.formula}
                />
                <ResultBox
                  title="Speed in km/h"
                  result={`${result.kmPerHour} km/h`}
                />
                <ResultBox
                  title="Speed in mph"
                  result={`${result.milesPerHour} mph`}
                />
                {result.isTypicalCommercialSpeed && (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    This is within the typical range for commercial airliners (450-575 knots).
                  </div>
                )}
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About Flight Speed
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Flight speed is a critical factor in aviation, affecting flight time, fuel consumption, and overall efficiency. Our flight speed estimator helps you calculate the average ground speed of any flight based on distance and time.
                </p>
                <p>
                  Understanding flight speeds can help you plan trips, analyze flight performance, and learn more about aviation. Commercial jets typically cruise at speeds between 450-575 knots, while private aircraft may fly at different speeds depending on their design and purpose.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "Car Speed Test", href: "/car-speed-test", description: "Calculate vehicle speed" },
                { title: "Asphalt Calculator", href: "/asphalt-calculator", description: "Calculate asphalt quantity" },
              ]}
            />
          </div>
        </div>
      </div>

      <AdBanner location="footer" />
    </div>
  );
}
