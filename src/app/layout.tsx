import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { MainHeader } from "@/components/MainHeader";
import { MainFooter } from "@/components/MainFooter";
import { generateWebsiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "MultiTool - Free Online Calculators & Generators",
  description: "Your comprehensive online resource for free calculators, estimators, and generators. Get accurate results instantly with our easy-to-use tools.",
  keywords: ["calculators", "generators", "tools", "asphalt calculator", "speed calculator", "name generator"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <MainHeader />
          <main className="min-h-screen">{children}</main>
          <MainFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
