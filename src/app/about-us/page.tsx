import React from "react";
import { generateBreadcrumbSchema } from "@/lib/schema";

export default function AboutUsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            About MultiTool
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your trusted source for free online calculators, estimators, and generators.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            <p>
              MultiTool was created with a simple mission: to provide fast, accurate, and easy-to-use online tools that help people with their everyday calculations and creative needs. We believe that everyone should have access to reliable tools without barriers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What We Offer</h2>
            <p>
              Our collection of tools is designed to help you with various tasks:
            </p>
            <ul>
              <li><strong>Construction Calculators:</strong> Plan your projects with materials estimation</li>
              <li><strong>Speed Calculators:</strong> Calculate vehicle and flight speeds</li>
              <li><strong>Fitness Tools:</strong> Estimate strength and plan your workouts</li>
              <li><strong>Education Tools:</strong> Understand test scores and percentiles</li>
              <li><strong>Name Generators:</strong> Get creative with couple names and surnames</li>
              <li><strong>Creative Tools:</strong> Generate character headcanons and ideas</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Commitment</h2>
            <p>
              We are committed to providing tools that are:
            </p>
            <ul>
              <li><strong>Free:</strong> All our tools are completely free to use</li>
              <li><strong>Fast:</strong> Get instant results without waiting</li>
              <li><strong>Private:</strong> All calculations happen in your browser</li>
              <li><strong>Accessible:</strong> Works on all devices and screen sizes</li>
              <li><strong>Accurate:</strong> Using proven formulas and reliable data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy First</h2>
            <p>
              We take your privacy seriously. All calculations are performed directly in your browser. We don't collect, store, or share any of your personal data or input information. Your inputs stay on your device.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
            <p>
              We value your feedback and suggestions. If you have questions, ideas for new tools, or encounter any issues, please don't hesitate to reach out. We're constantly working to improve our tools and add new features based on user feedback.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Why Choose MultiTool?
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">No Registration Required</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start using tools immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Mobile-Friendly</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Works on all devices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Instant Results</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No waiting or loading</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">No Data Collection</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your privacy is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
