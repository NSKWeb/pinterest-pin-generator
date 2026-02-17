'use client';

import { useState, useEffect } from 'react';
import { AIProviderType, TaskType, FallbackConfig } from '@/types/ai-provider';
import { TaskProviderMapping } from '@/types/ai-provider';
import { TASK_MAPPINGS } from '@/lib/ai/model-router';
import { 
  Settings, 
  Save, 
  RotateCcw,
  Zap,
  DollarSign,
  TestTube,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

import { ProviderSelector } from '@/components/ai-settings/ProviderSelector';
import { ModelMappingTable } from '@/components/ai-settings/ModelMappingTable';
import { FallbackSettings } from '@/components/ai-settings/FallbackSettings';
import { CostComparisonView } from '@/components/ai-settings/CostComparison';
import { ProviderTestSuite } from '@/components/ai-settings/ProviderTestButton';
import { ProviderStatusBadge } from '@/components/ai-settings/ProviderStatusBadge';

export default function AISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'providers' | 'models' | 'fallback' | 'costs' | 'test'>('providers');
  const [settings, setSettings] = useState<{
    defaultProvider: AIProviderType | 'auto';
    fallbackEnabled: boolean;
    fallbackConfig: FallbackConfig;
    taskMappings: Record<TaskType, { provider: AIProviderType; model: string }>;
  }>({
    defaultProvider: 'auto',
    fallbackEnabled: true,
    fallbackConfig: {
      enabled: true,
      maxRetries: 3,
      retryDelayMs: 1000,
      backoffMultiplier: 2,
      circuitBreakerThreshold: 5,
      circuitBreakerResetMs: 300000,
    },
    taskMappings: TASK_MAPPINGS,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/ai-providers/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/ai-providers/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      defaultProvider: 'auto',
      fallbackEnabled: true,
      fallbackConfig: {
        enabled: true,
        maxRetries: 3,
        retryDelayMs: 1000,
        backoffMultiplier: 2,
        circuitBreakerThreshold: 5,
        circuitBreakerResetMs: 300000,
      },
      taskMappings: TASK_MAPPINGS,
    });
    setMessage({ type: 'success', text: 'Settings reset to defaults' });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateDefaultProvider = (provider: AIProviderType | 'auto') => {
    setSettings(prev => ({ ...prev, defaultProvider: provider }));
  };

  const updateFallbackSettings = (enabled: boolean, maxRetries: number, retryDelayMs: number) => {
    setSettings(prev => ({
      ...prev,
      fallbackEnabled: enabled,
      fallbackConfig: {
        ...prev.fallbackConfig,
        enabled,
        maxRetries,
        retryDelayMs,
      },
    }));
  };

  const updateTaskMapping = (task: TaskType, provider: AIProviderType, model: string) => {
    setSettings(prev => ({
      ...prev,
      taskMappings: {
        ...prev.taskMappings,
        [task]: { provider, model },
      },
    }));
  };

  const tabs = [
    { id: 'providers', label: 'Providers', icon: Zap },
    { id: 'models', label: 'Model Mappings', icon: Settings },
    { id: 'fallback', label: 'Fallback', icon: RotateCcw },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    { id: 'test', label: 'Testing', icon: TestTube },
  ] as const;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Provider Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure your AI providers, models, and fallback behavior
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ProviderStatusBadge />
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 inline mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}
      </div>

      <div className="mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          {activeTab === 'providers' && (
            <div className="space-y-6">
              <ProviderSelector
                selectedProvider={settings.defaultProvider}
                onProviderChange={updateDefaultProvider}
              />
              
              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Provider Status</h3>
                <ProviderStatusBadge showLatency={true} showLastChecked={true} />
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <ModelMappingTable
              mappings={settings.taskMappings}
              onMappingChange={updateTaskMapping}
            />
          )}

          {activeTab === 'fallback' && (
            <FallbackSettings
              enabled={settings.fallbackEnabled}
              onEnabledChange={(enabled) => updateFallbackSettings(
                enabled, 
                settings.fallbackConfig.maxRetries, 
                settings.fallbackConfig.retryDelayMs
              )}
              maxRetries={settings.fallbackConfig.maxRetries}
              onMaxRetriesChange={(maxRetries) => updateFallbackSettings(
                settings.fallbackEnabled, 
                maxRetries, 
                settings.fallbackConfig.retryDelayMs
              )}
              retryDelayMs={settings.fallbackConfig.retryDelayMs}
              onRetryDelayChange={(retryDelayMs) => updateFallbackSettings(
                settings.fallbackEnabled, 
                settings.fallbackConfig.maxRetries, 
                retryDelayMs
              )}
            />
          )}

          {activeTab === 'costs' && (
            <CostComparisonView />
          )}

          {activeTab === 'test' && (
            <ProviderTestSuite />
          )}
        </div>
      </div>
    </div>
  );
}