import React from "react";
import { generateBreadcrumbSchema } from "@/lib/schema";

export default function DisclaimerPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Disclaimer", url: "/disclaimer" },
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
            Disclaimer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please read this disclaimer carefully before using our tools.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">General Disclaimer</h2>
            <p>
              The information, calculations, and results provided by MultiTool are for 
              <strong> informational and educational purposes only</strong>. While we strive 
              to provide accurate and reliable tools, we make no representations or warranties 
              of any kind, express or implied, about the completeness, accuracy, reliability, 
              suitability, or availability of the tools or the information contained within.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calculators</h2>
            <p>
              All calculators provided on this website are designed to provide estimates 
              based on standard formulas and accepted methods. The results are:
            </p>
            <ul>
              <li><strong>Estimates only</strong> and may not reflect exact real-world values</li>
              <li><strong>Not professional advice</strong> and should not be relied upon for critical decisions</li>
              <li><strong>Not substitutes</strong> for professional consultation or expert opinion</li>
              <li><strong>Subject to variations</strong> due to real-world factors not accounted for in calculations</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Specific Tool Disclaimers</h3>
            
            <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">Asphalt Calculator</h4>
            <p>
              Results are estimates based on basic volume calculations. Factors such as compaction 
              rates, waste, varying thickness, and sub-grade conditions are not accounted for. 
              Always consult with a professional contractor for project estimates.
            </p>

            <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">Speed Calculators</h4>
            <p>
              Calculations provide average speed estimates. Actual speeds may vary due to traffic, 
              road conditions, weather, stops, and other factors. These tools are not suitable for 
              legal or official purposes.
            </p>

            <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">One Rep Max Calculator</h4>
            <p>
              Uses the Epley formula which is an estimation method. Actual 1RM may vary based on 
              individual factors. Always test gradually with proper supervision and spotting when 
              attempting heavy lifts.
            </p>

            <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">SAT Score Estimator</h4>
            <p>
              Provides total score calculation and estimated percentile based on historical data. 
              Percentile ranges are approximate and may vary by test administration year. Check 
              official College Board resources for the most current information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generators</h2>
            <p>
              All generators on this website create content for <strong>entertainment and 
              creative purposes only</strong>. Generated content is:
            </p>
            <ul>
              <li><strong>Not based on real individuals</strong> unless you specifically input real names</li>
              <li><strong>Not verified or validated</strong> for accuracy or authenticity</li>
              <li><strong>Not suitable</strong> for official, legal, or professional use</li>
              <li><strong>Intended for creative projects</strong>, roleplay, writing, or entertainment</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Couple Name Generator</h3>
            <p>
              Generated names are creative combinations and may not correspond to actual names or 
              nicknames. They are meant for fun and creative purposes only.
            </p>

            <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">Headcanon Generator</h3>
            <p>
              Generates fictional character backgrounds and traits. These are entirely fictional 
              and meant for creative writing, roleplay, or entertainment purposes.
            </p>

            <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">Surname Generator</h3>
            <p>
              While the surnames in our database are real names, the random selection is for 
              creative purposes. Any resemblance to actual individuals is coincidental.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Limitation of Liability</h2>
            <p>
              In no event shall MultiTool or its creators be liable for any damages arising from 
              the use or inability to use our tools, including but not limited to direct, indirect, 
              incidental, punitive, and consequential damages. This includes any damages resulting 
              from errors, omissions, inaccuracies, or reliance on the information provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Advice</h2>
            <p>
              Our tools do not constitute professional advice in any field, including but not 
              limited to:
            </p>
            <ul>
              <li>Construction and engineering</li>
              <li>Financial planning</li>
              <li>Health and fitness</li>
              <li>Education and testing</li>
              <li>Legal matters</li>
            </ul>
            <p>
              Always consult with qualified professionals for specific advice related to your situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Accuracy and Timeliness</h2>
            <p>
              While we make efforts to ensure our tools are accurate and up-to-date, we cannot 
              guarantee that all information is current or error-free. Formulas, data, and methods 
              may be updated periodically without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">External Links</h2>
            <p>
              Our website may contain links to external websites. We are not responsible for the 
              content, accuracy, or opinions expressed on external sites. Providing links does not 
              constitute endorsement of those sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Changes and Updates</h2>
            <p>
              We reserve the right to modify, update, or discontinue any of our tools or services 
              at any time without prior notice. We may also update this disclaimer periodically. 
              Continued use of our tools constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Age Requirement</h2>
            <p>
              By using our website, you confirm that you are at least 13 years old or have parental 
              consent. Some tools may be more suitable for adult users. Parents and guardians should 
              supervise minors' use of our tools.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acknowledgment</h2>
            <p>
              By using MultiTool and any of our tools, you acknowledge that you have read, understood, 
              and agree to this disclaimer. You agree to use all information and results at your own 
              risk and discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact</h2>
            <p>
              If you have questions about this disclaimer or our tools, please contact us. We are 
              happy to provide clarification or address any concerns you may have.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
