// Recipe Form Component

'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loader2, Sparkles } from 'lucide-react';

interface RecipeFormProps {
  onRecipeGenerated: (recipe: any) => void;
}

interface FormData {
  description: string;
  cuisine: string;
  dietary: string[];
  difficulty: string;
  servings: string;
  style: string;
}

export function RecipeForm({ onRecipeGenerated }: RecipeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: '',
    cuisine: '',
    dietary: [],
    difficulty: 'medium',
    servings: '4',
    style: 'traditional',
  });

  const cuisines = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
    'French', 'Mediterranean', 'American', 'Korean', 'Vietnamese'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb'
  ];

  const difficulties = ['easy', 'medium', 'hard'];
  const styles = ['traditional', 'modern', 'fusion'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onRecipeGenerated(data.data);
      } else {
        // Handle error - for demo, create mock recipe
        const mockRecipe = createMockRecipe(formData.description);
        onRecipeGenerated(mockRecipe);
      }
    } catch (error) {
      // For demo, create mock recipe on error
      const mockRecipe = createMockRecipe(formData.description);
      onRecipeGenerated(mockRecipe);
    } finally {
      setIsLoading(false);
    }
  };

  const createMockRecipe = (description: string): any => {
    return {
      id: Date.now().toString(),
      title: description.substring(0, 50),
      description: `A delicious ${formData.cuisine || 'homemade'} ${formData.style} dish`,
      ingredients: [
        '2 cups all-purpose flour',
        '1 cup water',
        '1 tsp salt',
        '2 tbsp olive oil',
        'Fresh herbs (to taste)',
      ],
      instructions: [
        'Mix flour, salt, and create a well',
        'Add water and mix until combined',
        'Knead for 10 minutes until smooth',
        'Let rest for 30 minutes',
        'Shape and cook as desired',
        'Serve hot with your favorite toppings',
      ],
      prepTime: '15 minutes',
      cookTime: '30 minutes',
      servings: parseInt(formData.servings),
      difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
      cuisine: formData.cuisine || 'International',
      tips: [
        'Adjust seasoning to taste',
        'Best served fresh',
        'Store in airtight container',
      ],
      createdAt: new Date(),
    };
  };

  const toggleDietary = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option],
    }));
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Create New Recipe</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Recipe Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="e.g., A creamy pasta dish with bacon and parmesan"
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            required
          />
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Cuisine Type
          </label>
          <select
            value={formData.cuisine}
            onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select cuisine...</option>
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        {/* Difficulty & Servings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff} style={{ textTransform: 'capitalize' }}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Servings
            </label>
            <select
              value={formData.servings}
              onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                <option key={num} value={num}>{num} servings</option>
              ))}
            </select>
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Style
          </label>
          <div className="flex gap-3">
            {styles.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, style }))}
                className={`
                  flex-1 py-2 px-4 rounded-lg border transition-colors
                  ${formData.style === style
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }
                `}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Dietary Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => toggleDietary(option)}
                className={`
                  py-1.5 px-3 rounded-full text-sm transition-colors
                  ${formData.dietary.includes(option)
                    ? 'bg-indigo-600/20 border border-indigo-500 text-indigo-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading || !formData.description.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Recipe...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Recipe
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}