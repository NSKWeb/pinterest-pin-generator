// Configuration for AI SaaS Dashboard

import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_NAME: z.string().default('AI Content Suite'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Database
  DATABASE_URL: z.string().min(1),
  
  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // OpenRouter
  OPENROUTER_API_KEY: z.string().min(1, 'OpenRouter API key is required'),
  OPENROUTER_FAST_MODEL: z.string().default('openai/gpt-4o-mini'),
  OPENROUTER_QUALITY_MODEL: z.string().default('openai/gpt-4o'),
  OPENROUTER_BLOG_MODEL: z.string().default('anthropic/claude-3-5-sonnet-20241022'),
  OPENROUTER_CODE_MODEL: z.string().default('deepseek/deepseek-coder'),
  
  // Image APIs
  REPLICATE_API_TOKEN: z.string().optional(),
  REPLICATE_API_KEY: z.string().optional(),
  STABILITY_API_KEY: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  ADMIN_RATE_LIMIT_MAX: z.coerce.number().default(10),
  ADMIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  
  // Session
  SESSION_TIMEOUT: z.coerce.number().default(120), // minutes
  
  // Storage
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(10485760), // 10MB
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENABLE_AUDIT_LOG: z.string().transform(val => val === 'true').default(true),
  
  // Feature Flags
  ENABLE_CAMPAIGNS: z.string().transform(val => val === 'true').default(true),
  ENABLE_BULK_PROCESSING: z.string().transform(val => val === 'true').default(true),
  ENABLE_PIN_STUDIO: z.string().transform(val => val === 'true').default(true),
  ENABLE_ASSET_LIBRARY: z.string().transform(val => val === 'true').default(true),
  ENABLE_EXPORT: z.string().transform(val => val === 'true').default(true),
  
  // Campaign Automation
  QUEUE_CONCURRENCY: z.coerce.number().default(3),
  CAMPAIGN_RETRY_ATTEMPTS: z.coerce.number().default(3),
  CAMPAIGN_RETRY_DELAY: z.coerce.number().default(5000),
});

// Validate and export config
export const config = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_FAST_MODEL: process.env.OPENROUTER_FAST_MODEL,
  OPENROUTER_QUALITY_MODEL: process.env.OPENROUTER_QUALITY_MODEL,
  OPENROUTER_BLOG_MODEL: process.env.OPENROUTER_BLOG_MODEL,
  OPENROUTER_CODE_MODEL: process.env.OPENROUTER_CODE_MODEL,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  REPLICATE_API_KEY: process.env.REPLICATE_API_KEY,
  STABILITY_API_KEY: process.env.STABILITY_API_KEY,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  ADMIN_RATE_LIMIT_MAX: process.env.ADMIN_RATE_LIMIT_MAX,
  ADMIN_RATE_LIMIT_WINDOW_MS: process.env.ADMIN_RATE_LIMIT_WINDOW_MS,
  SESSION_TIMEOUT: process.env.SESSION_TIMEOUT,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  LOG_LEVEL: process.env.LOG_LEVEL,
  ENABLE_AUDIT_LOG: process.env.ENABLE_AUDIT_LOG,
  ENABLE_CAMPAIGNS: process.env.ENABLE_CAMPAIGNS,
  ENABLE_BULK_PROCESSING: process.env.ENABLE_BULK_PROCESSING,
  ENABLE_PIN_STUDIO: process.env.ENABLE_PIN_STUDIO,
  ENABLE_ASSET_LIBRARY: process.env.ENABLE_ASSET_LIBRARY,
  ENABLE_EXPORT: process.env.ENABLE_EXPORT,
  QUEUE_CONCURRENCY: process.env.QUEUE_CONCURRENCY,
  CAMPAIGN_RETRY_ATTEMPTS: process.env.CAMPAIGN_RETRY_ATTEMPTS,
  CAMPAIGN_RETRY_DELAY: process.env.CAMPAIGN_RETRY_DELAY,
});

// App constants
export const APP_NAME = config.NEXT_PUBLIC_APP_NAME;
export const APP_ENV = config.NEXT_PUBLIC_APP_ENV;

// Storage keys
export const STORAGE_KEYS = {
  authSession: 'ai_saas_auth_session',
  userPrefs: 'ai_saas_user_prefs',
  recentContent: 'ai_saas_recent_content',
};

// Navigation items
export const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    id: 'recipes',
    label: 'Recipe Generator',
    icon: 'ChefHat',
    path: '/dashboard/recipes',
  },
  {
    id: 'blogs',
    label: 'Blog Generator',
    icon: 'FileText',
    path: '/dashboard/blogs',
  },
  {
    id: 'pin-studio',
    label: 'Pin Studio',
    icon: 'Image',
    path: '/dashboard/pins',
  },
  {
    id: 'seo',
    label: 'SEO Generator',
    icon: 'Search',
    path: '/dashboard/seo',
  },
  {
    id: 'campaigns',
    label: 'Campaign Manager',
    icon: 'Zap',
    path: '/dashboard/campaigns',
    badge: 'Pro',
  },
  {
    id: 'assets',
    label: 'Asset Library',
    icon: 'FolderOpen',
    path: '/dashboard/assets',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/dashboard/settings',
  },
] as const;

// AI Models
export const AI_MODELS = {
  FAST: config.OPENROUTER_FAST_MODEL,
  QUALITY: config.OPENROUTER_QUALITY_MODEL,
  BLOG: config.OPENROUTER_BLOG_MODEL,
  CODE: config.OPENROUTER_CODE_MODEL,
};

// Rate limits
export const RATE_LIMITS = {
  GENERAL: {
    maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
    windowMs: config.RATE_LIMIT_WINDOW_MS,
  },
  ADMIN: {
    maxRequests: config.ADMIN_RATE_LIMIT_MAX,
    windowMs: config.ADMIN_RATE_LIMIT_WINDOW_MS,
  },
};

// Feature flags
export const FEATURES = {
  CAMPAIGNS: config.ENABLE_CAMPAIGNS,
  BULK_PROCESSING: config.ENABLE_BULK_PROCESSING,
  PIN_STUDIO: config.ENABLE_PIN_STUDIO,
  ASSET_LIBRARY: config.ENABLE_ASSET_LIBRARY,
  EXPORT: config.ENABLE_EXPORT,
} as const;

// Content type configurations
export const CONTENT_TYPES = {
  RECIPE: {
    label: 'Recipe',
    icon: 'ChefHat',
    color: 'green',
  },
  BLOG: {
    label: 'Blog Post',
    icon: 'FileText',
    color: 'blue',
  },
  PIN: {
    label: 'Pinterest Pin',
    icon: 'Image',
    color: 'red',
  },
  SEO: {
    label: 'SEO Metadata',
    icon: 'Search',
    color: 'purple',
  },
} as const;

// File upload settings
export const UPLOAD_CONFIG = {
  maxFileSize: config.MAX_FILE_SIZE,
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    documents: ['application/pdf', 'text/plain'],
    data: ['application/json', 'text/csv'],
  },
  uploadDir: config.UPLOAD_DIR,
} as const;

// Export formats
export const EXPORT_FORMATS = [
  {
    id: 'json',
    label: 'JSON',
    description: 'Complete data with metadata',
    extension: '.json',
  },
  {
    id: 'csv',
    label: 'CSV',
    description: 'Spreadsheet-compatible format',
    extension: '.csv',
  },
  {
    id: 'zip',
    label: 'ZIP Archive',
    description: 'All files and assets',
    extension: '.zip',
  },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid authentication credentials',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    RATE_LIMITED: 'Too many attempts. Please try again later',
  },
  GENERATION: {
    FAILED: 'Content generation failed',
    INVALID_INPUT: 'Invalid input data',
    MODEL_ERROR: 'AI model error',
    QUOTA_EXCEEDED: 'API quota exceeded',
  },
  UPLOAD: {
    FILE_TOO_LARGE: 'File size exceeds limit',
    INVALID_TYPE: 'Invalid file type',
    UPLOAD_FAILED: 'File upload failed',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Successfully authenticated',
    LOGOUT_SUCCESS: 'Successfully logged out',
  },
  GENERATION: {
    RECIPE_CREATED: 'Recipe generated successfully',
    BLOG_CREATED: 'Blog post created successfully',
    PIN_CREATED: 'Pin created successfully',
    SEO_CREATED: 'SEO metadata generated successfully',
  },
  CAMPAIGN: {
    CREATED: 'Campaign created successfully',
    UPDATED: 'Campaign updated successfully',
    STARTED: 'Campaign started successfully',
    PAUSED: 'Campaign paused successfully',
  },
  EXPORT: {
    SUCCESS: 'Export completed successfully',
  },
} as const;