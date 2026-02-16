// Asset Library Page

'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Button } from '@/components/Button';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Grid, 
  List,
  Download,
  Trash2,
  Image,
  FileText,
  File,
  MoreVertical,
  Upload,
  Check
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'document' | 'data' | 'pin';
  size: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  tags: string[];
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'italian-pasta-carbonara.jpg',
      type: 'image',
      size: 245000,
      url: '/uploads/1.jpg',
      createdAt: new Date(Date.now() - 86400000),
      tags: ['recipe', 'italian', 'pasta'],
    },
    {
      id: '2',
      name: 'thai-green-curry.jpg',
      type: 'image',
      size: 312000,
      url: '/uploads/2.jpg',
      createdAt: new Date(Date.now() - 86400000 * 2),
      tags: ['recipe', 'thai', 'curry'],
    },
    {
      id: '3',
      name: 'blog-post-seo-guide.md',
      type: 'document',
      size: 12400,
      url: '/uploads/3.md',
      createdAt: new Date(Date.now() - 86400000 * 3),
      tags: ['blog', 'seo'],
    },
    {
      id: '4',
      name: 'pinterest-pin-recipe.png',
      type: 'pin',
      size: 89000,
      url: '/uploads/4.png',
      createdAt: new Date(Date.now() - 86400000 * 4),
      tags: ['pin', 'recipe'],
    },
    {
      id: '5',
      name: 'export-data.json',
      type: 'data',
      size: 56700,
      url: '/uploads/5.json',
      createdAt: new Date(Date.now() - 86400000 * 5),
      tags: ['export', 'backup'],
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'pin': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedAssets(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedAssets.size} selected assets?`)) {
      setAssets(prev => prev.filter(a => !selectedAssets.has(a.id)));
      setSelectedAssets(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Asset Library" 
        subtitle="Manage all your generated content and media" 
      />
      
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-600/20">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{assets.length}</p>
              <p className="text-sm text-gray-400">Total Assets</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <Image className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {assets.filter(a => a.type === 'image' || a.type === 'pin').length}
              </p>
              <p className="text-sm text-gray-400">Images</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {assets.filter(a => a.type === 'document').length}
              </p>
              <p className="text-sm text-gray-400">Documents</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-600/20">
              <File className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatSize(assets.reduce((sum, a) => sum + a.size, 0))}
              </p>
              <p className="text-sm text-gray-400">Total Size</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="pin">Pins</option>
                <option value="document">Documents</option>
                <option value="data">Data</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bulk actions */}
            {selectedAssets.size > 0 && (
              <div className="flex items-center gap-2 pr-4 border-r border-gray-700">
                <span className="text-sm text-gray-400">{selectedAssets.size} selected</span>
                <Button variant="danger" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}

            {/* View toggle */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button variant="primary">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Asset Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id}
                className={`
                  bg-gray-900/50 rounded-xl border overflow-hidden cursor-pointer transition-colors group
                  ${selectedAssets.has(asset.id) ? 'border-indigo-500' : 'border-gray-800 hover:border-gray-700'}
                `}
                onClick={() => toggleSelect(asset.id)}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-800 flex items-center justify-center relative">
                  {asset.type === 'image' || asset.type === 'pin' ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <Image className="w-8 h-8 text-white/50" />
                    </div>
                  ) : (
                    <FileText className="w-8 h-8 text-gray-600" />
                  )}
                  
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                    ${selectedAssets.has(asset.id) ? 'bg-indigo-500 border-indigo-500' : 'border-white/50 bg-black/30'}
                  `}>
                    {selectedAssets.has(asset.id) && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white capitalize">
                    {asset.type}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm text-white truncate">{asset.name}</p>
                  <p className="text-xs text-gray-500">{formatSize(asset.size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="w-10 p-4"></th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Size</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Tags</th>
                  <th className="w-20 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className={`
                      border-b border-gray-800 cursor-pointer transition-colors
                      ${selectedAssets.has(asset.id) ? 'bg-indigo-500/10' : 'hover:bg-gray-800/50'}
                    `}
                    onClick={() => toggleSelect(asset.id)}
                  >
                    <td className="p-4">
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        ${selectedAssets.has(asset.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}
                      `}>
                        {selectedAssets.has(asset.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(asset.type)}
                        <span className="text-white">{asset.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 capitalize">{asset.type}</td>
                    <td className="p-4 text-gray-400">{formatSize(asset.size)}</td>
                    <td className="p-4 text-gray-400">{formatDate(asset.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <button className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {filteredAssets.length === 0 && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Assets Found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search or filters' : 'Upload your first asset to get started'}
            </p>
            <Button variant="primary">
              <Upload className="w-4 h-4" />
              Upload Asset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}