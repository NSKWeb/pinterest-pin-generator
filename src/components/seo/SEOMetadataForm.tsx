// SEO Metadata Form Component

'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Loader2, Search, Sparkles } from 'lucide-react';

interface SEOMetadataFormProps {
  onSEOGenerated: (seo: any) => void;
}

interface FormData {
  title: string;
  content: string;
  keywords: string;
  type: string;
  url: string;
}

const contentTypes = [
  { value: 'page', label: 'Web Page' },
  { value: 'article', label: 'Article' },
  { value: 'product', label: 'Product' },
  { value: 'image', label: 'Image' },
];

export function SEOMetadataForm({ onSEOGenerated }: SEOMetadataFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    keywords: '',
    type: 'page',
    url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSEOGenerated(data.data);
      } else {
        const mockSEO = createMockSEO(formData);
        onSEOGenerated(mockSEO);
      }
    } catch (error) {
      const mockSEO = createMockSEO(formData);
      onSEOGenerated(mockSEO);
    } finally {
      setIsLoading(false);
    }
  };

  const createMockSEO = (data: FormData): any => {
    const keywords = data.keywords.split(',').map(k => k.trim()).filter(Boolean);
    
    return {
      id: Date.now().toString(),
      title: data.title,
      description: data.content ? data.content.substring(0, 150) : `Information about ${data.title.toLowerCase()}`,
      keywords: keywords.length > 0 ? keywords : ['guide', 'information'],
      ogTitle: data.title,
      ogDescription: data.content ? data.content.substring(0, 150) : `Learn about ${data.title.toLowerCase()}`,
      twitterTitle: data.title,
      twitterDescription: data.content ? data.content.substring(0, 150) : `Discover insights about ${data.title.toLowerCase()}`,
      schemaMarkup: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.content ? data.content.substring(0, 200) : `Guide about ${data.title}`,
        url: data.url || 'https://example.com',
        author: { '@type': 'Organization', name: 'AI Content Suite' }
      }, null, 2),
      createdAt: new Date(),
    };
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Generate SEO Metadata</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Page/Article Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., How to Build a Successful Blog"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Content or Description
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Paste your content or write a brief description..."
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
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
            placeholder="e.g., blogging, content creation, SEO, marketing"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Content Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          >
            {contentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Page URL (optional)
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com/page"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading || !formData.title.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating SEO...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate SEO Metadata
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}