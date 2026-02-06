"use client";

import React, { useState } from "react";
import { ToolButton } from "@/components/ToolButton";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { generateSurnames } from "@/lib/generators/surname";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function SurnameGeneratorPage() {
  const [category, setCategory] = useState<string>("english");
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = () => {
    const generated = generateSurnames(category);
    setResults(generated);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Surname Generator", url: "/surname-generator" },
  ]);

  const toolSchema = generateToolSchema(
    "Surname Generator",
    "Generate random surnames and last names from various categories and origins",
    "/surname-generator"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Choose Category",
      description: "Select a surname category or origin from the available options.",
    },
    {
      step: 2,
      title: "Generate",
      description: "Click generate to get 10 random surnames from your chosen category.",
    },
    {
      step: 3,
      title: "Repeat or Mix",
      description: "Generate again for more options or try different categories.",
    },
  ];

  const faqs = [
    {
      question: "How many surnames are generated?",
      answer: "Our generator produces 10 random surnames each time you click generate. You can generate as many times as you like for more options.",
    },
    {
      question: "Are these real surnames?",
      answer: "Yes, all surnames in our database are real names from the selected category or origin. However, they may not reflect all variants and spellings.",
    },
    {
      question: "What categories are available?",
      answer: "We offer categories including English, Fantasy, Japanese, Scandinavian, and Celtic surnames. Each category contains authentic names from those cultures.",
    },
    {
      question: "Can I use these for my stories?",
      answer: "Absolutely! These surnames are perfect for creative writing, character creation, roleplay, or any other creative projects.",
    },
  ];

  const categories = [
    { value: "english", label: "English", icon: "🇬🇧" },
    { value: "fantasy", label: "Fantasy", icon: "⚔️" },
    { value: "japanese", label: "Japanese", icon: "🇯🇵" },
    { value: "scandinavian", label: "Scandinavian", icon: "🇸🇪" },
    { value: "celtic", label: "Celtic", icon: "☘️" },
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
            Surname Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate random surnames and last names from various categories 
            and origins for your characters or creative projects.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Select Category
              </h2>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
                      category === cat.value
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              <ToolButton onClick={handleGenerate} className="w-full">
                Generate Surnames
              </ToolButton>
            </div>

            {results.length > 0 && (
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Generated {categories.find((c) => c.value === category)?.label} Surnames
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.map((surname, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 text-center font-medium text-gray-900 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-white"
                    >
                      {surname}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About Surname Generation
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Surnames, also known as last names or family names, carry rich cultural heritage and meaning. Our surname generator provides authentic names from various cultures and origins, perfect for character creation, world-building, or creative writing projects.
                </p>
                <p>
                  From traditional English surnames to fantasy-inspired names, our collection spans multiple cultures. Each category contains names that reflect the linguistic patterns and traditions of their respective origins.
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
