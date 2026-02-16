// Blog Generator Page

'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { BlogGeneratorForm } from '@/components/blogs/BlogGeneratorForm';
import { BlogEditor } from '@/components/blogs/BlogEditor';
import { FileText, TrendingUp, Clock, Hash } from 'lucide-react';

interface GeneratedBlog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  readTime: number;
  structure: string;
  tone: string;
  createdAt: Date;
}

export default function BlogsPage() {
  const [currentBlog, setCurrentBlog] = useState<GeneratedBlog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<GeneratedBlog[]>([]);

  const handleBlogGenerated = (blog: GeneratedBlog) => {
    setCurrentBlog(blog);
    setRecentBlogs(prev => [blog, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Blog Generator" 
        subtitle="Create SEO-optimized blog posts with AI" 
      />
      
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-600/20">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{recentBlogs.length}</p>
              <p className="text-sm text-gray-400">Total Blogs</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentBlogs.filter(b => b.createdAt > new Date(Date.now() - 86400000)).length}
              </p>
              <p className="text-sm text-gray-400">Today</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-600/20">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentBlogs.length > 0 
                  ? Math.round(recentBlogs.reduce((sum, b) => sum + b.readTime, 0) / recentBlogs.length)
                  : 0
                }m
              </p>
              <p className="text-sm text-gray-400">Avg Read Time</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <Hash className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentBlogs.reduce((sum, b) => sum + b.keywords.length, 0)}
              </p>
              <p className="text-sm text-gray-400">Keywords</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <BlogGeneratorForm onBlogGenerated={handleBlogGenerated} />
          
          {/* Preview/Editor */}
          {currentBlog ? (
            <BlogEditor blog={currentBlog} onUpdate={setCurrentBlog} />
          ) : (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Blog Selected</h3>
              <p className="text-gray-400">
                Create a new blog post to see it here
              </p>
            </div>
          )}
        </div>

        {/* Recent Blogs */}
        {recentBlogs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Blogs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBlogs.slice(0, 6).map((blog) => (
                <div 
                  key={blog.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors cursor-pointer"
                  onClick={() => setCurrentBlog(blog)}
                >
                  <h4 className="font-semibold text-white line-clamp-2 mb-2">{blog.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{blog.structure}</span>
                    <span>{blog.readTime} min read</span>
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