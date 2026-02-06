import React from "react";
import { generateBreadcrumbSchema } from "@/lib/schema";

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Introduction</h2>
            <p>
              MultiTool ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we handle your information when you use our 
              website and tools. By using MultiTool, you agree to the terms of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Personal Data Collection</h3>
            <p>
              <strong>MultiTool does not collect, store, or transmit any personal information.</strong> 
              All calculations and data processing happen entirely in your web browser. Your inputs, 
              results, and any information you enter never leave your device.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Automatically Collected Information</h3>
            <p>
              Like most websites, we may collect certain information automatically, including:
            </p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Time and date of visit</li>
              <li>Pages visited on our site</li>
            </ul>
            <p>
              This information is collected through standard web analytics and is used to 
              understand how visitors use our website, not to identify individual users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Improve our website and tools</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Monitor and prevent technical issues</li>
              <li>Understand which tools are most popular</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cookies and Local Storage</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Preference</h3>
            <p>
              We use your browser's local storage to save your theme preference (light/dark mode). 
              This preference is stored only on your device and is used to remember your choice 
              across visits. This information is never shared with us or any third party.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Analytics Cookies</h3>
            <p>
              We may use third-party analytics services (like Google Analytics) to collect anonymous 
              usage data. These services use cookies to help us understand how our website is used. 
              You can opt out of analytics cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not 
              responsible for the privacy practices of these third parties. We encourage you to 
              review the privacy policies of any third-party services you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
            <p>
              Since we don't collect personal information and all processing happens on your device, 
              there's no personal data for us to secure. We implement appropriate security measures 
              to protect our website infrastructure and prevent unauthorized access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
            <p>
              Since we don't collect personal information, there's no personal data for you to 
              request access to, correct, or delete. However, you have the right to:
            </p>
            <ul>
              <li>Disable cookies through your browser settings</li>
              <li>Clear your browser's local storage</li>
              <li>Opt out of analytics tracking</li>
              <li>Choose not to use our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Children's Privacy</h2>
            <p>
              Our website is not directed to children under 13. Since we don't collect personal 
              information, we do not knowingly collect information from children. If you are a 
              parent or guardian and believe your child has provided information to us, please 
              contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">International Users</h2>
            <p>
              Our website is accessible from anywhere in the world. However, since we don't 
              collect personal data, cross-border data transfers are not applicable. All processing 
              happens on your device, regardless of your location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page with an updated effective 
              date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
            <p>
              If you have questions, concerns, or feedback about this Privacy Policy, please 
              don't hesitate to contact us. We will respond to your inquiries in a timely manner.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
