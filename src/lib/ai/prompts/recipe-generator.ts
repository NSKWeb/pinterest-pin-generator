// Recipe generation prompts

export interface RecipePromptOptions {
  cuisine?: string;
  dietary?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  servings?: number;
  style?: 'traditional' | 'modern' | 'fusion';
}

export const recipeSystemPrompt = `You are an expert chef and recipe developer. Create detailed, practical recipes that home cooks can easily follow. Include accurate measurements, clear instructions, and helpful tips.`;

export function buildRecipePrompt(
  description: string,
  options: RecipePromptOptions = {}
): string {
  const parts: string[] = [
    `Create a detailed recipe based on: ${description}`,
  ];

  if (options.cuisine) {
    parts.push(`Cuisine: ${options.cuisine}`);
  }

  if (options.dietary?.length) {
    parts.push(`Dietary requirements: ${options.dietary.join(', ')}`);
  }

  if (options.difficulty) {
    parts.push(`Difficulty level: ${options.difficulty}`);
  }

  if (options.servings) {
    parts.push(`Servings: ${options.servings}`);
  }

  if (options.style) {
    parts.push(`Style: ${options.style}`);
  }

  parts.push(`
Provide the recipe in this JSON format:
{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": ["1 cup flour", "2 eggs", ...],
  "instructions": ["Step 1...", "Step 2...", ...],
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "servings": 4,
  "difficulty": "easy",
  "tips": ["Tip 1...", "Tip 2..."],
  "nutrition": {
    "calories": 350,
    "protein": 12,
    "carbs": 45,
    "fat": 10
  }
}`);

  return parts.join('\n');
}

// Recipe parsing from AI response
export function parseRecipeResponse(response: string): any {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    // Return structured fallback
    return {
      title: 'Generated Recipe',
      description: response.substring(0, 200),
      ingredients: response.split('\n').filter(l => l.trim()),
      instructions: [],
      difficulty: 'medium',
    };
  }
}