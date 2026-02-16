// Three Layer Authentication Form Component

'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loader2, Shield, Lock, Key } from 'lucide-react';

interface ThreeLayerAuthFormProps {
  onSuccess?: () => void;
}

export function ThreeLayerAuthForm({ onSuccess }: ThreeLayerAuthFormProps) {
  const { authState, isLoading, error, login, clearError } = useAdminAuth();
  
  const [layer1Data, setLayer1Data] = useState({ answer: '' });
  const [layer2Data, setLayer2Data] = useState({ password: '' });
  const [layer3Data, setLayer3Data] = useState({ secretKey: '' });
  
  const [localError, setLocalError] = useState<string | null>(null);

  // Get current layer configuration
  const getCurrentLayerConfig = () => {
    switch (authState.currentLayer) {
      case 'layer1':
        return {
          step: 1,
          title: 'Security Question',
          description: 'Answer your security question to begin authentication',
          icon: Shield,
          progress: 33,
        };
      case 'layer2':
        return {
          step: 2,
          title: 'Admin Password',
          description: 'Enter your admin password to continue',
          icon: Lock,
          progress: 66,
        };
      case 'layer3':
        return {
          step: 3,
          title: 'Secret Key',
          description: 'Enter your secret key to complete authentication',
          icon: Key,
          progress: 100,
        };
      default:
        return null;
    }
  };

  const config = getCurrentLayerConfig();

  useEffect(() => {
    if (authState.isAuthenticated && onSuccess) {
      onSuccess();
    }
  }, [authState.isAuthenticated, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      let credentials;

      switch (authState.currentLayer) {
        case 'layer1':
          credentials = { answer: layer1Data.answer };
          break;
        case 'layer2':
          credentials = { password: layer2Data.password };
          break;
        case 'layer3':
          credentials = { secretKey: layer3Data.secretKey };
          break;
      }

      const result = await login(authState.currentLayer, credentials);

      if (!result.success) {
        setLocalError(result.message);
      }
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  const displayError = localError || error;

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-4">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            AI Content Suite
          </h1>
          <p className="text-gray-400">
            Secure Admin Access
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {config.step} of 3
            </span>
            <span className="text-sm text-gray-400">
              {config.progress}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${config.progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-indigo-600/20">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {config.title}
              </h2>
              <p className="text-sm text-gray-400">
                {config.description}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authState.currentLayer === 'layer1' && (
              <Input
                label="Security Question"
                value="What is your mother's maiden name?"
                disabled
                className="bg-gray-700/50"
              />
            )}

            {authState.currentLayer === 'layer1' && (
              <Input
                label="Your Answer"
                type="text"
                placeholder="Enter your answer"
                value={layer1Data.answer}
                onChange={(e) => setLayer1Data({ answer: e.target.value })}
                required
                autoFocus
              />
            )}

            {authState.currentLayer === 'layer2' && (
              <Input
                label="Admin Password"
                type="password"
                placeholder="Enter your admin password"
                value={layer2Data.password}
                onChange={(e) => setLayer2Data({ password: e.target.value })}
                required
                autoFocus
              />
            )}

            {authState.currentLayer === 'layer3' && (
              <Input
                label="Secret Key"
                type="password"
                placeholder="Enter your secret key"
                value={layer3Data.secretKey}
                onChange={(e) => setLayer3Data({ secretKey: e.target.value })}
                required
                autoFocus
              />
            )}

            {displayError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {displayError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                `Continue`
              )}
            </Button>
          </form>
        </div>

        {/* Layer indicators */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step < config.step
                  ? 'bg-green-500'
                  : step === config.step
                  ? 'bg-indigo-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Failed attempts warning */}
        <p className="text-center text-xs text-gray-500 mt-4">
          This is a secure area. Multiple failed attempts may lock your account.
        </p>
      </div>
    </div>
  );
}