// Recipe Generator Page

'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { RecipePreview } from '@/components/recipes/RecipePreview';
import { Recipe, ChefHat } from 'lucide-react';

interface GeneratedRecipe {
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
  createdAt: Date;
}

export default function RecipesPage() {
  const [currentRecipe, setCurrentRecipe] = useState<GeneratedRecipe | null>(null);
  const [recentRecipes, setRecentRecipes] = useState<GeneratedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRecentRecipes();
  }, []);

  const loadRecentRecipes = async () => {
    // Mock data - replace with actual API call
    setRecentRecipes([
      {
        id: '1',
        title: 'Classic Italian Carbonara',
        description: 'A rich and creamy pasta dish with eggs, cheese, pancetta, and black pepper.',
        ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g pecorino romano', 'Black pepper'],
        instructions: [
          'Bring a large pot of salted water to boil',
          'Cook spaghetti until al dente',
          'Meanwhile, cook pancetta until crispy',
          'Beat eggs with cheese and pepper',
          'Drain pasta, reserve water',
          'Mix egg mixture with hot pasta',
          'Add pancetta and adjust with pasta water'
        ],
        prepTime: '10 minutes',
        cookTime: '15 minutes',
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Italian',
        tips: [
          'Serve immediately for best texture',
          'Use room temperature eggs',
          'Don\'t let the eggs scramble'
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: '2',
        title: 'Thai Green Curry',
        description: 'Aromatic and spicy curry with coconut milk and fresh vegetables.',
        ingredients: ['400ml coconut milk', '2 tbsp green curry paste', '1 bell pepper', '100g bamboo shoots', 'Thai basil'],
        instructions: [
          'Heat coconut milk in a pan',
          'Add curry paste and stir',
          'Add vegetables and simmer',
          'Season with fish sauce and sugar',
          'Garnish with Thai basil'
        ],
        prepTime: '15 minutes',
        cookTime: '20 minutes',
        servings: 3,
        difficulty: 'easy',
        cuisine: 'Thai',
        tips: [
          'Adjust spice level to taste',
          'Use fresh herbs for best flavor',
          'Serve with jasmine rice'
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ]);
  };

  const handleRecipeGenerated = (recipe: GeneratedRecipe) => {
    setCurrentRecipe(recipe);
    setRecentRecipes(prev => [recipe, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Recipe Generator" 
        subtitle="Create delicious recipes with AI assistance" 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
                <ChefHat className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{recentRecipes.length}</p>
                <p className="text-sm text-gray-400">Total Recipes</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
                <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {recentRecipes.filter(r => r.createdAt > new Date(Date.now() - 86400000)).length}
                </p>
                <p className="text-sm text-gray-400">Today</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {recentRecipes.filter(r => r.difficulty === 'easy').length}
                </p>
                <p className="text-sm text-gray-400">Easy Recipes</p>
              </div>
            </div>

            {/* Recipe Form */}
            <RecipeForm onRecipeGenerated={handleRecipeGenerated} />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {currentRecipe ? (
              <RecipePreview recipe={currentRecipe} />
            ) : (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
                <ChefHat className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Recipe Selected</h3>
                <p className="text-gray-400">
                  Fill out the form and generate a recipe to see it here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Recipes */}
        {recentRecipes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRecipes.map((recipe) => (
                <div 
                  key={recipe.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors cursor-pointer"
                  onClick={() => setCurrentRecipe(recipe)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white line-clamp-2">{recipe.title}</h4>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${recipe.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ''}
                      ${recipe.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                      ${recipe.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : ''}
                    `}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{recipe.cuisine}</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}