// =============================================================================
// User Types - Shared between frontend and backend
// =============================================================================

export enum UserRole {
  SEEKER = 'SEEKER',
  EMPLOYER = 'EMPLOYER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
  name?: string;
  nickname?: string;
  phone?: string;
  phoneVerified: boolean;
  profileImage?: string;
  address?: string;
  addressDetail?: string;
  businessName?: string;
  businessNumber?: string;
  businessVerified: boolean;
  businessCertificateUrl?: string;
  agreePrivacy: boolean;
  agreeTerms: boolean;
  agreeMarketing: boolean;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublic {
  id: string;
  nickname?: string;
  profileImage?: string;
  role: UserRole;
}

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname?: string;
  phone: string;
  role: UserRole;
  businessName?: string;
  businessNumber?: string;
  agreePrivacy: boolean;
  agreeTerms: boolean;
  agreeMarketing?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
