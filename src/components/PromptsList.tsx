"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import type { ImagePrompt, PinIdea, GeneratedImage } from "@/types";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import GenerationOptions from "./GenerationOptions";
import GenerationStatus from "./GenerationStatus";
import ImageGrid from "./ImageGrid";
import ImageLightbox from "./ImageLightbox";
import { downloadImage } from "@/utils/downloadUtils";
import { saveImageToDB, getImagesFromDB, deleteImageFromDB } from "@/utils/idb";

type PromptsListProps = {
  idea: PinIdea | null;
  prompts: ImagePrompt[];
  onCopy: (value: string) => void;
};

export const PromptsList = ({ idea, prompts, onCopy }: PromptsListProps) => {
  const [activePromptId, setActivePromptId] = useState<string | null>(prompts[0]?.id ?? null);
  const [quality, setQuality] = useState<"fast" | "best">("fast");
  const [variations, setVariations] = useState<1 | 2 | 3>(1);
  const [aspectRatio, setAspectRatio] = useState<"1000x1500" | "square" | "vertical">("1000x1500");
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [allGeneratedImages, setAllGeneratedImages] = useState<Record<string, GeneratedImage[]>>({});

  const { status, progress, message, generatedImages, generateImages } = useImageGeneration();

  useEffect(() => {
    setActivePromptId(prompts[0]?.id ?? null);
  }, [prompts]);

  // Load images from DB on mount or when active prompt changes
  useEffect(() => {
    const loadImages = async () => {
      const storedImages = await getImagesFromDB();
      const grouped: Record<string, GeneratedImage[]> = {};
      storedImages.forEach((img) => {
        if (!grouped[img.promptId]) grouped[img.promptId] = [];
        grouped[img.promptId].push({
          id: img.id,
          url: img.imageUrl,
          width: img.aspectRatio === "square" ? 1024 : 768,
          height: img.aspectRatio === "square" ? 1024 : 1152,
          aspectRatio: img.aspectRatio,
          generatedAt: img.generatedAt,
          seed: 0,
          generationTime: img.generationTime,
          model: "stable-diffusion-xl",
        });
      });
      setAllGeneratedImages(grouped);
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (status === "success" && activePromptId && generatedImages.length > 0) {
      const newImages = generatedImages;
      setAllGeneratedImages((prev) => ({
        ...prev,
        [activePromptId]: [...(prev[activePromptId] || []), ...newImages],
      }));

      // Save to IndexedDB
      newImages.forEach((img) => {
        saveImageToDB({
          id: img.id,
          ideaId: idea?.id || "",
          promptId: activePromptId,
          imageUrl: img.url,
          generatedAt: img.generatedAt,
          prompt: activePrompt.main_prompt,
          generationTime: img.generationTime,
          pinTitle: idea?.title || "",
          aspectRatio: img.aspectRatio,
        });
      });
    }
  }, [status, generatedImages, activePromptId, idea, activePrompt]);

  if (!idea || !prompts.length) {
    return null;
  }

  const activePrompt = prompts.find((prompt) => prompt.id === activePromptId) ?? prompts[0];

  const handleGenerate = async () => {
    if (!activePrompt) return;
    await generateImages({
      prompt: activePrompt.main_prompt,
      negative_prompt: activePrompt.negative_prompt,
      variations,
      quality,
      aspectRatio,
      promptId: activePrompt.id,
    });
  };

  const handleDownloadAll = async () => {
    const imagesToDownload = currentPromptImages.map((img, index) => ({
      url: img.url,
      filename: `pin-${idea.title.toLowerCase().replace(/\s+/g, "-")}-${activePromptId?.slice(-4)}-${index + 1}.png`,
    }));
    
    for (const img of imagesToDownload) {
      await downloadImage(img.url, img.filename);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all generated images for this prompt?")) {
      if (!activePromptId) return;
      const imagesToDelete = allGeneratedImages[activePromptId] || [];
      for (const img of imagesToDelete) {
        await deleteImageFromDB(img.id);
      }
      setAllGeneratedImages((prev) => ({
        ...prev,
        [activePromptId]: [],
      }));
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Prompt Variations</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{idea.title}</h2>
          <p className="mt-2 text-sm text-white/70">{idea.description}</p>
        </div>
        <Button variant="ghost" onClick={() => onCopy(prompts.map((prompt) => prompt.main_prompt).join("\n\n"))}>
          Copy All
        </Button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={prompt.id}
            type="button"
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              prompt.id === activePrompt.id
                ? "border-primary bg-primary/20 text-white"
                : "border-white/10 text-white/60 hover:border-primary/60"
            }`}
            onClick={() => setActivePromptId(prompt.id)}
          >
            Variation {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <details className="rounded-2xl border border-white/10 bg-white/5 p-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
            Main Prompt
          </summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Prompt details</span>
            <Button variant="ghost" onClick={() => onCopy(activePrompt.main_prompt)} className="px-3 py-1.5 text-xs">
              Copy
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/70">{activePrompt.main_prompt}</p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 p-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
            Style Guide
          </summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Style notes</span>
            <Button variant="ghost" onClick={() => onCopy(activePrompt.style_guide)} className="px-3 py-1.5 text-xs">
              Copy
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/70">{activePrompt.style_guide}</p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 p-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
            Negative Prompt
          </summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Avoid</span>
            <Button
              variant="ghost"
              onClick={() => onCopy(activePrompt.negative_prompt)}
              className="px-3 py-1.5 text-xs"
            >
              Copy
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/70">{activePrompt.negative_prompt}</p>
        </details>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Generation Settings</h3>
          <GenerationOptions
            quality={quality}
            setQuality={setQuality}
            variations={variations}
            setVariations={setVariations}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onGenerate={handleGenerate}
            isLoading={status === "loading"}
          />
          
          <GenerationStatus
            status={status}
            progress={progress}
            message={message}
            onRetry={handleGenerate}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Generated Pins</h3>
            {currentPromptImages.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear history
                </button>
                <button
                  onClick={handleDownloadAll}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Download all
                </button>
              </div>
            )}
          </div>
          <ImageGrid
            images={currentPromptImages}
            onDownload={handleDownload}
            onView={setSelectedImage}
            onDelete={handleDeleteImage}
            isLoading={status === "loading"}
            variationCount={variations}
          />
        </div>
      </div>

      <ImageLightbox
        image={selectedImage}
        images={currentPromptImages}
        onClose={() => setSelectedImage(null)}
        onDownload={handleDownload}
        onNavigate={(index) => setSelectedImage(currentPromptImages[index])}
      />
    </div>
  );
};
