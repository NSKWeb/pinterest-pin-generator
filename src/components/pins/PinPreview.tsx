// Pin Preview Component

'use client';

import { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  Palette,
  Type,
  Move,
  RotateCcw
} from 'lucide-react';

interface PinPreviewProps {
  pin: {
    id: string;
    title: string;
    description: string;
    text: string;
    backgroundImage?: string;
    textPosition: { x: number; y: number };
    fontSize: number;
    fontColor: string;
    backgroundColor?: string;
    aspectRatio: '2:3' | '1:1' | '4:5';
    template?: string;
  };
}

export function PinPreview({ pin }: PinPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    const json = JSON.stringify(pin, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions based on aspect ratio
    const baseWidth = 1000;
    let baseHeight = 1000;
    
    if (pin.aspectRatio === '2:3') baseHeight = 1500;
    else if (pin.aspectRatio === '4:5') baseHeight = 1250;
    
    canvas.width = baseWidth;
    canvas.height = baseHeight;
    
    if (ctx) {
      // Fill background
      ctx.fillStyle = pin.backgroundColor || '#6366F1';
      ctx.fillRect(0, 0, baseWidth, baseHeight);
      
      // Add background image if provided
      if (pin.backgroundImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, baseWidth, baseHeight);
          addText();
        };
        img.src = pin.backgroundImage;
      } else {
        addText();
      }
    }
    
    function addText() {
      if (!ctx) return;
      
      // Set text style
      ctx.fillStyle = pin.fontColor;
      ctx.font = `bold ${pin.fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Calculate text position
      const x = (pin.textPosition.x / 100) * baseWidth;
      const y = (pin.textPosition.y / 100) * baseHeight;
      
      // Add text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw text
      const lines = pin.text.split('\n');
      const lineHeight = pin.fontSize * 1.2;
      const startY = y - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
      });
      
      // Download
      const link = document.createElement('a');
      link.download = `pin-${pin.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const getAspectRatioStyle = () => {
    switch (pin.aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '2:3':
        return 'aspect-[2/3]';
      case '4:5':
        return 'aspect-[4/5]';
      default:
        return 'aspect-[2/3]';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{pin.title}</h3>
              <p className="text-sm text-gray-400">{pin.aspectRatio} • {pin.template}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Copy JSON"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className={`p-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-950 p-8' : ''}`}>
        <div className="flex justify-center">
          <div className={`
            max-w-sm w-full ${getAspectRatioStyle()} relative rounded-xl overflow-hidden shadow-2xl
            ${isFullscreen ? 'max-w-2xl' : ''}
          `}>
            {/* Background */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: pin.backgroundColor || '#6366F1' }}
            >
              {pin.backgroundImage && (
                <img 
                  src={pin.backgroundImage} 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-80"
                />
              )}
            </div>
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex items-end p-6">
              <div 
                className="w-full"
                style={{
                  position: 'relative',
                  transform: `translate(${(pin.textPosition.x - 50)}%, ${(pin.textPosition.y - 80)}%)`,
                  textAlign: 'center',
                }}
              >
                <p 
                  className="font-bold leading-tight drop-shadow-lg"
                  style={{
                    color: pin.fontColor,
                    fontSize: `${pin.fontSize * (isFullscreen ? 2 : 1)}px`,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {pin.text}
                </p>
              </div>
            </div>

            {/* Aspect ratio indicator */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                {pin.aspectRatio}
              </span>
            </div>

            {/* Template indicator */}
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm capitalize">
                {pin.template}
              </span>
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Colors:</span>
            <div 
              className="w-6 h-6 rounded border-2 border-gray-600"
              style={{ backgroundColor: pin.fontColor }}
              title={`Text: ${pin.fontColor}`}
            />
            <div 
              className="w-6 h-6 rounded border-2 border-gray-600"
              style={{ backgroundColor: pin.backgroundColor || '#6366F1' }}
              title={`Background: ${pin.backgroundColor}`}
            />
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-gray-400 mb-1">Font Size</p>
            <p className="text-white font-medium">{pin.fontSize}px</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-gray-400 mb-1">Text Position</p>
            <p className="text-white font-medium">X: {pin.textPosition.x}%, Y: {pin.textPosition.y}%</p>
          </div>
        </div>

        {/* Description */}
        {pin.description && (
          <div className="mt-4 bg-gray-800/30 rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-1">Description</p>
            <p className="text-sm text-gray-300">{pin.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Pin
          </button>
          <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
            <Move className="w-4 h-4" />
          </button>
          <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}