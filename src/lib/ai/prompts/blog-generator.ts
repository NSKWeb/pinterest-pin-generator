// Blog generation prompts

export interface BlogPromptOptions {
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative';
  structure?: 'listicle' | 'how-to' | 'guide' | 'review' | 'tutorial';
  length?: 'short' | 'medium' | 'long';
  targetWordCount?: number;
}

export const blogSystemPrompt = `You are an expert content writer and SEO specialist. Create engaging, well-structured blog posts that are optimized for search engines while providing genuine value to readers.`;

export function buildBlogPrompt(
  topic: string,
  options: BlogPromptOptions = {}
): string {
  const parts: string[] = [
    `Write a ${options.length || 'medium'}-form ${options.structure || 'blog post'} about: ${topic}`,
  ];

  if (options.keywords?.length) {
    parts.push(`Target keywords: ${options.keywords.join(', ')}`);
  }

  if (options.tone) {
    parts.push(`Tone: ${options.tone}`);
  }

  if (options.targetWordCount) {
    parts.push(`Target word count: approximately ${options.targetWordCount} words`);
  }

  parts.push(`
Create content that includes:
- Compelling introduction
- Clear headings (## H2, ### H3)
- Substantial body content for each section
- Actionable conclusion
- Use the target keywords naturally throughout

Provide the blog post in this JSON format:
{
  "title": "Blog post title",
  "excerpt": "Brief summary (150-160 characters)",
  "content": "Full HTML/Markdown content with headings",
  "metaTitle": "SEO title (50-60 characters)",
  "metaDescription": "SEO description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", ...],
  "slug": "url-friendly-slug",
  "readTime": 5,
  "tags": ["tag1", "tag2", ...]
}`);

  return parts.join('\n');
}

// Blog parsing from AI response
export function parseBlogResponse(response: string): any {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const blog = JSON.parse(jsonMatch[0]);
      // Ensure content has headings
      if (!blog.content?.includes('##')) {
        blog.content = `# ${blog.title}\n\n${blog.content}`;
      }
      return blog;
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    // Return structured fallback
    return {
      title: 'Generated Blog Post',
      excerpt: response.substring(0, 150),
      content: response,
      keywords: [],
      readTime: Math.ceil(response.split(' ').length / 200),
    };
  }
}