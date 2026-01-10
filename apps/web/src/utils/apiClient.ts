// API Client with Security Features
// Handles: Request signing, Rate limiting awareness, Token management

interface ApiConfig {
    baseUrl: string;
    timeout: number;
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

// Token storage keys
const REFRESH_TOKEN_KEY = 'lunaalba_refresh_token';

// Token storage (in-memory for access token, localStorage for refresh token on mobile)
let accessToken: string | null = null;
let tokenExpiry: number = 0;

export const setAccessToken = (token: string, expiresIn: number) => {
    accessToken = token;
    tokenExpiry = Date.now() + expiresIn * 1000;
};

// 모바일 앱용 Refresh Token 저장 (쿠키가 작동하지 않으므로 localStorage 사용)
export const setRefreshToken = (token: string) => {
    try {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (e) {
        console.warn('Failed to store refresh token:', e);
    }
};

export const getRefreshToken = (): string | null => {
    try {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const clearAccessToken = () => {
    accessToken = null;
    tokenExpiry = 0;
};

export const clearRefreshToken = () => {
    try {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
        // ignore
    }
};

export const clearAllTokens = () => {
    clearAccessToken();
    clearRefreshToken();
};

export const isTokenExpired = (): boolean => {
    return !accessToken || Date.now() >= tokenExpiry - 30000; // 30초 여유
};

// Rate limit tracking
const rateLimitState: Map<string, { remaining: number; resetTime: number }> = new Map();

const updateRateLimitState = (endpoint: string, headers: Headers) => {
    const remaining = parseInt(headers.get('X-RateLimit-Remaining') || '100');
    const reset = parseInt(headers.get('X-RateLimit-Reset') || '0');
    rateLimitState.set(endpoint, { remaining, resetTime: reset * 1000 });
};

export const isRateLimited = (endpoint: string): boolean => {
    const state = rateLimitState.get(endpoint);
    if (!state) return false;
    if (Date.now() >= state.resetTime) {
        rateLimitState.delete(endpoint);
        return false;
    }
    return state.remaining <= 0;
};

// 모바일 앱 (Capacitor) 환경 감지
const isCapacitorApp = (): boolean => {
    return typeof window !== 'undefined' &&
           (window as any).Capacitor !== undefined;
};

// 프로덕션 환경 감지
const isProductionEnv = (): boolean => {
    if (import.meta.env.PROD) return true;
    if (isCapacitorApp()) return true; // 모바일 앱은 항상 프로덕션 API 사용
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return true;
        }
    }
    return false;
};

// API URL 결정 (모바일 앱은 항상 프로덕션 URL 사용)
const getApiBaseUrl = (): string => {
    // 환경변수가 설정되어 있으면 우선 사용
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 프로덕션 또는 모바일 앱
    if (isProductionEnv()) {
        return 'https://modification-page-production.up.railway.app/api/v1';
    }

    // 개발 환경
    return 'http://localhost:4000/api/v1';
};

// Secure API client
export class SecureApiClient {
    private config: ApiConfig;
    private csrfToken: string | null = null;

    constructor(config: Partial<ApiConfig> = {}) {
        this.config = {
            baseUrl: config.baseUrl || getApiBaseUrl(),
            timeout: config.timeout || 15000  // 모바일 네트워크를 위해 15초로 증가
        };

        // 디버깅용 로그 (개발 환경에서만)
        if (!isProductionEnv()) {
            console.log('[API Client] Initialized with:', {
                baseUrl: this.config.baseUrl,
                isCapacitor: isCapacitorApp(),
                isProd: isProductionEnv()
            });
        }
    }

    private getHeaders(): Headers {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // CSRF 기본 보호
        });

        if (accessToken && !isTokenExpired()) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        if (this.csrfToken) {
            headers.set('X-CSRF-Token', this.csrfToken);
        }

        return headers;
    }

    async request<T>(
        method: string,
        endpoint: string,
        body?: unknown
    ): Promise<ApiResponse<T>> {
        // Check rate limit
        if (isRateLimited(endpoint)) {
            return {
                data: null,
                error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                status: 429
            };
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort(new DOMException('Request timeout', 'TimeoutError'));
            }, this.config.timeout);

            const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                method,
                headers: this.getHeaders(),
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                credentials: 'include' // For cookies (refresh token)
            });

            clearTimeout(timeoutId);

            // Update rate limit state
            updateRateLimitState(endpoint, response.headers);

            // Handle CSRF token refresh
            const newCsrfToken = response.headers.get('X-CSRF-Token');
            if (newCsrfToken) {
                this.csrfToken = newCsrfToken;
            }

            // Handle 401 (token expired) - 단, 로그인/회원가입은 제외
            const noRetryEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
            if (response.status === 401 && !noRetryEndpoints.some(e => endpoint.includes(e))) {
                // Try to refresh token
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry original request
                    return this.request<T>(method, endpoint, body);
                }
                clearAccessToken();
                return { data: null, error: '세션이 만료되었습니다. 다시 로그인해주세요.', status: 401 };
            }

            // Handle 429 (rate limited)
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                return {
                    data: null,
                    error: `요청 제한 초과. ${retryAfter || '60'}초 후에 다시 시도해주세요.`,
                    status: 429
                };
            }

            // Parse response - body는 한 번만 읽을 수 있음
            let data = null;
            let error = null;

            try {
                const jsonBody = await response.json();
                if (response.ok) {
                    data = jsonBody;
                } else {
                    error = jsonBody.message || '오류가 발생했습니다';
                }
            } catch {
                if (!response.ok) {
                    error = '오류가 발생했습니다';
                }
            }

            return { data, error, status: response.status };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            const errorName = err instanceof Error ? err.name : '';

            // Enhanced error logging (only in development)
            if (!isProductionEnv()) {
                console.error('[API Error]', {
                    endpoint,
                    method,
                    error: errorMessage,
                    name: errorName,
                    timestamp: new Date().toISOString()
                });
            }

            // AbortError 또는 TimeoutError 처리
            if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
                return { data: null, error: '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.', status: 0 };
            }

            // TypeError (네트워크 오류) 처리
            if (err instanceof TypeError) {
                return { data: null, error: '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.', status: 0 };
            }

            return { data: null, error: '네트워크 오류가 발생했습니다.', status: 0 };
        }
    }

    private async refreshToken(): Promise<boolean> {
        try {
            // 모바일 앱에서는 localStorage의 refresh token 사용
            const storedRefreshToken = getRefreshToken();

            const response = await fetch(`${this.config.baseUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include', // 웹 브라우저용 쿠키
                headers: {
                    'Content-Type': 'application/json'
                },
                // 모바일 앱용: refresh token을 body로 전송
                body: storedRefreshToken ? JSON.stringify({ refreshToken: storedRefreshToken }) : undefined
            });

            if (response.ok) {
                const result = await response.json();
                // 백엔드 응답: { success: true, data: { accessToken, expiresIn, refreshToken? } }
                const responseData = result.data || result;
                const { accessToken: newToken, expiresIn, refreshToken: newRefreshToken } = responseData;

                setAccessToken(newToken, expiresIn);

                // 새 refresh token이 있으면 저장 (토큰 로테이션)
                if (newRefreshToken) {
                    setRefreshToken(newRefreshToken);
                }

                return true;
            }
            return false;
        } catch (err) {
            console.error('[Token Refresh Error]', err);
            return false;
        }
    }

    // Convenience methods
    get<T>(endpoint: string) {
        return this.request<T>('GET', endpoint);
    }

    post<T>(endpoint: string, body: unknown) {
        return this.request<T>('POST', endpoint, body);
    }

    put<T>(endpoint: string, body: unknown) {
        return this.request<T>('PUT', endpoint, body);
    }

    delete<T>(endpoint: string) {
        return this.request<T>('DELETE', endpoint);
    }

    async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        if (isRateLimited(endpoint)) {
            return {
                data: null,
                error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                status: 429
            };
        }

        try {
            const headers = new Headers({
                'X-Requested-With': 'XMLHttpRequest'
            });

            if (accessToken && !isTokenExpired()) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }

            if (this.csrfToken) {
                headers.set('X-CSRF-Token', this.csrfToken);
            }

            // Note: Content-Type is NOT set here so the browser can set it with the boundary for FormData

            const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
                credentials: 'include'
            });

            // Update rate limit state
            updateRateLimitState(endpoint, response.headers);

            // Handle 401 (token expired)
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    return this.upload<T>(endpoint, formData);
                }
                clearAccessToken();
                return { data: null, error: '세션이 만료되었습니다. 다시 로그인해주세요.', status: 401 };
            }

            const data = response.ok ? await response.json() : null;
            const error = !response.ok
                ? (await response.json().catch(() => ({ message: '업로드 중 오류가 발생했습니다' }))).message
                : null;

            return { data, error, status: response.status };

        } catch {
            return { data: null, error: '네트워크 오류가 발생했습니다.', status: 0 };
        }
    }
}

// Export singleton instance
export const api = new SecureApiClient();
