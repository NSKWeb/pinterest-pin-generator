"use client";

import React from "react";
import { GeneratedImage } from "@/types";

interface ImageCardProps {
  image: GeneratedImage;
  onDownload: (image: GeneratedImage) => void;
  onView: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onDownload,
  onView,
  onDelete,
}) => {
  return (
    <div className="group relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-[2/3]">
      <img
        src={image.url}
        alt="Generated Pin"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onDelete(image.id)}
            className="p-2 bg-white/20 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors"
            title="Delete image"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-white text-xs font-medium">
            {image.width}x{image.height} • {Math.round(image.generationTime / 1000)}s
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onView(image)}
              className="flex-1 py-2 bg-white text-gray-900 rounded-md text-xs font-semibold flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={() => onDownload(image)}
              className="p-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
              title="Download"
            >
              <span className="text-sm">↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
