// Simple LocalStorage-based Ad Storage
// For demo purposes - not for production

import { getCurrentUser } from './auth';

export interface UserAd {
    id: string;
    userId: string;
    title: string;
    businessName: string;
    location: string;
    salary: string;
    workHours: string;
    description: string;
    contact: string;
    industry?: string;
    themes?: string[];  // 테마 태그 배열 (고소득, 당일지급, 숙소제공 등)
    region?: string;    // 지역 (서울, 경기, 부산 등)
    district?: string;  // 세부 지역 (강남구, 해운대구 등)
    endDate?: string;
    highlightConfig?: {
        color: 'yellow' | 'pink' | 'green' | 'cyan';
        text: string; // The specific substring to highlight
    };
    jumpUpConfig?: {
        enabled: boolean;
        intervalDays: number; // e.g. 1, 3, 7
        totalCount: number; // Total paid jumps
        remainingCount: number;
    };
    productType: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'vip' | 'premium' | 'special' | 'regular' | 'highlight' | 'jumpup';
    status: 'pending' | 'active' | 'expired' | 'rejected' | 'closed';
    rejectionReason?: string;  // 반려 사유 (rejected 상태일 때)
    views: number;
    inquiries: number;
    createdAt: string;
    expiresAt: string;
}

const ADS_KEY = 'lunaalba_user_ads';

// Get all ads
export const getAllAds = (): UserAd[] => {
    const data = localStorage.getItem(ADS_KEY);
    return data ? JSON.parse(data) : [];
};

// Save ads
const saveAds = (ads: UserAd[]) => {
    localStorage.setItem(ADS_KEY, JSON.stringify(ads));
};

// Create new ad
export const createAd = (adData: Omit<UserAd, 'id' | 'userId' | 'status' | 'views' | 'inquiries' | 'createdAt' | 'expiresAt'>): { success: boolean; message: string; ad?: UserAd } => {
    const user = getCurrentUser();

    if (!user) {
        return { success: false, message: '로그인이 필요합니다.' };
    }

    if (user.type !== 'advertiser') {
        return { success: false, message: '광고주 계정만 광고를 등록할 수 있습니다.' };
    }

    const ads = getAllAds();

    const newAd: UserAd = {
        id: Date.now().toString(),
        userId: user.id,
        ...adData,
        status: 'pending', // Requires admin approval
        views: 0,
        inquiries: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from approval
    };

    ads.push(newAd);
    saveAds(ads);

    return { success: true, message: '광고가 등록되었습니다. 관리자 승인 후 노출됩니다.', ad: newAd };
};

// Get ads by current user
export const getMyAds = (): UserAd[] => {
    const user = getCurrentUser();
    if (!user) return [];

    const ads = getAllAds();
    return ads.filter(ad => ad.userId === user.id);
};

// Get ad by ID
export const getAdById = (id: string): UserAd | undefined => {
    const ads = getAllAds();
    return ads.find(ad => ad.id === id);
};

// Update ad
export const updateAd = (id: string, updates: Partial<UserAd>): { success: boolean; message: string } => {
    const ads = getAllAds();
    const index = ads.findIndex(ad => ad.id === id);

    if (index === -1) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    ads[index] = { ...ads[index], ...updates };
    saveAds(ads);

    return { success: true, message: '광고가 수정되었습니다.' };
};

// Delete ad
export const deleteAd = (id: string): { success: boolean; message: string } => {
    const ads = getAllAds();
    const filtered = ads.filter(ad => ad.id !== id);

    if (filtered.length === ads.length) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    saveAds(filtered);
    return { success: true, message: '광고가 삭제되었습니다.' };
};

// Get stats for dashboard
export const getAdStats = () => {
    const myAds = getMyAds();

    return {
        total: myAds.length,
        active: myAds.filter(ad => ad.status === 'active').length,
        pending: myAds.filter(ad => ad.status === 'pending').length,
        expired: myAds.filter(ad => ad.status === 'expired').length,
        totalViews: myAds.reduce((sum, ad) => sum + ad.views, 0),
        totalInquiries: myAds.reduce((sum, ad) => sum + ad.inquiries, 0),
    };
};

// Extend ad - keeps all existing data, only extends the expiration date
export const extendAd = (id: string, extensionDays: number = 30): { success: boolean; message: string; newExpiresAt?: string } => {
    const ads = getAllAds();
    const index = ads.findIndex(ad => ad.id === id);

    if (index === -1) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    const ad = ads[index];

    // Calculate new expiration date
    const currentExpires = new Date(ad.expiresAt);
    const now = new Date();

    // If already expired, extend from now; otherwise extend from current expiration
    const baseDate = currentExpires > now ? currentExpires : now;
    const newExpiresAt = new Date(baseDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);

    // Keep all existing data, only update expiration and status
    ads[index] = {
        ...ad,
        status: 'active',
        expiresAt: newExpiresAt.toISOString(),
        endDate: newExpiresAt.toISOString().split('T')[0],
    };

    saveAds(ads);

    return {
        success: true,
        message: `광고가 ${extensionDays}일 연장되었습니다. 새 만료일: ${newExpiresAt.toLocaleDateString('ko-KR')}`,
        newExpiresAt: newExpiresAt.toISOString()
    };
};

// Close ad - keeps all data but changes status to closed
export const closeAd = (id: string): { success: boolean; message: string } => {
    const ads = getAllAds();
    const index = ads.findIndex(ad => ad.id === id);

    if (index === -1) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    ads[index] = {
        ...ads[index],
        status: 'closed',
    };

    saveAds(ads);

    return { success: true, message: '광고가 마감되었습니다.' };
};

// Get all pending ads (for admin)
export const getPendingAds = (): UserAd[] => {
    const ads = getAllAds();
    return ads.filter(ad => ad.status === 'pending');
};

// Approve ad (admin only)
export const approveAd = (id: string): { success: boolean; message: string } => {
    const ads = getAllAds();
    const index = ads.findIndex(ad => ad.id === id);

    if (index === -1) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    // Set expiration from today (approval date)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    ads[index] = {
        ...ads[index],
        status: 'active',
        expiresAt: expiresAt.toISOString(),
    };

    saveAds(ads);
    return { success: true, message: '광고가 승인되었습니다.' };
};

// Reject ad (admin only)
export const rejectAd = (id: string, reason?: string): { success: boolean; message: string } => {
    const ads = getAllAds();
    const index = ads.findIndex(ad => ad.id === id);

    if (index === -1) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    ads[index] = {
        ...ads[index],
        status: 'rejected',
        rejectionReason: reason || '광고 정책 위반',
    };

    saveAds(ads);
    return { success: true, message: '광고가 반려되었습니다.' };
};
