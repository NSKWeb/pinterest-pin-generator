'use client';

import { useState, useEffect } from 'react';
import { AIProviderType } from '@/types/ai-provider';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ProviderSelectorProps {
  selectedProvider: AIProviderType | 'auto';
  onProviderChange: (provider: AIProviderType | 'auto') => void;
  disabled?: boolean;
}

export function ProviderSelector({ 
  selectedProvider, 
  onProviderChange,
  disabled = false 
}: ProviderSelectorProps) {
  const [providerStatus, setProviderStatus] = useState<Record<AIProviderType, { healthy: boolean; latency?: number }>>({
    openrouter: { healthy: true },
    groq: { healthy: true },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProviders() {
      try {
        const response = await fetch('/api/ai-providers/status');
        const data = await response.json();
        if (data.success) {
          setProviderStatus(data.status);
        }
      } catch (error) {
        console.error('Failed to check provider status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkProviders();
    const interval = setInterval(checkProviders, 30000);
    return () => clearInterval(interval);
  }, []);

  const providers: Array<{ value: AIProviderType | 'auto'; label: string; description: string }> = [
    { 
      value: 'auto', 
      label: 'Auto (Smart)', 
      description: 'Automatically selects the best provider based on task' 
    },
    { 
      value: 'openrouter', 
      label: 'OpenRouter', 
      description: 'Access to GPT-4o, Claude, and other premium models' 
    },
    { 
      value: 'groq', 
      label: 'Groq', 
      description: 'Fast inference with Llama and Mixtral models' 
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        AI Provider
      </label>
      
      <div className="grid gap-3">
        {providers.map((provider) => (
          <button
            key={provider.value}
            type="button"
            onClick={() => !disabled && onProviderChange(provider.value)}
            disabled={disabled}
            className={`
              relative flex items-center p-4 rounded-lg border-2 transition-all
              ${selectedProvider === provider.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium">{provider.label}</span>
                {provider.value !== 'auto' && (
                  <>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : providerStatus[provider.value as AIProviderType]?.healthy ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
            </div>
            
            {selectedProvider === provider.value && (
              <div className="ml-4">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}