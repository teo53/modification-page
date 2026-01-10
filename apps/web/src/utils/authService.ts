// Auth Service with Backend API Integration
// Provides dual mode: API-based auth with localStorage fallback

import { api, setAccessToken, clearAccessToken, setRefreshToken, clearAllTokens } from './apiClient';
import type { User } from './auth';

const CURRENT_USER_KEY = 'lunaalba_current_user';
const ACCESS_TOKEN_KEY = 'lunaalba_access_token';
const TOKEN_EXPIRY_KEY = 'lunaalba_token_expiry';

// ============================================
// Token persistence (for page refresh)
// ============================================
export const persistToken = (token: string, expiresIn: number) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
    setAccessToken(token, expiresIn);
};

export const loadPersistedToken = (): boolean => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (token && expiry) {
        const expiryTime = parseInt(expiry);
        if (Date.now() < expiryTime - 30000) { // 30초 여유
            const remainingSeconds = Math.floor((expiryTime - Date.now()) / 1000);
            setAccessToken(token, remainingSeconds);
            return true;
        }
    }
    return false;
};

export const clearPersistedToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    clearAccessToken();
};

// ============================================
// API-based Auth Functions
// ============================================

interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        accessToken: string;
        expiresIn: number;
        refreshToken?: string; // 모바일 앱용
    };
}

// API 로그인
export const loginWithApi = async (
    email: string,
    password: string
): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });

        if (response.data?.success && response.data.data) {
            const { user, accessToken, expiresIn, refreshToken } = response.data.data;

            // Store token for persistence
            persistToken(accessToken, expiresIn);

            // 모바일 앱용 refresh token 저장
            if (refreshToken) {
                setRefreshToken(refreshToken);
            }

            // Store user locally for quick access
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            window.dispatchEvent(new Event('authStateChange'));

            return { success: true, message: '로그인 성공!', user };
        }

        return {
            success: false,
            message: response.error || response.data?.message || '로그인에 실패했습니다.'
        };
    } catch (error) {
        console.error('Login API error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};

// API 회원가입
export const signupWithApi = async (
    userData: Omit<User, 'id' | 'createdAt'> & { password: string }
): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
        const response = await api.post<AuthResponse>('/auth/signup', userData);

        if (response.data?.success && response.data.data) {
            const { user, accessToken, expiresIn, refreshToken } = response.data.data;

            persistToken(accessToken, expiresIn);

            // 모바일 앱용 refresh token 저장
            if (refreshToken) {
                setRefreshToken(refreshToken);
            }

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            window.dispatchEvent(new Event('authStateChange'));

            return { success: true, message: '회원가입 성공!', user };
        }

        return {
            success: false,
            message: response.error || response.data?.message || '회원가입에 실패했습니다.'
        };
    } catch (error) {
        console.error('Signup API error:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
};

// API 로그아웃
export const logoutWithApi = async (): Promise<void> => {
    try {
        await api.post('/auth/logout', {});
    } catch (error) {
        console.error('Logout API error:', error);
    } finally {
        clearPersistedToken();
        clearAllTokens(); // 모든 토큰 삭제 (refresh token 포함)
        localStorage.removeItem(CURRENT_USER_KEY);
        window.dispatchEvent(new Event('authStateChange'));
    }
};

// 현재 사용자 정보 가져오기 (API)
export const getMeFromApi = async (): Promise<User | null> => {
    try {
        // First, try to load persisted token
        if (!loadPersistedToken()) {
            return null;
        }

        const response = await api.get<{ success: boolean; data: User }>('/auth/me');

        if (response.data?.success && response.data.data) {
            const user = response.data.data;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return user;
        }

        return null;
    } catch (error) {
        console.error('GetMe API error:', error);
        return null;
    }
};

// 토큰 갱신
export const refreshAuthToken = async (): Promise<boolean> => {
    try {
        const response = await api.post<{
            success: boolean;
            data?: { accessToken: string; expiresIn: number };
        }>('/auth/refresh', {});

        if (response.data?.success && response.data.data) {
            persistToken(response.data.data.accessToken, response.data.data.expiresIn);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Refresh token error:', error);
        return false;
    }
};

// ============================================
// 초기화: 앱 시작 시 호출
// ============================================
export const initializeAuth = async (): Promise<User | null> => {
    // 1. Try to load persisted token
    if (loadPersistedToken()) {
        // 2. Verify with backend
        const user = await getMeFromApi();
        if (user) {
            return user;
        }

        // 3. If verification failed, try refresh
        const refreshed = await refreshAuthToken();
        if (refreshed) {
            return await getMeFromApi();
        }
    }

    // 4. Clear everything if failed
    clearPersistedToken();
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
};

// ============================================
// 백엔드 연결 상태 확인
// ============================================
const getHealthCheckUrl = (): string => {
    // 환경변수 우선
    if (import.meta.env.VITE_API_URL) {
        return `${import.meta.env.VITE_API_URL}/health`;
    }

    // Capacitor 앱이거나 프로덕션 환경
    const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
    const isProd = import.meta.env.PROD ||
                   (typeof window !== 'undefined' &&
                    window.location.hostname !== 'localhost' &&
                    window.location.hostname !== '127.0.0.1');

    if (isCapacitor || isProd) {
        return 'https://modification-page-production.up.railway.app/api/v1/health';
    }

    return 'http://localhost:4000/api/v1/health';
};

export const checkApiConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(getHealthCheckUrl(), {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch {
        return false;
    }
};

// ============================================
// SMS 인증 Functions (Solapi)
// ============================================

interface SmsResponse {
    success: boolean;
    message: string;
    code?: string; // 데모 모드에서만 반환
    isDemoMode?: boolean; // 데모 모드 여부
}

interface SmsApiResponse {
    success: boolean;
    message: string;
    demoCode?: string;
    isDemoMode?: boolean;
}

/**
 * SMS 인증번호 발송 요청
 */
export const sendSmsVerificationCode = async (phone: string): Promise<SmsResponse> => {
    try {
        const response = await api.post<SmsApiResponse>('/auth/phone/send-code', { phone });
        const data = response.data;
        if (!data) {
            return { success: false, message: 'SMS 발송에 실패했습니다.' };
        }
        return {
            success: data.success,
            message: data.message,
            code: data.demoCode, // 데모 모드에서만 반환
            isDemoMode: data.isDemoMode ?? false,
        };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err.response?.data?.message || 'SMS 발송에 실패했습니다.';
        return { success: false, message };
    }
};

/**
 * SMS 인증번호 검증
 */
export const verifySmsCode = async (phone: string, code: string): Promise<SmsResponse> => {
    try {
        const response = await api.post<SmsResponse>('/auth/phone/verify-code', { phone, code });
        if (!response.data) {
            return { success: false, message: '인증 확인에 실패했습니다.' };
        }
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err.response?.data?.message || '인증번호 확인에 실패했습니다.';
        return { success: false, message };
    }
};
