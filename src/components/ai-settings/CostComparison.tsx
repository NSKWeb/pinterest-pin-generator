'use client';

import { useState, useEffect } from 'react';
import { CostComparison } from '@/types/ai-provider';
import { TrendingDown, DollarSign, Info } from 'lucide-react';

interface CostComparisonProps {
  provider?: 'openrouter' | 'groq';
}

export function CostComparisonView({ provider }: CostComparisonProps) {
  const [costs, setCosts] = useState<CostComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCosts() {
      try {
        const response = await fetch('/api/ai-providers/cost-comparison');
        const data = await response.json();
        if (data.success) {
          setCosts(data.costs);
        }
      } catch (error) {
        console.error('Failed to fetch costs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCosts();
  }, []);

  const filteredCosts = provider 
    ? costs.filter(c => c.provider === provider)
    : costs;

  const formatPrice = (price: number) => {
    if (price < 0.1) {
      return `$${(price * 1000).toFixed(2)}/1K`;
    }
    return `$${price.toFixed(2)}/1M`;
  };

  const getCheapest = (model: string) => {
    const sameModel = costs.filter(c => 
      model.includes('gpt-4o-mini') && c.model.includes('gpt-4o-mini') ||
      model.includes('llama-3.1-8b') && c.model.includes('llama-3.1-8b') ||
      model.includes('llama-3.1-70b') && c.model.includes('llama-3.1-70b') ||
      model.includes('mixtral') && c.model.includes('mixtral') ||
      model.includes('claude') && c.model.includes('claude') ||
      model.includes('gpt-4o') && c.model.includes('gpt-4o') && !c.model.includes('mini')
    );
    
    if (sameModel.length < 2) return false;
    const minPrice = Math.min(...sameModel.map(c => c.averageTotalPricePer1M));
    const currentPrice = costs.find(c => c.model === model)?.averageTotalPricePer1M || 0;
    return currentPrice === minPrice;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-medium">Cost Comparison</h3>
        </div>
        <span className="text-sm text-gray-500">Prices per 1M tokens</span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prompt</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Completion</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Average</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCosts.map((cost) => (
                <tr key={cost.model} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cost.provider === 'groq' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {cost.provider}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {cost.model.split('/').pop()}
                    {getCheapest(cost.model) && (
                      <TrendingDown className="w-4 h-4 inline ml-2 text-green-600" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {formatPrice(cost.promptPricePer1M)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {formatPrice(cost.completionPricePer1M)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {formatPrice(cost.averageTotalPricePer1M)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getCheapest(cost.model) && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Cheapest
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600">
          <p className="font-medium">Cost Optimization Tips</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Use Groq for fast, cost-effective inference on simple tasks</li>
            <li>OpenRouter is better for premium models like GPT-4o and Claude</li>
            <li>Enable "Auto (Cheapest)" mode to automatically use the most economical option</li>
            <li>Consider using smaller models (8B vs 70B) when full capability isn't needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CostComparisonView;