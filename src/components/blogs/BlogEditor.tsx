// Blog Editor Component

'use client';

import { useState } from 'react';
import { 
  Edit3, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  Hash, 
  Clock,
  Type,
  Lightbulb
} from 'lucide-react';

interface BlogEditorProps {
  blog: {
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
  };
  onUpdate: (blog: any) => void;
}

export function BlogEditor({ blog, onUpdate }: BlogEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [editData, setEditData] = useState(blog);

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleExport = () => {
    const content = `# ${blog.title}\n\n${blog.metaDescription}\n\n${blog.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blog.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatContent = (content: string) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-white mb-3 mt-6">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-white mb-2 mt-4">$1</h3>')
      .replace(/^\d+\. (.+)$/gm, '<li class="text-gray-300 ml-4">$1</li>')
      .replace(/^- (.+)$/gm, '<li class="text-gray-300 ml-4">$1</li>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4">')
      .replace(/^(?!<[h|l|p])/gm, '<p class="text-gray-300 mb-4">');
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 capitalize">
                {blog.structure.replace('-', ' ')}
              </span>
              <span className="text-sm text-gray-400 capitalize">{blog.tone}</span>
            </div>
            {isEditing ? (
              <input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-bold text-white bg-transparent border-b border-gray-600 focus:border-blue-400 outline-none w-full mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => handleCopy(blog.content, 'content')}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Copy content"
            >
              {copied === 'content' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{blog.readTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span>{blog.keywords.length} keywords</span>
          </div>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-400" />
            <span>{blog.content.split(' ').length} words</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* SEO Meta */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            SEO Metadata
          </h3>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Meta Title</label>
                <input
                  value={editData.metaTitle || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
                <textarea
                  value={editData.metaDescription || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Meta Title</p>
                <p className="text-sm text-gray-300">{blog.metaTitle || blog.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Meta Description</p>
                <p className="text-sm text-gray-300">{blog.metaDescription || blog.excerpt}</p>
              </div>
            </div>
          )}
        </div>

        {/* Keywords */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Target Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {blog.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Content</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors text-sm"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Preview' : 'Edit'}
              </button>
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
            />
          )}
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditData(blog);
              }}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}