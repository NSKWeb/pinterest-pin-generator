// Pin Generator Form Component

'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/Button';
import { Loader2, Sparkles, Upload, Palette } from 'lucide-react';

interface PinGeneratorFormProps {
  onPinGenerated: (pin: any) => void;
}

interface FormData {
  title: string;
  text: string;
  niche: string;
  style: string;
  aspectRatio: '2:3' | '1:1' | '4:5';
  fontColor: string;
  backgroundColor: string;
  template: string;
  backgroundImage: string | null;
}

const aspectRatios = [
  { value: '2:3', label: '2:3', description: 'Standard Pinterest' },
  { value: '1:1', label: '1:1', description: 'Square' },
  { value: '4:5', label: '4:5', description: 'Vertical' },
];

const templates = [
  { value: 'minimal', label: 'Minimal', description: 'Clean and simple' },
  { value: 'bold', label: 'Bold', description: 'Eye-catching' },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated' },
  { value: 'vibrant', label: 'Vibrant', description: 'Colorful' },
];

const colors = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#E74C3C', '#2ECC71',
];

export function PinGeneratorForm({ onPinGenerated }: PinGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    text: '',
    niche: '',
    style: 'minimal',
    aspectRatio: '2:3',
    fontColor: '#FFFFFF',
    backgroundColor: '#6366F1',
    template: 'minimal',
    backgroundImage: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/pins/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onPinGenerated(data.data);
      } else {
        const mockPin = createMockPin(formData);
        onPinGenerated(mockPin);
      }
    } catch (error) {
      const mockPin = createMockPin(formData);
      onPinGenerated(mockPin);
    } finally {
      setIsLoading(false);
    }
  };

  const createMockPin = (data: FormData): any => {
    return {
      id: Date.now().toString(),
      title: data.title || data.text.substring(0, 30),
      description: `A ${data.style} ${data.aspectRatio} Pinterest pin`,
      text: data.text,
      backgroundImage: data.backgroundImage,
      textPosition: { x: 50, y: 70 },
      fontSize: data.style === 'bold' ? 48 : 32,
      fontColor: data.fontColor,
      backgroundColor: data.backgroundColor,
      aspectRatio: data.aspectRatio,
      template: data.template,
      createdAt: new Date(),
    };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // For demo, create a local URL
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, backgroundImage: url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateFromAI = async () => {
    if (!formData.text.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/pins/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.data?.imageUrl) {
        setFormData(prev => ({ 
          ...prev, 
          backgroundImage: data.data.imageUrl,
          backgroundColor: data.data.backgroundColor || prev.backgroundColor
        }));
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Create New Pin</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Pin title"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Main Text */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Pin Text *
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Text to display on the pin..."
            className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            required
          />
        </div>

        {/* Niche */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Target Niche
          </label>
          <select
            value={formData.niche}
            onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select niche...</option>
            <option value="food">Food & Recipes</option>
            <option value="fitness">Fitness & Health</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="business">Business & Finance</option>
            <option value="travel">Travel</option>
            <option value="fashion">Fashion & Beauty</option>
            <option value="diy">DIY & Home</option>
            <option value="education">Education</option>
          </select>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Aspect Ratio
          </label>
          <div className="flex gap-2">
            {aspectRatios.map(ratio => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, aspectRatio: ratio.value as any }))}
                className={`
                  flex-1 py-2 px-3 rounded-lg border transition-colors text-center
                  ${formData.aspectRatio === ratio.value
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }
                `}
              >
                <p className="font-medium">{ratio.label}</p>
                <p className="text-xs opacity-70">{ratio.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Style Template
          </label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map(template => (
              <button
                key={template.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, template: template.value, style: template.value }))}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${formData.template === template.value
                    ? 'bg-indigo-600/20 border-indigo-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                <p className="text-sm font-medium text-white">{template.label}</p>
                <p className="text-xs text-gray-400">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Text Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.slice(0, 8).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, fontColor: color }))}
                  className={`
                    w-8 h-8 rounded-lg border-2 transition-all
                    ${formData.fontColor === color ? 'border-white scale-110' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Background Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.slice().map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, backgroundColor: color }))}
                  className={`
                    w-8 h-8 rounded-lg border-2 transition-all
                    ${formData.backgroundColor === color ? 'border-white scale-110' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Background Image (optional)
          </label>
          
          {formData.backgroundImage ? (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={formData.backgroundImage} 
                alt="Background" 
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, backgroundImage: null }))}
                className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded text-xs"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={handleGenerateFromAI}
                  disabled={isLoading || !formData.text.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generate AI
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading || !formData.text.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Pin...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Palette className="w-4 h-4" />
              Create Pin
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}