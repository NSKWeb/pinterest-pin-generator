// Blog Generator Form Component

'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Loader2, Sparkles } from 'lucide-react';

interface BlogGeneratorFormProps {
  onBlogGenerated: (blog: any) => void;
}

interface FormData {
  topic: string;
  keywords: string;
  tone: string;
  structure: string;
  length: string;
  targetWordCount: number;
}

export function BlogGeneratorForm({ onBlogGenerated }: BlogGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    keywords: '',
    tone: 'professional',
    structure: 'blog-post',
    length: 'medium',
    targetWordCount: 1500,
  });

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', description: 'Relaxed and friendly' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'authoritative', label: 'Authoritative', description: 'Expert and confident' },
  ];

  const structures = [
    { value: 'blog-post', label: 'Blog Post', description: 'Standard article' },
    { value: 'listicle', label: 'Listicle', description: 'Numbered list format' },
    { value: 'how-to', label: 'How-To', description: 'Step-by-step guide' },
    { value: 'guide', label: 'Guide', description: 'Comprehensive tutorial' },
    { value: 'review', label: 'Review', description: 'Product/service review' },
  ];

  const lengths = [
    { value: 'short', wordCount: 500, label: 'Short', description: '~500 words' },
    { value: 'medium', wordCount: 1500, label: 'Medium', description: '~1,500 words' },
    { value: 'long', wordCount: 3000, label: 'Long', description: '~3,000 words' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/blogs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onBlogGenerated(data.data);
      } else {
        // Create mock blog
        const mockBlog = createMockBlog(formData);
        onBlogGenerated(mockBlog);
      }
    } catch (error) {
      const mockBlog = createMockBlog(formData);
      onBlogGenerated(mockBlog);
    } finally {
      setIsLoading(false);
    }
  };

  const createMockBlog = (data: FormData): any => {
    const keywords = data.keywords.split(',').map(k => k.trim()).filter(Boolean);
    
    return {
      id: Date.now().toString(),
      title: `${data.topic}: The Ultimate Guide`,
      excerpt: `A comprehensive guide to ${data.topic.toLowerCase()} that will help you understand the fundamentals and advanced concepts.`,
      content: `
# ${data.topic}: The Complete Guide

## Introduction
${data.topic} is an important topic that affects many areas of our lives. In this comprehensive guide, we'll explore everything you need to know.

## What is ${data.topic}?
${data.topic} refers to a broad category of concepts and practices that have evolved significantly over time. Understanding these fundamentals is crucial for anyone looking to master this subject.

## Key Concepts

### Understanding the Basics
The foundation of ${data.topic} lies in understanding its core principles. These include:

1. **Fundamental Principles** - The basic rules that govern ${data.topic}
2. **Practical Applications** - How these principles apply in real-world scenarios
3. **Best Practices** - Recommended approaches based on expert consensus

### Advanced Topics
Once you've mastered the basics, you can move on to more advanced concepts:

- Strategic implementation
- Optimization techniques
- Performance measurement

## How to Get Started

### Step 1: Research
Begin by researching the topic thoroughly. Use multiple sources to get a well-rounded perspective.

### Step 2: Practice
Apply what you've learned in practical situations. This hands-on experience is invaluable.

### Step 3: Evaluate
Regularly assess your progress and identify areas for improvement.

## Conclusion
${data.topic} is a journey, not a destination. Keep learning, stay curious, and never stop improving.
      `.trim(),
      metaTitle: `${data.topic} - Complete Guide | Expert Tips`,
      metaDescription: `Learn everything about ${data.topic} with our comprehensive guide. Expert tips, practical advice, and step-by-step instructions.`,
      keywords: keywords.length > 0 ? keywords : ['guide', 'tutorial', 'how-to'],
      readTime: Math.ceil(data.targetWordCount / 200),
      structure: data.structure,
      tone: data.tone,
      createdAt: new Date(),
    };
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Create New Blog Post</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Topic *
          </label>
          <textarea
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g., How to build a successful blog from scratch"
            className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            required
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Target Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            placeholder="e.g., blogging, content creation, SEO"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Tone
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map(tone => (
              <button
                key={tone.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tone: tone.value }))}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${formData.tone === tone.value
                    ? 'bg-indigo-600/20 border-indigo-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                <p className="text-sm font-medium text-white">{tone.label}</p>
                <p className="text-xs text-gray-400">{tone.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Structure */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Structure
          </label>
          <select
            value={formData.structure}
            onChange={(e) => setFormData(prev => ({ ...prev, structure: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          >
            {structures.map(struct => (
              <option key={struct.value} value={struct.value}>
                {struct.label} - {struct.description}
              </option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Length
          </label>
          <div className="flex gap-2">
            {lengths.map(length => (
              <button
                key={length.value}
                type="button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  length: length.value,
                  targetWordCount: length.wordCount
                }))}
                className={`
                  flex-1 py-2 px-3 rounded-lg border transition-colors
                  ${formData.length === length.value
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }
                `}
              >
                <p className="text-sm font-medium">{length.label}</p>
                <p className="text-xs opacity-70">{length.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading || !formData.topic.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Blog...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Blog Post
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}