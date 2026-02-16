// Dashboard Overview Page

'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  ChefHat, 
  FileText, 
  Image, 
  Zap, 
  TrendingUp, 
  Calendar,
  Clock,
  Database
} from 'lucide-react';

interface DashboardStats {
  totalRecipes: number;
  totalBlogs: number;
  totalPins: number;
  totalCampaigns: number;
  activeCampaigns: number;
  todayGenerated: number;
  apiUsageThisMonth: number;
  storageUsed: number;
}

interface RecentActivity {
  id: string;
  type: 'generation' | 'campaign' | 'bulk_job';
  action: string;
  target: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0,
    totalBlogs: 0,
    totalPins: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    todayGenerated: 0,
    apiUsageThisMonth: 0,
    storageUsed: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalRecipes: 127,
        totalBlogs: 89,
        totalPins: 234,
        totalCampaigns: 5,
        activeCampaigns: 2,
        todayGenerated: 12,
        apiUsageThisMonth: 15420,
        storageUsed: 2.4,
      });

      setRecentActivity([
        {
          id: '1',
          type: 'generation',
          action: 'Generated recipe',
          target: 'Italian Pasta Carbonara',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'success',
        },
        {
          id: '2',
          type: 'campaign',
          action: 'Started campaign',
          target: 'Blog Series Q4',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'pending',
        },
        {
          id: '3',
          type: 'bulk_job',
          action: 'Bulk processed',
          target: '50 blog posts',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          status: 'success',
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generation': return <ChefHat className="w-4 h-4" />;
      case 'campaign': return <Zap className="w-4 h-4" />;
      case 'bulk_job': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Sidebar />
        <div className="ml-64">
          <div className="h-16 bg-gray-900/50 border-b border-gray-800" />
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-800 rounded w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-800 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your content." 
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Recipes"
            value={stats.totalRecipes}
            icon={ChefHat}
            change={+12}
            trend="up"
          />
          <StatCard
            title="Blog Posts"
            value={stats.totalBlogs}
            icon={FileText}
            change={+8}
            trend="up"
          />
          <StatCard
            title="Pinterest Pins"
            value={stats.totalPins}
            icon={Image}
            change={+24}
            trend="up"
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={Zap}
            change={0}
            trend="stable"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Generated Today"
            value={stats.todayGenerated}
            icon={Calendar}
            change={+5}
            trend="up"
            size="small"
          />
          <StatCard
            title="API Usage (This Month)"
            value={stats.apiUsageThisMonth}
            icon={TrendingUp}
            change={+18}
            trend="up"
            size="small"
            suffix=" tokens"
          />
          <StatCard
            title="Storage Used"
            value={stats.storageUsed}
            icon={Database}
            change={-0.2}
            trend="down"
            size="small"
            suffix=" GB"
          />
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={Zap}
            change={+1}
            trend="up"
            size="small"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">
                View all
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.target}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors text-left">
                <ChefHat className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white font-medium">Generate Recipe</p>
                  <p className="text-xs text-gray-400">Create a new recipe</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors text-left">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white font-medium">Write Blog Post</p>
                  <p className="text-xs text-gray-400">Start a new blog</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors text-left">
                <Image className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white font-medium">Create Pin</p>
                  <p className="text-xs text-gray-400">Design a new pin</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors text-left">
                <Zap className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white font-medium">Start Campaign</p>
                  <p className="text-xs text-gray-400">Automated content</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';