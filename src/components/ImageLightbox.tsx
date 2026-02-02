"use client";

import React from "react";
import { GeneratedImage } from "@/types";
import { Modal } from "./Modal";

interface ImageLightboxProps {
  image: GeneratedImage | null;
  images: GeneratedImage[];
  onClose: () => void;
  onDownload: (image: GeneratedImage) => void;
  onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  image,
  images,
  onClose,
  onDownload,
  onNavigate,
}) => {
  if (!image) return null;

  const currentIndex = images.findIndex((img) => img.id === image.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <Modal isOpen={!!image} onClose={onClose} title="Image Preview">
      <div className="relative group">
        <div className="aspect-[2/3] max-h-[70vh] w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
          <img
            src={image.url}
            alt="Preview"
            className="h-full w-auto object-contain"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md transition-opacity ${
                currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white"
              }`}
            >
              <span className="text-xl">←</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md transition-opacity ${
                currentIndex === images.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white"
              }`}
            >
              <span className="text-xl">→</span>
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>Size: {image.width} x {image.height}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Time: {Math.round(image.generationTime / 1000)}s</span>
          </div>
          <div className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase text-gray-600">
            {image.model.split("/").pop()}
          </div>
        </div>

        <button
          onClick={() => onDownload(image)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Download Image
        </button>
      </div>
    </Modal>
  );
};

export default ImageLightbox;
