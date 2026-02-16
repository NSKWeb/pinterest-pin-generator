// Stat Card Component for Dashboard

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  LucideIcon
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  size?: 'default' | 'small';
  suffix?: string;
  prefix?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend, 
  size = 'default',
  suffix,
  prefix
}: StatCardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return null;
    
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-gray-400';
    
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      case 'stable':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
    }
    return val.toString();
  };

  return (
    <div className={`
      bg-gray-900/50 rounded-xl border border-gray-800 p-6 transition-all hover:bg-gray-900/70 hover:border-gray-700
      ${size === 'small' ? 'p-4' : 'p-6'}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`
              p-2 rounded-lg bg-indigo-600/20 text-indigo-400
              ${size === 'small' ? 'p-1.5' : 'p-2'}
            `}>
              <Icon className={size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} />
            </div>
            <p className={`
              text-gray-400 font-medium
              ${size === 'small' ? 'text-xs' : 'text-sm'}
            `}>
              {title}
            </p>
          </div>
          
          <div className="flex items-end gap-2">
            <p className={`
              text-white font-bold
              ${size === 'small' ? 'text-xl' : 'text-2xl'}
            `}>
              {prefix}{formatValue(value)}{suffix}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className={`font-medium ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
                  {change > 0 ? '+' : ''}{change}{size === 'default' && '%'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}