/**
 * Admin CRM API Service
 * 관리자 전용 API 호출 서비스
 * 백엔드 /admin/* 엔드포인트 연동
 */

import { api } from './apiClient';

// Types
export interface AdminStats {
    totalUsers: number;
    totalAds: number;
    pendingAds: number;
    activeAds: number;
    totalRevenue: number;
    todaySignups: number;
    todayAds: number;
    reports: number;
}

export interface PendingAd {
    id: string;
    title: string;
    businessName: string;
    productType: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'premium' | 'special' | 'text';
    createdAt: string;
    userId: string;
    status: 'pending';
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    type: 'worker' | 'advertiser';
    businessNumber?: string;
    businessName?: string;
    createdAt: string;
    status?: 'active' | 'suspended' | 'deleted';
}

export interface ApiResult<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Check if API is available
const getApiUrl = () => import.meta.env.VITE_API_URL;

/**
 * 관리자 통계 조회
 */
export async function getAdminStats(): Promise<ApiResult<AdminStats>> {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        // 백엔드 미설정 시 로컬 데이터 반환
        return {
            success: true,
            data: getLocalStats()
        };
    }

    try {
        const response = await api.get<AdminStats>('/admin/stats');

        if (response.error) {
            console.warn('Admin stats API error, falling back to local:', response.error);
            return {
                success: true,
                data: getLocalStats()
            };
        }

        return {
            success: true,
            data: response.data || getLocalStats()
        };
    } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        return {
            success: true,
            data: getLocalStats()
        };
    }
}

/**
 * 대기 광고 목록 조회
 */
export async function getPendingAdsFromApi(limit?: number): Promise<ApiResult<PendingAd[]>> {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        return {
            success: true,
            data: getLocalPendingAds()
        };
    }

    try {
        const endpoint = limit ? `/admin/ads/pending?limit=${limit}` : '/admin/ads/pending';
        const response = await api.get<PendingAd[]>(endpoint);

        if (response.error) {
            console.warn('Pending ads API error, falling back to local:', response.error);
            return {
                success: true,
                data: getLocalPendingAds()
            };
        }

        return {
            success: true,
            data: response.data || []
        };
    } catch (error) {
        console.error('Failed to fetch pending ads:', error);
        return {
            success: true,
            data: getLocalPendingAds()
        };
    }
}

/**
 * 광고 승인
 */
export async function approveAdFromApi(adId: string): Promise<ApiResult<void>> {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        // localStorage fallback
        return approveAdLocal(adId);
    }

    try {
        const response = await api.post<{ message: string }>(`/admin/ads/${adId}/approve`, {});

        if (response.error) {
            return {
                success: false,
                message: response.error
            };
        }

        return {
            success: true,
            message: '광고가 승인되었습니다.'
        };
    } catch (error) {
        console.error('Failed to approve ad:', error);
        return {
            success: false,
            message: '광고 승인에 실패했습니다.'
        };
    }
}

/**
 * 광고 반려
 */
export async function rejectAdFromApi(adId: string, reason?: string): Promise<ApiResult<void>> {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        return rejectAdLocal(adId, reason);
    }

    try {
        const response = await api.post<{ message: string }>(`/admin/ads/${adId}/reject`, { reason });

        if (response.error) {
            return {
                success: false,
                message: response.error
            };
        }

        return {
            success: true,
            message: '광고가 반려되었습니다.'
        };
    } catch (error) {
        console.error('Failed to reject ad:', error);
        return {
            success: false,
            message: '광고 반려에 실패했습니다.'
        };
    }
}

/**
 * 회원 목록 조회
 */
export async function getAdminUsers(
    filter?: 'all' | 'worker' | 'advertiser',
    page?: number,
    limit?: number
): Promise<ApiResult<AdminUser[]>> {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        return {
            success: true,
            data: getLocalUsers(filter)
        };
    }

    try {
        const params = new URLSearchParams();
        if (filter && filter !== 'all') params.append('type', filter);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());

        const endpoint = `/admin/users${params.toString() ? '?' + params.toString() : ''}`;
        const response = await api.get<AdminUser[]>(endpoint);

        if (response.error) {
            console.warn('Users API error, falling back to local:', response.error);
            return {
                success: true,
                data: getLocalUsers(filter)
            };
        }

        return {
            success: true,
            data: response.data || []
        };
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return {
            success: true,
            data: getLocalUsers(filter)
        };
    }
}

// ================== Local Storage Fallback Functions ==================

function getLocalStats(): AdminStats {
    const users = JSON.parse(localStorage.getItem('lunaalba_users') || '[]');
    const ads = JSON.parse(localStorage.getItem('lunaalba_user_ads') || '[]');

    const today = new Date().toISOString().split('T')[0];

    return {
        totalUsers: users.length,
        totalAds: ads.length,
        pendingAds: ads.filter((a: { status: string }) => a.status === 'pending').length,
        activeAds: ads.filter((a: { status: string }) => a.status === 'active').length,
        totalRevenue: 0, // 결제 시스템 연동 시 구현
        todaySignups: users.filter((u: { createdAt: string }) => u.createdAt?.startsWith(today)).length,
        todayAds: ads.filter((a: { createdAt: string }) => a.createdAt?.startsWith(today)).length,
        reports: 0
    };
}

function getLocalPendingAds(): PendingAd[] {
    const ads = JSON.parse(localStorage.getItem('lunaalba_user_ads') || '[]');
    return ads
        .filter((a: { status: string }) => a.status === 'pending')
        .map((a: { id: string; title: string; businessName: string; productType: string; createdAt: string; userId: string }) => ({
            id: a.id,
            title: a.title || '제목 없음',
            businessName: a.businessName || '업소명 없음',
            productType: a.productType || 'text',
            createdAt: a.createdAt,
            userId: a.userId,
            status: 'pending' as const
        }));
}

function getLocalUsers(filter?: 'all' | 'worker' | 'advertiser'): AdminUser[] {
    const users = JSON.parse(localStorage.getItem('lunaalba_users') || '[]');

    if (filter && filter !== 'all') {
        return users.filter((u: { type: string }) => u.type === filter);
    }

    return users;
}

function approveAdLocal(adId: string): ApiResult<void> {
    try {
        const ads = JSON.parse(localStorage.getItem('lunaalba_user_ads') || '[]');
        const adIndex = ads.findIndex((a: { id: string }) => a.id === adId);

        if (adIndex === -1) {
            return { success: false, message: '광고를 찾을 수 없습니다.' };
        }

        ads[adIndex].status = 'active';
        ads[adIndex].approvedAt = new Date().toISOString();
        localStorage.setItem('lunaalba_user_ads', JSON.stringify(ads));

        return { success: true, message: '광고가 승인되었습니다.' };
    } catch {
        return { success: false, message: '광고 승인에 실패했습니다.' };
    }
}

function rejectAdLocal(adId: string, reason?: string): ApiResult<void> {
    try {
        const ads = JSON.parse(localStorage.getItem('lunaalba_user_ads') || '[]');
        const adIndex = ads.findIndex((a: { id: string }) => a.id === adId);

        if (adIndex === -1) {
            return { success: false, message: '광고를 찾을 수 없습니다.' };
        }

        ads[adIndex].status = 'rejected';
        ads[adIndex].rejectedAt = new Date().toISOString();
        ads[adIndex].rejectionReason = reason || '정책 위반';
        localStorage.setItem('lunaalba_user_ads', JSON.stringify(ads));

        return { success: true, message: '광고가 반려되었습니다.' };
    } catch {
        return { success: false, message: '광고 반려에 실패했습니다.' };
    }
}

// ================== Export ==================

export const adminService = {
    getStats: getAdminStats,
    getPendingAds: getPendingAdsFromApi,
    approveAd: approveAdFromApi,
    rejectAd: rejectAdFromApi,
    getUsers: getAdminUsers
};

export default adminService;
