"use client";

import { useState, useCallback } from "react";
import { GeneratedImage, ImageGenerationResponse } from "@/types";
import { usePlanContext } from "./usePlanContext";

export const useImageGeneration = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const { incrementUsage } = usePlanContext();

  const generateImages = useCallback(async (params: {
    prompt: string;
    negative_prompt: string;
    variations: number;
    quality: "fast" | "best";
    aspectRatio: string;
    promptId: string;
  }) => {
    setStatus("loading");
    setProgress(5);
    setMessage("Starting generation...");
    setGeneratedImages([]);

    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start generation");
      }

      const { predictionId } = await response.json();
      
      // Polling
      let completed = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5s interval

      while (!completed && attempts < maxAttempts) {
        attempts++;
        setProgress(Math.min(10 + attempts * 1.5, 95));
        
        const statusResponse = await fetch(`/api/generation-status/${predictionId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === "succeeded") {
          completed = true;
          const urls = Array.isArray(statusData.output) ? statusData.output : [statusData.output];
          
          const newImages: GeneratedImage[] = urls.map((url: string, index: number) => ({
            id: `img-${predictionId}-${index}`,
            url,
            width: params.aspectRatio === "square" ? 1024 : 768,
            height: params.aspectRatio === "square" ? 1024 : 1152,
            aspectRatio: params.aspectRatio,
            generatedAt: new Date().toISOString(),
            seed: Math.floor(Math.random() * 1000000),
            generationTime: attempts * 5000,
            model: "stable-diffusion-xl",
          }));

          setGeneratedImages(newImages);
          setStatus("success");
          setProgress(100);
          setMessage("Generation complete!");
          return newImages;
        } else if (statusData.status === "failed" || statusData.status === "canceled") {
          throw new Error(statusData.error || "Generation failed");
        }

        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      if (!completed) {
        throw new Error("Generation timed out");
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred");
    }
  }, []);

  return {
    status,
    progress,
    message,
    generatedImages,
    generateImages,
    resetStatus: () => setStatus("idle"),
  };
};
