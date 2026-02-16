// Campaign Types

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type RunStatus = 'pending' | 'running' | 'completed' | 'failed';
export type BulkJobType = 'recipe-batch' | 'blog-batch' | 'pin-batch' | 'seo-batch';
export type BulkJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  contentTypes: ContentType[];
  topics: string[];
  schedule?: string; // cron expression
  isRecurring: boolean;
  autoPublish: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  nextRunAt?: Date;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
}

export interface CampaignFormData {
  name: string;
  description?: string;
  contentTypes: ContentType[];
  topics: string[];
  schedule?: string;
  isRecurring: boolean;
  autoPublish: boolean;
}

export interface CampaignRun {
  id: string;
  campaignId: string;
  status: RunStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  itemsProcessed: number;
  itemsTotal: number;
  results?: GeneratedContent[];
}

export interface BulkJob {
  id: string;
  type: BulkJobType;
  status: BulkJobStatus;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  progress: number; // percentage
  inputData: any[];
  results?: any[];
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  title: string;
  content: any; // Recipe, BlogPost, PinData, or SEOMetadata
  metadata?: any;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  campaignId?: string;
  campaignRunId?: string;
}

export type ContentType = 'recipe' | 'blog' | 'pin' | 'seo';