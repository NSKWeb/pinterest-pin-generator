// Pinterest pin optimization prompts

export interface PinPromptOptions {
  niche?: string;
  style?: 'minimal' | 'bold' | 'elegant' | 'vibrant';
  audience?: string;
  trend?: boolean;
}

export const pinSystemPrompt = `You are a Pinterest marketing expert specializing in creating high-performing pin descriptions and titles. You understand Pinterest's algorithm, user behavior, and what drives engagement on the platform.`;

export function buildPinPrompt(
  content: string,
  options: PinPromptOptions = {}
): string {
  const parts: string[] = [
    `Create Pinterest-optimized metadata for: ${content}`,
  ];

  if (options.niche) {
    parts.push(`Target niche: ${options.niche}`);
  }

  if (options.style) {
    parts.push(`Visual style: ${options.style}`);
  }

  if (options.audience) {
    parts.push(`Target audience: ${options.audience}`);
  }

  if (options.trend) {
    parts.push('Incorporate current Pinterest trends');
  }

  parts.push(`
Provide Pinterest-optimized metadata in this JSON format:
{
  "title": "Catchy, keyword-rich title (max 100 characters)",
  "description": "Detailed description with keywords and hashtags (max 500 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3", ...],
  "hashtags": ["#tag1", "#tag2", "#tag3", ...],
  "textOverlay": "Short text for pin image (max 40 characters)",
  "suggestedColors": ["#color1", "#color2"],
  "aspectRatio": "2:3",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`);

  return parts.join('\n');
}

// Pin metadata parsing from AI response
export function parsePinResponse(response: string): any {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const pin = JSON.parse(jsonMatch[0]);
      // Ensure required fields
      return {
        title: pin.title || 'Pinterest Pin',
        description: pin.description || '',
        keywords: pin.keywords || [],
        hashtags: pin.hashtags || [],
        textOverlay: pin.textOverlay || '',
        suggestedColors: pin.suggestedColors || [],
        aspectRatio: pin.aspectRatio || '2:3',
        tips: pin.tips || [],
      };
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    // Return structured fallback
    return {
      title: 'Generated Pin',
      description: response.substring(0, 300),
      keywords: [],
      hashtags: [],
      textOverlay: '',
      aspectRatio: '2:3',
    };
  }
}