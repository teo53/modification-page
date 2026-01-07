// Auth Service with Backend API Integration
// Provides dual mode: API-based auth with localStorage fallback

import { api, setAccessToken, clearAccessToken } from './apiClient';
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
            const { user, accessToken, expiresIn } = response.data.data;

            // Store token for persistence
            persistToken(accessToken, expiresIn);

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
            const { user, accessToken, expiresIn } = response.data.data;

            persistToken(accessToken, expiresIn);
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
export const checkApiConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(
            (import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1') + '/health',
            { method: 'GET', signal: AbortSignal.timeout(5000) }
        );
        return response.ok;
    } catch {
        return false;
    }
};
