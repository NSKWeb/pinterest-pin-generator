// SEO Generation API Route

import { NextRequest } from 'next/server';
import { createChatCompletion } from '@/lib/ai/openrouter';
import { buildSEOPrompt } from '@/lib/ai/prompts/seo-metadata';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';
import { log } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body = await request.json();
    const { title, content, keywords, type } = body;

    if (!title) {
      return createJsonResponse(
        { success: false, error: 'Title is required' },
        400
      );
    }

    // For demo, return mock data
    const keywordList = keywords ? keywords.split(',').map(k => k.trim()) : [];
    
    const mockSEO = {
      id: Date.now().toString(),
      title,
      description: content ? content.substring(0, 150) : `Comprehensive guide about ${title.toLowerCase()}`,
      keywords: keywordList.length > 0 ? keywordList : ['guide', 'tutorial', 'how-to'],
      ogTitle: title,
      ogDescription: content ? content.substring(0, 150) : `Learn about ${title.toLowerCase()}`,
      twitterTitle: title,
      twitterDescription: content ? content.substring(0, 150) : `Discover insights about ${title.toLowerCase()}`,
      schemaMarkup: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: content ? content.substring(0, 200) : `Guide about ${title}`,
        author: {
          '@type': 'Organization',
          name: 'AI Content Suite'
        },
        publisher: {
          '@type': 'Organization',
          name: 'AI Content Suite'
        }
      }, null, 2),
      createdAt: new Date(),
    };

    // Uncomment below for real AI generation:
    /*
    const prompt = buildSEOPrompt(title, content, { keywords: keywordList, type });
    const response = await createChatCompletion([{ role: 'user', content: prompt }], {
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });

    const seo = parseSEOResponse(response.choices[0].message.content);
    */

    return createJsonResponse({
      success: true,
      data: mockSEO,
    });

  } catch (error) {
    log.generation.error('seo', error);
    return createJsonResponse(
      { success: false, error: 'Failed to generate SEO metadata' },
      500
    );
  }
}