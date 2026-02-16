// AI and Content Types

export type ContentType = 'recipe' | 'blog' | 'pin' | 'seo';

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietary?: string[];
  tips?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  image?: string;
}

export interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug?: string;
  publishedAt?: Date;
  readTime?: number;
  tags?: string[];
  structure: 'listicle' | 'how-to' | 'guide' | 'review' | 'tutorial';
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative';
  wordCount?: number;
}

export interface PinData {
  title: string;
  description: string;
  text: string;
  backgroundImage?: string;
  textPosition: {
    x: number;
    y: number;
  };
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
  width: number;
  height: number;
  tags: string[];
  aspectRatio: '2:3' | '1:1' | '4:5';
  template?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
}

export interface BulkGenerationRequest {
  type: ContentType;
  inputs: string[];
  options?: Record<string, any>;
}

export interface BulkGenerationResponse {
  success: boolean;
  jobId: string;
  totalItems: number;
  estimatedTime: number;
}