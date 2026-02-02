import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/config";
import { PlanProvider } from "@/context/PlanContext";
import { AppShell } from "@/components/AppShell";
import { AdInitializer } from "@/components/ads/AdInitializer";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Pinterest Pin Generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlanProvider>
          <AdInitializer>
            <AppShell>{children}</AppShell>
          </AdInitializer>
        </PlanProvider>
      </body>
    </html>
  );
}
