import React from "react";
import Link from "next/link";

interface RelatedTool {
  title: string;
  href: string;
  description?: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Related Tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-slate-800 dark:hover:border-blue-600 dark:hover:bg-slate-700"
          >
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {tool.title}
            </h3>
            {tool.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
