// SEO Preview Component

'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Globe, 
  Twitter, 
  Code, 
  ExternalLink 
} from 'lucide-react';

interface SEOPreviewProps {
  seo: {
    id: string;
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    schemaMarkup?: string;
  };
}

export function SEOPreview({ seo }: SEOPreviewProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'serp' | 'og' | 'twitter' | 'schema'>('serp');

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    const json = JSON.stringify(seo, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-${seo.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'serp', label: 'Google SERP', icon: Globe },
    { id: 'og', label: 'Open Graph', icon: ExternalLink },
    { id: 'twitter', label: 'Twitter Card', icon: Twitter },
    { id: 'schema', label: 'Schema.org', icon: Code },
  ];

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 p-4 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">SEO Metadata Preview</h3>
            <p className="text-sm text-gray-400">Generated SEO data for your content</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(JSON.stringify(seo, null, 2), 'all')}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Copy all"
            >
              {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Export JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-800/50' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Google SERP Preview */}
        {activeTab === 'serp' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
                {seo.title || 'Page Title'}
              </p>
              <p className="text-green-700 text-sm truncate">
                https://example.com/page
              </p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {seo.description || 'Page description will appear here...'}
              </p>
            </div>
            
            {/* Title length indicator */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Title: {(seo.title || '').length}/60</span>
              <span className={`
                px-2 py-1 rounded text-xs
                ${(seo.title || '').length <= 60 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
              `}>
                {(seo.title || '').length <= 60 ? 'Optimal' : 'Too Long'}
              </span>
            </div>

            {/* Description length indicator */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Description: {(seo.description || '').length}/160</span>
              <span className={`
                px-2 py-1 rounded text-xs
                ${(seo.description || '').length <= 160 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
              `}>
                {(seo.description || '').length <= 160 ? 'Optimal' : 'Too Long'}
              </span>
            </div>

            {/* Keywords */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Target Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {seo.keywords?.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Open Graph */}
        {activeTab === 'og' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-32 flex items-center justify-center">
                {seo.ogImage ? (
                  <img src={seo.ogImage} alt="OG Image" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs uppercase">example.com</p>
                <p className="text-black text-lg font-medium mt-1">
                  {seo.ogTitle || seo.title || 'Page Title'}
                </p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {seo.ogDescription || seo.description || 'Page description...'}
                </p>
              </div>
            </div>

            {/* Code */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">OG Meta Tags</span>
                <button
                  onClick={() => handleCopy(generateOGTags(seo), 'og')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  {copied === 'og' ? <Check className="w-4 h-4" /> : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {generateOGTags(seo)}
              </pre>
            </div>
          </div>
        )}

        {/* Twitter Card */}
        {activeTab === 'twitter' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-32 flex items-center justify-center">
                {seo.twitterImage ? (
                  <img src={seo.twitterImage} alt="Twitter Image" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-black text-lg font-medium">
                  {seo.twitterTitle || seo.title || 'Page Title'}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {seo.twitterDescription || seo.description || 'Page description...'}
                </p>
              </div>
            </div>

            {/* Code */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Twitter Card Tags</span>
                <button
                  onClick={() => handleCopy(generateTwitterTags(seo), 'twitter')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  {copied === 'twitter' ? <Check className="w-4 h-4" /> : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {generateTwitterTags(seo)}
              </pre>
            </div>
          </div>
        )}

        {/* Schema.org */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">JSON-LD Schema Markup</span>
                <button
                  onClick={() => handleCopy(seo.schemaMarkup || '{}', 'schema')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  {copied === 'schema' ? <Check className="w-4 h-4" /> : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-gray-300 overflow-x-auto max-h-64">
                {seo.schemaMarkup || 'No schema generated'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateOGTags(seo: any): string {
  return `<meta property="og:title" content="${seo.ogTitle || seo.title || ''}" />
<meta property="og:description" content="${seo.ogDescription || seo.description || ''}" />
<meta property="og:image" content="${seo.ogImage || ''}" />
<meta property="og:type" content="website" />`;
}

function generateTwitterTags(seo: any): string {
  return `<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${seo.twitterTitle || seo.title || ''}" />
<meta name="twitter:description" content="${seo.twitterDescription || seo.description || ''}" />
<meta name="twitter:image" content="${seo.twitterImage || seo.ogImage || ''}" />`;
}