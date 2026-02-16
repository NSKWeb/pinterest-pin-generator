// SEO Generator Page

'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { SEOMetadataForm } from '@/components/seo/SEOMetadataForm';
import { SEOPreview } from '@/components/seo/SEOPreview';
import { Search, Globe, Hash, ExternalLink } from 'lucide-react';

interface GeneratedSEO {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  schemaMarkup?: string;
  createdAt: Date;
}

export default function SEOPage() {
  const [currentSEO, setCurrentSEO] = useState<GeneratedSEO | null>(null);
  const [recentSEO, setRecentSEO] = useState<GeneratedSEO[]>([]);

  const handleSEOGenerated = (seo: GeneratedSEO) => {
    setCurrentSEO(seo);
    setRecentSEO(prev => [seo, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="SEO Generator" 
        subtitle="Generate SEO metadata and structured data for your content" 
      />
      
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-600/20">
              <Search className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{recentSEO.length}</p>
              <p className="text-sm text-gray-400">Total Generated</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentSEO.filter(s => s.createdAt > new Date(Date.now() - 86400000)).length}
              </p>
              <p className="text-sm text-gray-400">Today</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <Hash className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentSEO.reduce((sum, s) => sum + s.keywords.length, 0)}
              </p>
              <p className="text-sm text-gray-400">Keywords</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-600/20">
              <ExternalLink className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentSEO.filter(s => s.schemaMarkup).length}
              </p>
              <p className="text-sm text-gray-400">Schema Markup</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <SEOMetadataForm onSEOGenerated={handleSEOGenerated} />
          
          {/* Preview */}
          {currentSEO ? (
            <SEOPreview seo={currentSEO} />
          ) : (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No SEO Data</h3>
              <p className="text-gray-400">
                Generate SEO metadata to see it here
              </p>
            </div>
          )}
        </div>

        {/* Recent SEO */}
        {recentSEO.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Recent SEO Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSEO.slice(0, 6).map((seo) => (
                <div 
                  key={seo.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors cursor-pointer"
                  onClick={() => setCurrentSEO(seo)}
                >
                  <h4 className="font-semibold text-white line-clamp-1 mb-2">{seo.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{seo.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {seo.keywords.length} keywords
                    </span>
                    <span>{seo.schemaMarkup ? 'Schema' : 'No Schema'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}