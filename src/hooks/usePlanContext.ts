"use client";

import { useContext } from "react";
import { PlanContext } from "@/context/PlanContext";

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within PlanProvider");
  }
  return context;
};
