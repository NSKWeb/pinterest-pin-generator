// SEO metadata generation prompts

export interface SEOPromptOptions {
  content?: string;
  url?: string;
  keywords?: string[];
  competitors?: string[];
  type?: 'page' | 'article' | 'product' | 'image';
}

export const seoSystemPrompt = `You are an SEO expert specializing in creating high-converting meta tags, structured data, and keyword optimization. You understand search engine algorithms and user search intent.`;

export function buildSEOPrompt(
  title: string,
  content?: string,
  options: SEOPromptOptions = {}
): string {
  const parts: string[] = [
    `Create comprehensive SEO metadata for: ${title}`,
  ];

  if (content) {
    parts.push(`Content summary: ${content.substring(0, 500)}...`);
  }

  if (options.keywords?.length) {
    parts.push(`Target keywords: ${options.keywords.join(', ')}`);
  }

  if (options.competitors?.length) {
    parts.push(`Competitor analysis reference: ${options.competitors.join(', ')}`);
  }

  if (options.type) {
    parts.push(`Content type: ${options.type}`);
  }

  parts.push(`
Provide SEO metadata in this JSON format:
{
  "title": "SEO title (50-60 characters, includes primary keyword)",
  "description": "Meta description (150-160 characters, compelling with CTA)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description",
  "ogImage": "og-image-url.jpg",
  "twitterTitle": "Twitter Card title",
  "twitterDescription": "Twitter Card description",
  "twitterImage": "twitter-image.jpg",
  "canonicalUrl": "https://example.com/canonical-url",
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article headline",
    "description": "Article description"
  },
  "additionalKeywords": ["related keyword 1", "related keyword 2"],
  "metaTags": {
    "robots": "index, follow",
    "author": "Author Name",
    "viewport": "width=device-width, initial-scale=1"
  }
}`);

  return parts.join('\n');
}

// SEO parsing from AI response
export function parseSEOResponse(response: string): any {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const seo = JSON.parse(jsonMatch[0]);
      // Validate and normalize
      return {
        title: seo.title || '',
        description: seo.description || '',
        keywords: seo.keywords || [],
        ogTitle: seo.ogTitle || seo.title,
        ogDescription: seo.ogDescription || seo.description,
        ogImage: seo.ogImage || '',
        twitterTitle: seo.twitterTitle || seo.title,
        twitterDescription: seo.twitterDescription || seo.description,
        twitterImage: seo.twitterImage || '',
        canonicalUrl: seo.canonicalUrl || '',
        schemaMarkup: seo.schemaMarkup || null,
        additionalKeywords: seo.additionalKeywords || [],
        metaTags: seo.metaTags || {
          robots: 'index, follow',
          viewport: 'width=device-width, initial-scale=1',
        },
      };
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    // Return structured fallback
    return {
      title: title || 'SEO Optimized Page',
      description: 'Meta description will be generated based on content',
      keywords: [],
      ogTitle: '',
      ogDescription: '',
      twitterTitle: '',
      twitterDescription: '',
      schemaMarkup: null,
    };
  }
}

// Keyword density analysis
export function analyzeKeywordDensity(
  content: string,
  keywords: string[]
): Record<string, number> {
  const density: Record<string, number> = {};
  const words = content.toLowerCase().split(/\s+/);
  const totalWords = words.length;

  keywords.forEach(keyword => {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let occurrences = 0;

    // Count occurrences
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      const phrase = words.slice(i, i + keywordWords.length).join(' ');
      if (phrase === keyword.toLowerCase()) {
        occurrences++;
      }
    }

    density[keyword] = (occurrences / totalWords) * 100;
  });

  return density;
}