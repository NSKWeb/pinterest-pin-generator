"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { ResultBox } from "@/components/ResultBox";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { calculateSATScore } from "@/lib/calculators/sat";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function SATScoreEstimatorPage() {
  const [mathScore, setMathScore] = useState<number>(600);
  const [readingWritingScore, setReadingWritingScore] = useState<number>(600);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    try {
      const calculationResult = calculateSATScore(mathScore, readingWritingScore);
      setResult(calculationResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation failed");
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "SAT Score Estimator", url: "/sat-score-estimator" },
  ]);

  const toolSchema = generateToolSchema(
    "SAT Score Estimator",
    "Calculate your total SAT score and estimated percentile from Math and Reading & Writing section scores",
    "/sat-score-estimator"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter Math Score",
      description: "Input your SAT Math section score (200-800).",
    },
    {
      step: 2,
      title: "Enter Reading & Writing Score",
      description: "Input your Evidence-Based Reading & Writing score (200-800).",
    },
    {
      step: 3,
      title: "View Total & Percentile",
      description: "See your total SAT score, percentile ranking, and college readiness indicators.",
    },
  ];

  const faqs = [
    {
      question: "What is a good SAT score?",
      answer: "A score of 1200+ is considered good and places you in the 57th percentile or higher. 1400+ is excellent and competitive for selective colleges, while 1500+ places you in the top 2% of test takers.",
    },
    {
      question: "How is the SAT scored?",
      answer: "The SAT has two sections: Math and Evidence-Based Reading & Writing. Each is scored from 200-800. Your total score is the sum of both sections, ranging from 400-1600.",
    },
    question: "What does percentile mean?",
      answer: "Percentile indicates what percentage of test takers scored lower than you. For example, a 75th percentile score means you scored higher than 75% of students who took the SAT.",
    },
    {
      question: "Is there a penalty for wrong answers?",
      answer: "No, the current SAT has no penalty for wrong answers. It's strategic to answer every question even if you need to guess.",
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
            SAT Score Estimator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculate your total SAT score and estimated percentile ranking 
            from your Math and Reading & Writing section scores.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Enter Your Section Scores
              </h2>

              <div className="space-y-6">
                <InputField
                  label="Math Score"
                  type="number"
                  value={mathScore}
                  onChange={setMathScore}
                  placeholder="600"
                  min="200"
                  max="800"
                />
                <InputField
                  label="Evidence-Based Reading & Writing Score"
                  type="number"
                  value={readingWritingScore}
                  onChange={setReadingWritingScore}
                  placeholder="600"
                  min="200"
                  max="800"
                />

                <ToolButton onClick={handleCalculate} className="w-full">
                  Calculate Total Score
                </ToolButton>
              </div>
            </div>

            {result && (
              <div className="mt-8 space-y-6">
                <ResultBox
                  title="Total SAT Score"
                  result={result.totalScore}
                  formula={result.formula}
                />
                <ResultBox
                  title="Estimated Percentile"
                  result={`Top ${100 - result.percentile}%`}
                />

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    College Readiness Indicators
                  </h3>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between rounded-lg p-4 ${
                        result.isTopTier
                          ? "bg-green-50 dark:bg-green-900/20"
                          : result.isCompetitiveForSelective
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : result.isCollegeReady
                          ? "bg-yellow-50 dark:bg-yellow-900/20"
                          : "bg-gray-50 dark:bg-slate-700"
                      }`}
                    >
                      <span className="text-gray-900 dark:text-white">College Ready</span>
                      <span
                        className={`font-bold ${
                          result.isCollegeReady
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {result.isCollegeReady ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between rounded-lg p-4 ${
                        result.isCompetitiveForSelective
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-gray-50 dark:bg-slate-700"
                      }`}
                    >
                      <span className="text-gray-900 dark:text-white">
                        Competitive for Selective Colleges
                      </span>
                      <span
                        className={`font-bold ${
                          result.isCompetitiveForSelective
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {result.isCompetitiveForSelective ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between rounded-lg p-4 ${
                        result.isTopTier ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-slate-700"
                      }`}
                    >
                      <span className="text-gray-900 dark:text-white">Top Tier Score (1500+)</span>
                      <span
                        className={`font-bold ${
                          result.isTopTier
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {result.isTopTier ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>
                  </div>
                </div>

                {result.needsImprovement && (
                  <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                    Your score indicates room for improvement. Consider focused preparation in your weaker section.
                  </div>
                )}
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About SAT Scoring
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Understanding your SAT score is crucial for college planning. The SAT consists of two main sections: Math and Evidence-Based Reading & Writing, each scored from 200-800. Your total score is the sum of both sections, ranging from 400-1600.
                </p>
                <p>
                  Our estimator helps you understand your score's context by providing percentile rankings and college readiness indicators. This information can guide your college search and preparation strategy.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "One Rep Max Calculator", href: "/one-rep-max", description: "Calculate 1RM" },
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
