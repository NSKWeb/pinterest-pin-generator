import React from "react";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQSection } from "@/components/FAQSection";
import { generateBreadcrumbSchema } from "@/lib/schema";

const tools = [
  {
    title: "Asphalt Calculator",
    description: "Calculate asphalt quantity needed for your project with cost estimates.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    href: "/asphalt-calculator",
    category: "Construction",
  },
  {
    title: "Car Speed Test Calculator",
    description: "Calculate vehicle speed from distance and time measurements.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    href: "/car-speed-test",
    category: "Speed",
  },
  {
    title: "Flight Speed Estimator",
    description: "Calculate airplane speed in mph, km/h, and knots.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    href: "/flight-speed-estimator",
    category: "Speed",
  },
  {
    title: "One Rep Max Calculator",
    description: "Estimate your maximum lift and training percentages.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    href: "/one-rep-max",
    category: "Fitness",
  },
  {
    title: "SAT Score Estimator",
    description: "Calculate your total SAT score and percentile ranking.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: "/sat-score-estimator",
    category: "Education",
  },
  {
    title: "Couple Name Generator",
    description: "Generate creative name combinations for couples.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    href: "/couple-name-generator",
    category: "Generators",
  },
  {
    title: "Headcanon Generator",
    description: "Generate creative headcanons for your characters.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    href: "/headcanon-generator",
    category: "Generators",
  },
  {
    title: "Surname Generator",
    description: "Generate random surnames from various origins.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    href: "/surname-generator",
    category: "Generators",
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Choose Your Tool",
    description: "Browse our collection of calculators and generators to find the perfect tool for your needs.",
  },
  {
    step: 2,
    title: "Enter Your Inputs",
    description: "Fill in the required fields with your information. Our tools are designed to be intuitive and easy to use.",
  },
  {
    step: 3,
    title: "Get Instant Results",
    description: "Receive accurate calculations and generated results instantly. No waiting, no registration required.",
  },
];

const faqs = [
  {
    question: "Are these tools free to use?",
    answer: "Yes, all our calculators and generators are completely free to use with no registration required.",
  },
  {
    question: "How accurate are the calculations?",
    answer: "Our tools use standard formulas and algorithms to provide accurate results. However, for critical decisions, always verify with professional sources.",
  },
  {
    question: "Can I use these tools on mobile devices?",
    answer: "Absolutely! All our tools are fully responsive and work perfectly on smartphones, tablets, and desktop computers.",
  },
  {
    question: "Do you store my personal information?",
    answer: "No, all calculations are performed locally in your browser. We do not collect or store any personal data or input information.",
  },
];

export default function HomePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
  ]);

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Free Online Calculators & Generators
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
            Your one-stop destination for accurate calculations and creative generators. 
            Fast, free, and easy to use.
          </p>
          <a
            href="#tools"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Explore All Tools
          </a>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Our Tools
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HowItWorks steps={howItWorksSteps} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Tool Categories
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {["Construction", "Speed", "Fitness", "Education", "Generators"].map((category) => (
              <Link
                key={category}
                href="#tools"
                className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-slate-800 dark:hover:border-blue-600 dark:hover:bg-slate-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {tools.filter((t) => t.category === category).length} tools
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-slate-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqs} />
        </div>
      </section>
    </div>
  );
}
