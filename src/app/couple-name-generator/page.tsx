"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { ResultBox } from "@/components/ResultBox";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { generateCoupleNames } from "@/lib/generators/coupleName";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function CoupleNameGeneratorPage() {
  const [name1, setName1] = useState<string>("");
  const [name2, setName2] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!name1.trim() || !name2.trim()) {
      alert("Please enter both names");
      return;
    }
    const generated = generateCoupleNames(name1, name2);
    setResults(generated);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Couple Name Generator", url: "/couple-name-generator" },
  ]);

  const toolSchema = generateToolSchema(
    "Couple Name Generator",
    "Generate creative name combinations for couples using various blending and mixing techniques",
    "/couple-name-generator"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter First Name",
      description: "Enter the first person's name (first or full name).",
    },
    {
      step: 2,
      title: "Enter Second Name",
      description: "Enter the second person's name (first or full name).",
    },
    {
      step: 3,
      title: "Generate Combinations",
      description: "Get multiple creative name combinations using different blending techniques.",
    },
  ];

  const faqs = [
    {
      question: "How does the couple name generator work?",
      answer: "Our generator uses several techniques including syllable mixing, name blending, prefix/suffix combinations, and nickname styles to create unique name combinations.",
    },
    {
      question: "Can I use full names?",
      answer: "Yes, you can use first names or full names. The generator works best with first names but can create interesting combinations with full names too.",
    },
    {
      question: "Are these real names?",
      answer: "The generated names are creative combinations and may not correspond to actual names. They're perfect for fun, creative projects, or just for entertainment.",
    },
    {
      question: "How many combinations are generated?",
      answer: "Our generator creates up to 8 different name combinations using various blending and mixing techniques.",
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
            Couple Name Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate creative name combinations for couples using various 
            blending and mixing techniques.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Enter Two Names
              </h2>

              <div className="space-y-6">
                <InputField
                  label="First Name"
                  type="text"
                  value={name1}
                  onChange={setName1}
                  placeholder="John"
                />
                <InputField
                  label="Second Name"
                  type="text"
                  value={name2}
                  onChange={setName2}
                  placeholder="Jane"
                />

                <ToolButton onClick={handleGenerate} className="w-full">
                  Generate Couple Names
                </ToolButton>
              </div>
            </div>

            {results.length > 0 && (
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Generated Name Combinations
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.map((name, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 text-center font-medium text-gray-900 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-white"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About Couple Name Generation
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Couple names, also known as "portmanteau" names, combine two names to create a unique hybrid. Our generator uses multiple techniques to create creative combinations perfect for fun, romance, or creative projects.
                </p>
                <p>
                  From simple syllable mixing to complex letter blending, our algorithm creates diverse options. These generated names are perfect for social media handles, creative writing, or just for fun with your partner.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "Headcanon Generator", href: "/headcanon-generator", description: "Generate character ideas" },
                { title: "Surname Generator", href: "/surname-generator", description: "Generate surnames" },
              ]}
            />
          </div>
        </div>
      </div>

      <AdBanner location="footer" />
    </div>
  );
}
