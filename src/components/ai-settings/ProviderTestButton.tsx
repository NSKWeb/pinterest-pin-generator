'use client';

import { useState } from 'react';
import { AIProviderType } from '@/types/ai-provider';
import { Play, CheckCircle, XCircle, Loader2, Copy } from 'lucide-react';

interface ProviderTestButtonProps {
  provider: AIProviderType;
  onTestComplete: (provider: AIProviderType, success: boolean, responseTime: number, error?: string) => void;
}

export function ProviderTestButton({ provider, onTestComplete }: ProviderTestButtonProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    responseTime: number;
    error?: string;
  } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      const success = data.success;
      const error = data.error;

      setResult({ success, responseTime, error });
      onTestComplete(provider, success, responseTime, error);
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error.message || 'Unknown error';
      setResult({ success: false, responseTime, error: errorMessage });
      onTestComplete(provider, false, responseTime, errorMessage);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleTest}
        disabled={testing}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${testing 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {testing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Test {provider}
          </>
        )}
      </button>

      {result && (
        <div className={`flex items-center gap-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <div className="text-sm">
            <span className="font-medium">
              {result.success ? 'Success' : 'Failed'}
            </span>
            <span className="text-gray-500 ml-2">
              ({result.responseTime}ms)
            </span>
          </div>
          {result.error && (
            <button
              onClick={() => navigator.clipboard.writeText(result.error!)}
              className="ml-2 text-gray-400 hover:text-gray-600"
              title="Copy error"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ProviderTestSuiteProps {
  onTestComplete?: (results: Record<AIProviderType, { success: boolean; responseTime: number }>) => void;
}

export function ProviderTestSuite({ onTestComplete }: ProviderTestSuiteProps) {
  const [results, setResults] = useState<Record<AIProviderType, {
    success: boolean;
    responseTime: number;
    error?: string;
  }>>();

  const handleTestComplete = (
    provider: AIProviderType,
    success: boolean,
    responseTime: number,
    error?: string
  ) => {
    setResults(prev => ({
      ...prev,
      [provider]: { success, responseTime, error },
    } as any));
  };

  const handleRunAllTests = async () => {
    setResults(undefined);
    
    for (const provider of ['openrouter', 'groq'] as AIProviderType[]) {
      const startTime = Date.now();
      
      try {
        const response = await fetch('/api/ai-providers/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider }),
        });

        const data = await response.json();
        const responseTime = Date.now() - startTime;
        
        handleTestComplete(provider, data.success, responseTime, data.error);
      } catch (error: any) {
        handleTestComplete(provider, false, Date.now() - startTime, error.message);
      }
    }

    if (onTestComplete && results) {
      onTestComplete(results as any);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Provider Tests</h3>
        <button
          onClick={handleRunAllTests}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Run All Tests
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['openrouter', 'groq'] as AIProviderType[]).map((provider) => (
          <div key={provider} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium capitalize">{provider}</span>
              {results?.[provider] && (
                results[provider].success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )
              )}
            </div>
            <ProviderTestButton 
              provider={provider} 
              onTestComplete={handleTestComplete}
            />
            {results?.[provider] && (
              <div className="mt-3 text-sm text-gray-500">
                Response time: {results[provider].responseTime}ms
                {results[provider].error && (
                  <p className="text-red-500 mt-1 truncate">{results[provider].error}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}