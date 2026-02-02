"use client";

import React from "react";
import { GeneratedImage } from "@/types";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage) => void;
  onView: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  variationCount?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onDownload,
  onView,
  onDelete,
  isLoading,
  variationCount = 1,
}) => {
  if (isLoading && images.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: variationCount }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">No images generated yet for this prompt.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDownload={onDownload}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
      {isLoading &&
        Array.from({ length: Math.max(0, variationCount - images.length) }).map(
          (_, i) => (
            <div
              key={`loading-${i}`}
              className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
            />
          ),
        )}
    </div>
  );
};

export default ImageGrid;
