// =============================================================================
// Community Types - Shared between frontend and backend
// =============================================================================

export enum PostCategory {
  FREE = 'FREE',
  QNA = 'QNA',
  REVIEW = 'REVIEW',
  TIP = 'TIP',
  NEWS = 'NEWS',
}

export interface CommunityPost {
  id: string;
  tenantId: string;
  userId?: string;
  category: PostCategory;
  title: string;
  content: string;
  authorName?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isNotice: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostListItem {
  id: string;
  category: PostCategory;
  title: string;
  authorName?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isNotice: boolean;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId?: string;
  parentId?: string;
  content: string;
  authorName?: string;
  likeCount: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  category: PostCategory;
  title: string;
  content: string;
  authorName?: string;
  password?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  password?: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string;
  authorName?: string;
  password?: string;
}

export interface PostQueryParams {
  cursor?: string;
  limit?: number;
  category?: PostCategory;
  search?: string;
}
