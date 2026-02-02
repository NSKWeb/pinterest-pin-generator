"use client";

import { useEffect } from "react";
import { initializeAds } from "@/lib/adManager";

interface AdInitializerProps {
  children: React.ReactNode;
}

export const AdInitializer = ({ children }: AdInitializerProps) => {
  useEffect(() => {
    // Initialize ad networks on client-side only
    initializeAds();
  }, []);

  return <>{children}</>;
};
