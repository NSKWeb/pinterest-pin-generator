// Campaign Manager Page

'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Button } from '@/components/Button';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  contentTypes: string[];
  topics: string[];
  totalRuns: number;
  successfulRuns: number;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
  createdAt: Date;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Weekly Recipe Series',
      description: 'Generate weekly recipes for the food blog',
      status: 'active',
      contentTypes: ['recipe', 'pin'],
      topics: ['italian', 'quick meals', 'healthy'],
      totalRuns: 12,
      successfulRuns: 10,
      lastRunAt: new Date(Date.now() - 86400000),
      nextRunAt: new Date(Date.now() + 86400000 * 6),
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: '2',
      name: 'Blog SEO Optimization',
      description: 'Update SEO for all existing blog posts',
      status: 'paused',
      contentTypes: ['seo'],
      topics: ['meta tags', 'descriptions'],
      totalRuns: 5,
      successfulRuns: 5,
      lastRunAt: new Date(Date.now() - 86400000 * 7),
      nextRunAt: null,
      createdAt: new Date(Date.now() - 86400000 * 60),
    },
    {
      id: '3',
      name: 'Pinterest Growth',
      description: 'Pin blog content to Pinterest automatically',
      status: 'draft',
      contentTypes: ['pin'],
      topics: ['recipes', 'tutorials'],
      totalRuns: 0,
      successfulRuns: 0,
      lastRunAt: null,
      nextRunAt: null,
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'active' ? 'paused' : 'active',
        };
      }
      return c;
    }));
  };

  const deleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Campaign Manager" 
        subtitle="Automate your content generation with campaigns" 
      />
      
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-600/20">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{campaigns.length}</p>
              <p className="text-sm text-gray-400">Total Campaigns</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <Play className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {campaigns.reduce((sum, c) => sum + c.successfulRuns, 0)}
              </p>
              <p className="text-sm text-gray-400">Total Runs</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-600/20">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {campaigns.reduce((sum, c) => sum + (c.totalRuns - c.successfulRuns), 0)}
              </p>
              <p className="text-sm text-gray-400">Failed</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Campaigns</h2>
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{campaign.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {campaign.status !== 'draft' && (
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                    >
                      {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Content:</span>
                  <div className="flex gap-1">
                    {campaign.contentTypes.map((type) => (
                      <span key={type} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-xs capitalize">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Topics:</span>
                  <span className="text-gray-300">{campaign.topics.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                <div>
                  <span className="text-gray-500">Runs:</span>{' '}
                  <span className="text-white">{campaign.successfulRuns}/{campaign.totalRuns}</span>
                </div>
                {campaign.lastRunAt && (
                  <div>
                    <span className="text-gray-500">Last:</span>{' '}
                    <span className="text-white">{campaign.lastRunAt.toLocaleDateString()}</span>
                  </div>
                )}
                {campaign.nextRunAt && (
                  <div>
                    <span className="text-gray-500">Next:</span>{' '}
                    <span className="text-white">{campaign.nextRunAt.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {campaigns.length === 0 && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 text-center">
            <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Campaigns Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first campaign to automate content generation
            </p>
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}