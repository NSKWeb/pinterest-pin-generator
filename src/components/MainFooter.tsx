import React from "react";
import Link from "next/link";

export function MainFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    tools: [
      { name: "Asphalt Calculator", href: "/asphalt-calculator" },
      { name: "Car Speed Test", href: "/car-speed-test" },
      { name: "Flight Speed Estimator", href: "/flight-speed-estimator" },
      { name: "One Rep Max Calculator", href: "/one-rep-max" },
      { name: "SAT Score Estimator", href: "/sat-score-estimator" },
      { name: "Couple Name Generator", href: "/couple-name-generator" },
      { name: "Headcanon Generator", href: "/headcanon-generator" },
      { name: "Surname Generator", href: "/surname-generator" },
    ],
    legal: [
      { name: "About Us", href: "/about-us" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xl">
                M
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MultiTool
              </span>
            </div>
            <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
              Your comprehensive online resource for free calculators, estimators, and generators. 
              Get accurate results instantly with our easy-to-use tools.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Calculators
            </h3>
            <ul className="space-y-3">
              {footerLinks.tools.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} MultiTool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
