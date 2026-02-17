'use client';

import { useState, useEffect } from 'react';
import { AIProviderType, ProviderStatus } from '@/types/ai-provider';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface ProviderStatusBadgeProps {
  provider?: AIProviderType;
  showLatency?: boolean;
  showLastChecked?: boolean;
  compact?: boolean;
}

export function ProviderStatusBadge({ 
  provider, 
  showLatency = true,
  showLastChecked = true,
  compact = false 
}: ProviderStatusBadgeProps) {
  const [status, setStatus] = useState<Record<AIProviderType, ProviderStatus>>({
    openrouter: { provider: 'openrouter', healthy: true, lastChecked: new Date(), failureCount: 0 },
    groq: { provider: 'groq', healthy: true, lastChecked: new Date(), failureCount: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/ai-providers/status');
        const data = await response.json();
        if (data.success) {
          setStatus(data.status);
        }
      } catch (error) {
        console.error('Failed to fetch provider status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLastChecked = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusIcon = (providerStatus: ProviderStatus) => {
    if (loading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    
    if (providerStatus.failureCount > 3) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    
    if (!providerStatus.healthy) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = (providerStatus: ProviderStatus) => {
    if (loading) return 'Checking...';
    
    if (providerStatus.failureCount > 3) {
      return 'Down';
    }
    
    if (!providerStatus.healthy) {
      return 'Degraded';
    }
    
    return 'Healthy';
  };

  const getStatusColor = (providerStatus: ProviderStatus) => {
    if (loading) return 'text-gray-500';
    
    if (providerStatus.failureCount > 3) {
      return 'text-red-600 bg-red-50';
    }
    
    if (!providerStatus.healthy) {
      return 'text-yellow-600 bg-yellow-50';
    }
    
    return 'text-green-600 bg-green-50';
  };

  if (provider) {
    const providerStatusData = status[provider];
    
    if (compact) {
      return (
        <div className="flex items-center gap-2">
          {getStatusIcon(providerStatusData)}
          <span className={`text-xs font-medium ${getStatusColor(providerStatusData)}`}>
            {getStatusText(providerStatusData)}
          </span>
          {showLatency && providerStatusData.latency && (
            <span className="text-xs text-gray-500">
              {providerStatusData.latency}ms
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(providerStatusData)}`}>
          {getStatusIcon(providerStatusData)}
          <span className="text-sm font-medium">
            {provider} - {getStatusText(providerStatusData)}
          </span>
        </div>
        
        {showLatency && providerStatusData.latency && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3 h-3" />
            {providerStatusData.latency}ms
          </div>
        )}
        
        {showLastChecked && (
          <span className="text-xs text-gray-400">
            {formatLastChecked(providerStatusData.lastChecked)}
          </span>
        )}
      </div>
    );
  }

  // Show all providers
  return (
    <div className="space-y-2">
      {Object.entries(status).map(([providerType, providerStatus]) => (
        <ProviderStatusBadge
          key={providerType}
          provider={providerType as AIProviderType}
          showLatency={showLatency}
          showLastChecked={showLastChecked}
          compact={compact}
        />
      ))}
    </div>
  );
}

export function ProviderStatusIndicator({ provider }: { provider: AIProviderType }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-current" id={`status-${provider}`} />
      <span className="text-sm capitalize">{provider}</span>
    </div>
  );
}