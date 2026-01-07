// =============================================================================
// Common Types - Shared utilities and base types
// =============================================================================

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  requestId?: string;
  timestamp: string;
  version?: string;
}

// Pagination types
export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}

export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}

export interface OffsetPaginationParams {
  page?: number;
  limit?: number;
}

export interface OffsetPaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Health check
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  version: string;
  timestamp: string;
  services?: Record<string, ServiceHealth>;
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  latency?: number;
  message?: string;
}

// Tenant
export interface Tenant {
  id: string;
  name: string;
  displayName: string;
  domain?: string;
  subdomain?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  settings: Record<string, unknown>;
  features: Record<string, boolean>;
  isActive: boolean;
  createdAt: string;
}

// File upload
export interface FileUploadResponse {
  url: string;
  publicId?: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Sort options
export type SortOrder = 'asc' | 'desc';

export interface SortOption<T extends string = string> {
  field: T;
  order: SortOrder;
}

// Filter types
export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface NumberRangeFilter {
  min?: number;
  max?: number;
}
