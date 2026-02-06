"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { ResultBox } from "@/components/ResultBox";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { calculateAsphalt } from "@/lib/calculators/asphalt";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function AsphaltCalculatorPage() {
  const [length, setLength] = useState<number>(100);
  const [width, setWidth] = useState<number>(50);
  const [thickness, setThickness] = useState<number>(4);
  const [price, setPrice] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    try {
      const calculationResult = calculateAsphalt(
        length,
        width,
        thickness,
        price > 0 ? price : undefined
      );
      setResult(calculationResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation failed");
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Asphalt Calculator", url: "/asphalt-calculator" },
  ]);

  const toolSchema = generateToolSchema(
    "Asphalt Calculator",
    "Calculate asphalt quantity needed for construction projects with cost estimates",
    "/asphalt-calculator"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter Measurements",
      description: "Input the length and width of the area in feet, and the desired asphalt thickness in inches.",
    },
    {
      step: 2,
      title: "Add Optional Price",
      description: "Enter the price per cubic yard if you want to estimate the total cost of materials.",
    },
    {
      step: 3,
      title: "View Results",
      description: "Get instant calculations of asphalt needed in cubic yards and total cost estimate.",
    },
  ];

  const faqs = [
    {
      question: "How accurate is the asphalt calculator?",
      answer: "Our calculator uses standard formulas to estimate asphalt quantity. For large projects, always consult with a professional contractor and consider factors like compaction and waste.",
    },
    {
      question: "What is standard asphalt thickness?",
      answer: "Residential driveways typically use 2-4 inches of asphalt. Commercial parking lots usually require 4-6 inches, while heavy traffic areas may need 6-8 inches or more.",
    },
    {
      question: "How much does a cubic yard of asphalt weigh?",
      answer: "A cubic yard of hot mix asphalt typically weighs approximately 4,000 to 4,500 pounds (2,000 to 2,250 kg).",
    },
    {
      question: "Should I add extra for compaction and waste?",
      answer: "Yes, it's recommended to add 5-10% extra to account for compaction and waste. Our calculator provides the base amount needed.",
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

      {/* Header Section */}
      <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Asphalt Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Estimate asphalt quantity for your construction project with our free calculator. 
            Calculate cubic yards needed and get cost estimates instantly.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Enter Project Details
              </h2>

              <div className="space-y-6">
                <InputField
                  label="Length"
                  type="number"
                  value={length}
                  onChange={setLength}
                  placeholder="100"
                  min="0"
                  suffix="ft"
                />
                <InputField
                  label="Width"
                  type="number"
                  value={width}
                  onChange={setWidth}
                  placeholder="50"
                  min="0"
                  suffix="ft"
                />
                <InputField
                  label="Thickness"
                  type="number"
                  value={thickness}
                  onChange={setThickness}
                  placeholder="4"
                  min="0"
                  suffix="inches"
                />
                <InputField
                  label="Price per Cubic Yard (Optional)"
                  type="number"
                  value={price}
                  onChange={setPrice}
                  placeholder="100"
                  min="0"
                  suffix="$"
                />

                <ToolButton onClick={handleCalculate} className="w-full">
                  Calculate Asphalt Needed
                </ToolButton>
              </div>
            </div>

            {result && (
              <div className="mt-8 space-y-6">
                <ResultBox
                  title="Asphalt Required"
                  result={`${result.volumeCubicYards} cubic yards`}
                  formula={result.formula}
                />
                {result.cost && (
                  <ResultBox
                    title="Estimated Cost"
                    result={`$${result.cost}`}
                    show={true}
                  />
                )}
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            {/* SEO Content */}
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About Our Asphalt Calculator
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Our asphalt calculator helps construction professionals, contractors, and DIY enthusiasts estimate the amount of asphalt needed for various projects. Whether you're planning a new driveway, parking lot, or road resurfacing, accurate material estimates are crucial for budget planning and project success.
                </p>
                <p>
                  The calculator provides results in cubic yards, the standard unit for asphalt ordering in North America. Simply input your project dimensions in feet and inches, and optionally add the price per cubic yard to get a complete cost estimate.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "Car Speed Test", href: "/car-speed-test", description: "Calculate vehicle speed" },
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
