"use client";

import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import { ToolButton } from "@/components/ToolButton";
import { FAQSection } from "@/components/FAQSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RelatedTools } from "@/components/RelatedTools";
import { AdBanner } from "@/components/AdBanner";
import { generateHeadcanons } from "@/lib/generators/headcanon";
import { generateBreadcrumbSchema, generateToolSchema } from "@/lib/schema";

export default function HeadcanonGeneratorPage() {
  const [characterName, setCharacterName] = useState<string>("");
  const [genre, setGenre] = useState<string>("fantasy");
  const [results, setResults] = useState<any[]>([]);

  const handleGenerate = () => {
    if (!characterName.trim()) {
      alert("Please enter a character name");
      return;
    }
    const generated = generateHeadcanons(characterName, genre);
    setResults(generated);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Headcanon Generator", url: "/headcanon-generator" },
  ]);

  const toolSchema = generateToolSchema(
    "Headcanon Generator",
    "Generate creative headcanons and character ideas for stories, roleplay, or creative writing",
    "/headcanon-generator"
  );

  const howItWorksSteps = [
    {
      step: 1,
      title: "Enter Character Name",
      description: "Enter the name of your character or use a placeholder.",
    },
    {
      step: 2,
      title: "Select Genre",
      description: "Choose a genre or theme to customize the headcanons.",
    },
    {
      step: 3,
      title: "Generate Headcanons",
      description: "Get creative headcanons covering personality, backstory, relationships, and abilities.",
    },
  ];

  const faqs = [
    {
      question: "What is a headcanon?",
      answer: "A headcanon is a personal belief or interpretation about a character, story, or world that isn't officially confirmed in the original source material. It's a creative way to expand on existing characters.",
    },
    {
      question: "How does this generator work?",
      answer: "Our generator uses creative templates and patterns based on the selected genre to generate unique headcanons for your character across different categories like personality, backstory, relationships, and abilities.",
    },
    {
      question: "Can I use these for my own stories?",
      answer: "Absolutely! The generated headcanons are perfect for creative writing, roleplay, fan fiction, or developing original characters for your stories.",
    },
    {
      question: "Are the results unique each time?",
      answer: "Yes, the generator creates variations based on your input, so you can generate multiple times to get different ideas for the same character.",
    },
  ];

  const genres = [
    "Fantasy",
    "Sci-Fi",
    "Romance",
    "Mystery",
    "Adventure",
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
            Headcanon Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate creative headcanons and character ideas for stories, 
            roleplay, or creative writing projects.
          </p>
        </div>
      </section>

      <AdBanner location="header" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Character Information
              </h2>

              <div className="space-y-6">
                <InputField
                  label="Character Name"
                  type="text"
                  value={characterName}
                  onChange={setCharacterName}
                  placeholder="Aria"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Genre/Theme
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                  >
                    {genres.map((g) => (
                      <option key={g} value={g.toLowerCase()}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <ToolButton onClick={handleGenerate} className="w-full">
                  Generate Headcanons
                </ToolButton>
              </div>
            </div>

            {results.length > 0 && (
              <div className="mt-8 space-y-6">
                {results.map((headcanon, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {headcanon.category}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{headcanon.content}</p>
                  </div>
                ))}
              </div>
            )}

            <AdBanner location="middle" className="mt-8" />

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                About Headcanon Generation
              </h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Headcanons are a creative way to expand on characters, adding depth and personality that may not be explicitly stated in the original source material. Whether you're writing fan fiction, developing original characters, or roleplaying, headcanons help bring characters to life.
                </p>
                <p>
                  Our generator creates unique headcanons across multiple categories including personality traits, backstory elements, relationship dynamics, and special abilities or quirks. Each genre offers different flavor and context to make the headcanons feel authentic to your setting.
                </p>
              </div>
            </div>

            <HowItWorks steps={howItWorksSteps} />
            <FAQSection faqs={faqs} />
          </div>

          <div className="space-y-6">
            <RelatedTools
              tools={[
                { title: "Couple Name Generator", href: "/couple-name-generator", description: "Generate couple names" },
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
