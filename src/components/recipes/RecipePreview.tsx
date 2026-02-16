// Recipe Preview Component

'use client';

import { Clock, Users, ChefHat, Flame, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface RecipePreviewProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
    cookTime: string;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    cuisine: string;
    tips?: string[];
    nutrition?: any;
  };
}

export function RecipePreview({ recipe }: RecipePreviewProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    const content = `
# ${recipe.title}

${recipe.description}

## Ingredients
${recipe.ingredients.map(i => `- ${i}`).join('\n')}

## Instructions
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

${recipe.tips ? `## Tips\n${recipe.tips.map(t => `- ${t}`).join('\n')}` : ''}

---
Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}
Difficulty: ${recipe.difficulty}
Cuisine: ${recipe.cuisine}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </span>
              <span className="text-sm text-gray-400">{recipe.cuisine}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{recipe.title}</h2>
            <p className="text-gray-300">{recipe.description}</p>
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => handleCopy(JSON.stringify(recipe, null, 2), 'recipe')}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Copy JSON"
            >
              {copied === 'recipe' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Prep: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Flame className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Cook: {recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{recipe.servings} servings</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-indigo-400" />
              Ingredients
            </h3>
            <button
              onClick={() => handleCopy(recipe.ingredients.join('\n'), 'ingredients')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {copied === 'ingredients' ? <Check className="w-4 h-4" /> : 'Copy'}
            </button>
          </div>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
          <ol className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-300 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <h3 className="text-lg font-semibold text-white mb-3">💡 Tips</h3>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nutrition */}
        {recipe.nutrition && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Nutrition (per serving)</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{recipe.nutrition.calories || '-'}</p>
                <p className="text-xs text-gray-400">Calories</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{recipe.nutrition.protein || '-'}g</p>
                <p className="text-xs text-gray-400">Protein</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{recipe.nutrition.carbs || '-'}g</p>
                <p className="text-xs text-gray-400">Carbs</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{recipe.nutrition.fat || '-'}g</p>
                <p className="text-xs text-gray-400">Fat</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}