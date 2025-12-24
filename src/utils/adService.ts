// Ad Service with Backend API Integration
// Provides dual mode: API-based ads with localStorage fallback

import { api } from './apiClient';
import type { UserAd } from './adStorage';

// Use API mode when VITE_API_URL is set and not localhost
const API_URL = import.meta.env.VITE_API_URL || '';
export const USE_API_ADS = API_URL.length > 0 && !API_URL.includes('localhost');

// ============================================
// API Types
// ============================================
interface AdsApiResponse {
    success: boolean;
    data?: UserAd[] | UserAd;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message?: string;
}

interface AdQueryParams {
    status?: string;
    productType?: string;
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
}

// ============================================
// API Functions
// ============================================

// 광고 목록 조회 (공개)
export const fetchAdsFromApi = async (
    params: AdQueryParams = {}
): Promise<{ ads: UserAd[]; total: number }> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.set('status', params.status);
        if (params.productType) queryParams.set('productType', params.productType);
        if (params.location) queryParams.set('location', params.location);
        if (params.search) queryParams.set('search', params.search);
        if (params.page) queryParams.set('page', String(params.page));
        if (params.limit) queryParams.set('limit', String(params.limit));

        const endpoint = `/ads${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await api.get<AdsApiResponse>(endpoint);

        if (response.data?.success && response.data.data) {
            const ads = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            return {
                ads,
                total: response.data.pagination?.total || ads.length
            };
        }

        return { ads: [], total: 0 };
    } catch (error) {
        console.error('Fetch ads error:', error);
        return { ads: [], total: 0 };
    }
};

// 광고 상세 조회 (공개)
export const fetchAdByIdFromApi = async (id: string): Promise<UserAd | null> => {
    try {
        const response = await api.get<AdsApiResponse>(`/ads/${id}`);

        if (response.data?.success && response.data.data && !Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        console.error('Fetch ad by ID error:', error);
        return null;
    }
};

// 광고 등록
export const createAdWithApi = async (
    adData: Omit<UserAd, 'id' | 'userId' | 'status' | 'views' | 'inquiries' | 'createdAt' | 'expiresAt'>
): Promise<{ success: boolean; message: string; ad?: UserAd }> => {
    try {
        const response = await api.post<AdsApiResponse>('/ads', adData);

        if (response.data?.success && response.data.data && !Array.isArray(response.data.data)) {
            return {
                success: true,
                message: response.data.message || '광고가 등록되었습니다. 관리자 승인 후 게시됩니다.',
                ad: response.data.data
            };
        }

        return {
            success: false,
            message: response.error || response.data?.message || '광고 등록에 실패했습니다.'
        };
    } catch (error) {
        console.error('Create ad error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};

// 광고 수정
export const updateAdWithApi = async (
    id: string,
    adData: Partial<UserAd>
): Promise<{ success: boolean; message: string; ad?: UserAd }> => {
    try {
        const response = await api.put<AdsApiResponse>(`/ads/${id}`, adData);

        if (response.data?.success && response.data.data && !Array.isArray(response.data.data)) {
            return {
                success: true,
                message: '광고가 수정되었습니다.',
                ad: response.data.data
            };
        }

        return {
            success: false,
            message: response.error || response.data?.message || '광고 수정에 실패했습니다.'
        };
    } catch (error) {
        console.error('Update ad error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};

// 광고 삭제
export const deleteAdWithApi = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.delete<AdsApiResponse>(`/ads/${id}`);

        return {
            success: response.data?.success || false,
            message: response.data?.message || '광고가 삭제되었습니다.'
        };
    } catch (error) {
        console.error('Delete ad error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};

// 조회수 증가
export const incrementAdViewWithApi = async (id: string): Promise<void> => {
    try {
        await api.post(`/ads/${id}/view`, {});
    } catch (error) {
        console.error('Increment view error:', error);
    }
};

// 내 광고 목록 조회 (광고주용)
export const fetchMyAdsFromApi = async (): Promise<UserAd[]> => {
    try {
        // 백엔드에 /ads/my 엔드포인트가 있다면 그것을 사용
        // 없다면 전체 목록에서 필터링해야 함
        const response = await api.get<AdsApiResponse>('/ads/my');

        if (response.data?.success && response.data.data) {
            return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        }

        return [];
    } catch (error) {
        console.error('Fetch my ads error:', error);
        return [];
    }
};

// 대기중인 광고 목록 (관리자용)
export const fetchPendingAdsFromApi = async (): Promise<UserAd[]> => {
    try {
        const response = await api.get<AdsApiResponse>('/ads?status=pending');

        if (response.data?.success && response.data.data) {
            return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        }

        return [];
    } catch (error) {
        console.error('Fetch pending ads error:', error);
        return [];
    }
};

// 광고 승인 (관리자용)
export const approveAdWithApi = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.put<AdsApiResponse>(`/ads/${id}`, { status: 'active' });

        return {
            success: response.data?.success || false,
            message: response.data?.message || '광고가 승인되었습니다.'
        };
    } catch (error) {
        console.error('Approve ad error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};

// 광고 반려 (관리자용)
export const rejectAdWithApi = async (
    id: string,
    reason: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.put<AdsApiResponse>(`/ads/${id}`, {
            status: 'rejected',
            rejectionReason: reason
        });

        return {
            success: response.data?.success || false,
            message: response.data?.message || '광고가 반려되었습니다.'
        };
    } catch (error) {
        console.error('Reject ad error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};
