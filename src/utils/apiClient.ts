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

// Token storage (in-memory only for security)
let accessToken: string | null = null;
let tokenExpiry: number = 0;

export const setAccessToken = (token: string, expiresIn: number) => {
    accessToken = token;
    tokenExpiry = Date.now() + expiresIn * 1000;
};

export const clearAccessToken = () => {
    accessToken = null;
    tokenExpiry = 0;
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

// Secure API client
export class SecureApiClient {
    private config: ApiConfig;
    private csrfToken: string | null = null;

    constructor(config: Partial<ApiConfig> = {}) {
        this.config = {
            // 우선순위: config.baseUrl > VITE_API_URL > 로컬 (4000)
            baseUrl: config.baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
            timeout: config.timeout || 10000  // 10초로 단축
        };
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
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

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

            // Parse response
            const data = response.ok ? await response.json() : null;
            const error = !response.ok
                ? (await response.json().catch(() => ({ message: '오류가 발생했습니다' }))).message
                : null;

            return { data, error, status: response.status };

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return { data: null, error: '요청 시간이 초과되었습니다.', status: 0 };
            }
            return { data: null, error: '네트워크 오류가 발생했습니다.', status: 0 };
        }
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const response = await fetch(`${this.config.baseUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                // 백엔드 응답: { success: true, data: { accessToken, expiresIn } }
                const { accessToken: newToken, expiresIn } = result.data || result;
                setAccessToken(newToken, expiresIn);
                return true;
            }
            return false;
        } catch {
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

        } catch (err) {
            return { data: null, error: '네트워크 오류가 발생했습니다.', status: 0 };
        }
    }
}

// Export singleton instance
export const api = new SecureApiClient();
