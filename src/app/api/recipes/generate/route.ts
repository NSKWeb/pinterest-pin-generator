// Recipe Generation API Route

import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/lib/ai/openrouter';
import { buildRecipePrompt } from '@/lib/ai/prompts/recipe-generator';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';
import { log } from '@/lib/logger';

export async function POST(request: NextRequest) {
  if (const corsResponse = withCORS(request)) {
    return corsResponse;
  }

  try {
    const body = await request.json();
    const { description, cuisine, dietary, difficulty, servings, style } = body;

    if (!description) {
      return createJsonResponse(
        { success: false, error: 'Description is required' },
        400
      );
    }

    // For demo, return mock data instead of calling AI
    // In production, you would uncomment the AI code below

    const mockRecipe = {
      id: Date.now().toString(),
      title: description.substring(0, 50),
      description: `A delicious ${cuisine || 'homemade'} ${style || 'traditional'} dish`,
      ingredients: [
        '2 cups all-purpose flour',
        '1 cup water',
        '1 tsp salt',
        '2 tbsp olive oil',
        'Fresh herbs (to taste)',
        '1 tsp black pepper',
        '2 cloves garlic, minced',
      ],
      instructions: [
        'In a large bowl, mix flour and salt to create a well',
        'Add water gradually while mixing until dough forms',
        'Knead for 10 minutes until smooth and elastic',
        'Let rest for 30 minutes at room temperature',
        'Shape according to your recipe requirements',
        'Cook in preheated pan until golden brown',
        'Serve hot with your favorite toppings or sauce',
      ],
      prepTime: '15 minutes',
      cookTime: '30 minutes',
      servings: parseInt(servings) || 4,
      difficulty: difficulty || 'medium',
      cuisine: cuisine || 'International',
      tips: [
        'Adjust seasoning to taste - add more salt or pepper as needed',
        'Best served fresh while hot for optimal texture',
        'Store leftovers in an airtight container for up to 3 days',
        'Try adding fresh herbs like basil or parsley for extra flavor',
      ],
      createdAt: new Date(),
    };

    // Uncomment below for real AI generation:
    /*
    const prompt = buildRecipePrompt(description, { cuisine, dietary, difficulty, servings, style });
    const response = await createChatCompletion([{ role: 'user', content: prompt }], {
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });

    const recipe = parseRecipeResponse(response.choices[0].message.content);
    */

    return createJsonResponse({
      success: true,
      data: mockRecipe,
    });

  } catch (error) {
    log.generation.error('recipe', error);
    return createJsonResponse(
      { success: false, error: 'Failed to generate recipe' },
      500
    );
  }
}