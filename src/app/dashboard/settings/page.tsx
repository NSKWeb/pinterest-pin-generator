// Settings Page

'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  Settings, 
  Key, 
  Shield, 
  Database, 
  Download, 
  Upload, 
  RefreshCw,
  Save,
  AlertTriangle,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Security
    securityQuestion: 'What is your mother\'s maiden name?',
    secretKey: '••••••••••••••••',
    
    // AI Models
    fastModel: 'openai/gpt-4o-mini',
    qualityModel: 'openai/gpt-4o',
    blogModel: 'anthropic/claude-3-5-sonnet-20241022',
    
    // Features
    enableCampaigns: true,
    enableBulkProcessing: true,
    enablePinStudio: true,
    enableAssetLibrary: true,
    enableExport: true,
    
    // Export
    defaultExportFormat: 'json',
    includeAssets: true,
    includeMetadata: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'ai', label: 'AI Models', icon: Key },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'data', label: 'Data', icon: Database },
  ];

  const exportFormats = [
    { id: 'json', label: 'JSON', description: 'Complete data with metadata' },
    { id: 'csv', label: 'CSV', description: 'Spreadsheet-compatible' },
    { id: 'zip', label: 'ZIP Archive', description: 'All files bundled' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Settings" 
        subtitle="Configure your AI Content Suite dashboard" 
      />
      
      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                    ${activeTab === tab.id 
                      ? 'bg-indigo-600/20 text-indigo-400' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Manage your 3-layer authentication settings. These settings protect your dashboard.
                    </p>
                  </div>

                  {/* Layer 1 - Security Question */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Layer 1: Security Question</h4>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Security Question</label>
                      <Input
                        value={settings.securityQuestion}
                        onChange={(e) => setSettings(prev => ({ ...prev, securityQuestion: e.target.value }))}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Contact support to change this setting</p>
                    </div>
                  </div>

                  {/* Layer 3 - Secret Key */}
                  <div className="space-y-4 pt-6 border-t border-gray-800">
                    <h4 className="font-medium text-white">Layer 3: Secret Key</h4>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secret Key</label>
                      <Input
                        type="password"
                        value={settings.secretKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, secretKey: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Must be at least 16 characters</p>
                    </div>
                  </div>

                  {/* Session Settings */}
                  <div className="space-y-4 pt-6 border-t border-gray-800">
                    <h4 className="font-medium text-white">Session Settings</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white">Session Timeout</p>
                        <p className="text-sm text-gray-400">Auto-logout after inactivity</p>
                      </div>
                      <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option>2 hours</option>
                        <option>4 hours</option>
                        <option>8 hours</option>
                        <option>24 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Models Tab */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">AI Model Configuration</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Configure which AI models to use for different content generation tasks via OpenRouter.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Fast Model (Quick Generations)</label>
                      <select
                        value={settings.fastModel}
                        onChange={(e) => setSettings(prev => ({ ...prev, fastModel: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      >
                        <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                        <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                        <option value="google/gemini-flash-1.5">Gemini Flash</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Quality Model (Best Results)</label>
                      <select
                        value={settings.qualityModel}
                        onChange={(e) => setSettings(prev => ({ ...prev, qualityModel: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      >
                        <option value="openai/gpt-4o">GPT-4o</option>
                        <option value="anthropic/claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                        <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Blog Model (Long-form Content)</label>
                      <select
                        value={settings.blogModel}
                        onChange={(e) => setSettings(prev => ({ ...prev, blogModel: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      >
                        <option value="anthropic/claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                        <option value="openai/gpt-4o">GPT-4o</option>
                        <option value="deepseek/deepseek-chat">DeepSeek Chat</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Feature Flags</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Enable or disable specific features of the dashboard.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'enableCampaigns', label: 'Campaign Manager', description: 'Automated content campaigns' },
                      { key: 'enableBulkProcessing', label: 'Bulk Processing', description: 'Process multiple items at once' },
                      { key: 'enablePinStudio', label: 'Pin Studio', description: 'Design Pinterest pins' },
                      { key: 'enableAssetLibrary', label: 'Asset Library', description: 'Store and manage assets' },
                      { key: 'enableExport', label: 'Export System', description: 'Export content in various formats' },
                    ].map(feature => (
                      <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{feature.label}</p>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                        <button
                          onClick={() => setSettings(prev => ({ ...prev, [feature.key]: !prev[feature.key as keyof typeof prev] }))}
                          className={`
                            w-12 h-6 rounded-full transition-colors relative
                            ${settings[feature.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-gray-600'}
                          `}
                        >
                          <span className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                            ${settings[feature.key as keyof typeof settings] ? 'left-7' : 'left-1'}
                          `} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Tab */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Export Settings</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Configure default export options for your content.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Default Export Format</label>
                      <div className="grid grid-cols-3 gap-3">
                        {exportFormats.map(format => (
                          <button
                            key={format.id}
                            onClick={() => setSettings(prev => ({ ...prev, defaultExportFormat: format.id }))}
                            className={`
                              p-4 rounded-lg border text-left transition-colors
                              ${settings.defaultExportFormat === format.id
                                ? 'bg-indigo-600/20 border-indigo-500'
                                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                              }
                            `}
                          >
                            <p className="font-medium text-white">{format.label}</p>
                            <p className="text-xs text-gray-400">{format.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white">Include Assets</p>
                        <p className="text-sm text-gray-400">Export images and media files</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, includeAssets: !prev.includeAssets }))}
                        className={`
                          w-12 h-6 rounded-full transition-colors relative
                          ${settings.includeAssets ? 'bg-indigo-600' : 'bg-gray-600'}
                        `}
                      >
                        <span className={`
                          absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                          ${settings.includeAssets ? 'left-7' : 'left-1'}
                        `} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white">Include Metadata</p>
                        <p className="text-sm text-gray-400">Export SEO tags and schema</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, includeMetadata: !prev.includeMetadata }))}
                        className={`
                          w-12 h-6 rounded-full transition-colors relative
                          ${settings.includeMetadata ? 'bg-indigo-600' : 'bg-gray-600'}
                        `}
                      >
                        <span className={`
                          absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                          ${settings.includeMetadata ? 'left-7' : 'left-1'}
                        `} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Export, import, or manage your data.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Full Backup</p>
                          <p className="text-sm text-gray-400">Download all your data as JSON</p>
                        </div>
                        <Button variant="secondary">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Import Data</p>
                          <p className="text-sm text-gray-400">Restore from a backup file</p>
                        </div>
                        <Button variant="secondary">
                          <Upload className="w-4 h-4" />
                          Import
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-400 font-medium">Reset All Data</p>
                          <p className="text-sm text-gray-400">Delete all generated content</p>
                        </div>
                        <Button variant="danger">
                          <AlertTriangle className="w-4 h-4" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end gap-3">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : saved ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Saved!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}