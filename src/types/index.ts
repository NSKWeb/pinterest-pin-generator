// General Types

// Navigation
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
}

// Dashboard
export interface DashboardStats {
  totalRecipes: number;
  totalBlogs: number;
  totalPins: number;
  totalCampaigns: number;
  activeCampaigns: number;
  todayGenerated: number;
  apiUsageThisMonth: number;
  storageUsed: number;
}

export interface RecentActivity {
  id: string;
  type: 'generation' | 'campaign' | 'bulk_job';
  action: string;
  target: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
}

// API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Assets
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'data';
  size: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

// UI
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Export
export interface ExportOptions {
  format: 'json' | 'csv' | 'zip';
  contentTypes?: ContentType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeAssets?: boolean;
  includeMetadata?: boolean;
}

export interface ExportProgress {
  status: 'preparing' | 'compressing' | 'finalizing' | 'complete' | 'error';
  progress: number; // 0-100
  message?: string;
}

// Settings
export interface AppSettings {
  openrouter: {
    fastModel: string;
    qualityModel: string;
    blogModel: string;
    codeModel: string;
  };
  security: {
    sessionTimeout: number;
    requireAllLayers: boolean;
    auditLogging: boolean;
  };
  features: {
    enableCampaigns: boolean;
    enableBulkProcessing: boolean;
    enablePinStudio: boolean;
    enableAssetLibrary: boolean;
  };
  automation: {
    queueConcurrency: number;
    campaignRetryAttempts: number;
    campaignRetryDelay: number;
  };
}

import type { ContentType } from './campaign';