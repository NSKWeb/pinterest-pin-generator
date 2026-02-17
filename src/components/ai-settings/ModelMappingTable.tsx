'use client';

import { useState } from 'react';
import { TaskType, AIProviderType, ModelInfo } from '@/types/ai-provider';
import { OPENROUTER_MODELS, GROQ_MODELS, TASK_MAPPINGS } from '@/lib/ai/model-router';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface ModelMappingTableProps {
  mappings: Record<TaskType, { provider: AIProviderType; model: string }>;
  onMappingChange: (task: TaskType, provider: AIProviderType, model: string) => void;
  disabled?: boolean;
}

export function ModelMappingTable({ 
  mappings, 
  onMappingChange,
  disabled = false 
}: ModelMappingTableProps) {
  const [expandedRow, setExpandedRow] = useState<TaskType | null>(null);

  const tasks: Array<{ type: TaskType; label: string; icon: string }> = [
    { type: 'recipes', label: 'Recipes', icon: '🍳' },
    { type: 'blogs', label: 'Blog Posts', icon: '📝' },
    { type: 'seo', label: 'SEO Content', icon: '🔍' },
    { type: 'pins', label: 'Pinterest Pins', icon: '📌' },
    { type: 'bulk', label: 'Bulk Generation', icon: '📦' },
    { type: 'general', label: 'General', icon: '💬' },
  ];

  const allModels = [...OPENROUTER_MODELS, ...GROQ_MODELS];

  const getModelOptions = (task: TaskType): ModelInfo[] => {
    const taskSpecific = allModels.filter(m => m.recommendedFor.includes(task));
    if (taskSpecific.length > 0) return taskSpecific;
    return allModels;
  };

  const handleProviderChange = (task: TaskType, provider: AIProviderType) => {
    const models = getModelOptions(task).filter(m => m.provider === provider);
    if (models.length > 0) {
      onMappingChange(task, provider, models[0].id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Task to Model Mappings</h3>
        <span className="text-sm text-gray-500">Configure which model to use for each task type</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => {
              const currentMapping = mappings[task.type];
              const isExpanded = expandedRow === task.type;

              return (
                <tr key={task.type} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{task.icon}</span>
                      <span className="font-medium">{task.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={currentMapping?.provider || 'auto'}
                      onChange={(e) => handleProviderChange(task.type, e.target.value as AIProviderType)}
                      disabled={disabled}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="auto">Auto</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="groq">Groq</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={currentMapping?.model || ''}
                      onChange={(e) => onMappingChange(task.type, currentMapping?.provider || 'openrouter', e.target.value)}
                      disabled={disabled}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {getModelOptions(task.type).map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.provider})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : task.type)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {expandedRow && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Model Details</h4>
          {(() => {
            const model = allModels.find(m => m.id === mappings[expandedRow]?.model);
            if (!model) return null;
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Context Length:</span>{' '}
                  <span>{model.contextLength.toLocaleString()} tokens</span>
                </div>
                <div>
                  <span className="text-gray-500">Pricing:</span>{' '}
                  <span>${model.pricing.prompt}/1M prompt, ${model.pricing.completion}/1M completion</span>
                </div>
                <div>
                  <span className="text-gray-500">Streaming:</span>{' '}
                  <span>{model.supportsStreaming ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-gray-500">JSON Mode:</span>{' '}
                  <span>{model.supportsJson ? 'Yes' : 'No'}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}