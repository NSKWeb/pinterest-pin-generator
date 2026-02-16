import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/config";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "AI Content Suite - Private dashboard for content generation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}
