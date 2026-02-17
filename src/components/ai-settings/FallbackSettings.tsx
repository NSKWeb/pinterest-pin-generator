'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface FallbackSettingsProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  maxRetries: number;
  onMaxRetriesChange: (retries: number) => void;
  retryDelayMs: number;
  onRetryDelayChange: (delay: number) => void;
  disabled?: boolean;
}

export function FallbackSettings({
  enabled,
  onEnabledChange,
  maxRetries,
  onMaxRetriesChange,
  retryDelayMs,
  onRetryDelayChange,
  disabled = false,
}: FallbackSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Automatic Fallback</h3>
        <p className="text-sm text-gray-500 mb-4">
          When enabled, the system will automatically switch to an alternate provider if the primary provider fails.
        </p>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              enabled ? 'bg-green-100' : 'bg-gray-200'
            }`}>
              {enabled ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-medium">Fallback Enabled</p>
              <p className="text-sm text-gray-500">
                {enabled 
                  ? 'System will automatically retry with alternate provider'
                  : 'System will fail immediately on provider error'
                }
              </p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <h4 className="font-medium text-gray-700">Fallback Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Retries
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxRetries}
                onChange={(e) => onMaxRetriesChange(parseInt(e.target.value) || 3)}
                disabled={disabled}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of fallback attempts before giving up
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retry Delay (ms)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={retryDelayMs}
                onChange={(e) => onRetryDelayChange(parseInt(e.target.value) || 1000)}
                disabled={disabled}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Initial delay before retrying (increases exponentially)
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">How Fallback Works</p>
              <p className="mt-1">
                If the primary provider fails (e.g., rate limit, timeout), the system will:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Wait for the configured delay ({retryDelayMs}ms initially)</li>
                <li>Try the alternate provider/model</li>
                <li>Repeat up to {maxRetries} times with exponential backoff</li>
                <li>Log all provider switches for debugging</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}