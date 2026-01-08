// =============================================================================
// Ad Types - Shared between frontend and backend
// =============================================================================

export enum AdStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

// Data source to distinguish between advertiser-submitted and scraped data
export enum DataSource {
  ADVERTISER = 'ADVERTISER',  // Directly submitted by advertiser
  SCRAPER = 'SCRAPER',        // Collected from external sites
}

export interface Ad {
  id: string;
  tenantId: string;
  userId: string;
  productId?: string;

  // Business Info
  businessName: string;
  managerName?: string;
  managerPhone?: string;
  contactKakao?: string;
  contactLine?: string;
  contactTelegram?: string;
  contactWechat?: string;

  // Address
  zonecode?: string;
  roadAddress?: string;
  addressDetail?: string;
  isLocationVerified: boolean;

  // Logo
  businessLogoUrl?: string;
  adLogoUrl?: string;

  // Job Info
  title: string;
  description?: string;
  industryLevel1?: string;
  industryLevel2?: string;
  region?: string;
  district?: string;
  town?: string;

  // Recruitment
  recruitmentType?: string;
  recruitNumber?: string;
  workHoursType?: string;
  workHoursStart?: string;
  workHoursEnd?: string;
  workDays: string[];

  // Salary
  salaryType?: string;
  salaryAmount?: string;

  // Requirements
  ageMin?: number;
  ageMax?: number;
  ageNoLimit: boolean;
  gender?: string;
  experience?: string;
  daysOff?: string;

  // Deadline
  deadlineDate?: string;
  deadlineAlways: boolean;

  // Additional Info
  welfare: string[];
  preferredConditions: string[];
  receptionMethods: string[];
  requiredDocuments: string[];
  keywords: string[];
  themes: string[];

  // Images
  thumbnail?: string;
  images: string[];

  // Ad Options
  highlightConfig?: HighlightConfig;
  jumpUpConfig?: JumpUpConfig;

  // Status
  badges: string[];
  isUrgent: boolean;
  isHot: boolean;
  isNew: boolean;
  status: AdStatus;
  rejectReason?: string;

  // Dates
  startDate: string;
  endDate?: string;

  // Stats
  viewCount: number;
  clickCount: number;
  applyCount: number;
  sortPriority: number;
  lastJumpUpAt?: string;

  // History
  rotationCount: number;
  firstAdDate: string;

  // Data Source
  dataSource: DataSource;
  sourceUrl?: string;  // Original URL for scraped data

  createdAt: string;
  updatedAt: string;
}

export interface HighlightConfig {
  color?: string;
  text?: string;
  range?: string;
}

export interface JumpUpConfig {
  enabled: boolean;
  interval?: number;
  count?: number;
  remaining?: number;
}

// List item (lighter version for lists)
export interface AdListItem {
  id: string;
  title: string;
  businessName: string;
  thumbnail?: string;
  region?: string;
  district?: string;
  salaryType?: string;
  salaryAmount?: string;
  badges: string[];
  isUrgent: boolean;
  isHot: boolean;
  isNew: boolean;
  status: AdStatus;
  viewCount: number;
  createdAt: string;
  dataSource?: DataSource;  // Optional for backwards compatibility
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}

export interface AdQueryParams {
  cursor?: string;
  limit?: number;
  region?: string;
  district?: string;
  industry?: string;
  status?: AdStatus;
  sortBy?: 'latest' | 'popular' | 'salary';
}

// Create/Update DTOs
export interface CreateAdRequest {
  businessName: string;
  title: string;
  description?: string;
  managerName?: string;
  managerPhone?: string;
  contactKakao?: string;
  zonecode?: string;
  roadAddress?: string;
  addressDetail?: string;
  industryLevel1?: string;
  industryLevel2?: string;
  region?: string;
  district?: string;
  town?: string;
  recruitmentType?: string;
  recruitNumber?: string;
  workHoursType?: string;
  workHoursStart?: string;
  workHoursEnd?: string;
  workDays?: string[];
  salaryType?: string;
  salaryAmount?: string;
  ageMin?: number;
  ageMax?: number;
  ageNoLimit?: boolean;
  gender?: string;
  experience?: string;
  deadlineDate?: string;
  deadlineAlways?: boolean;
  welfare?: string[];
  preferredConditions?: string[];
  receptionMethods?: string[];
  keywords?: string[];
  thumbnail?: string;
  images?: string[];
}

export type UpdateAdRequest = Partial<CreateAdRequest>;
