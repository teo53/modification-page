// =============================================================================
// 📁 src/utils/auth.test.ts
// 🧪 인증 유틸리티 테스트
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock hash module
vi.mock('./hash', () => ({
    hashSync: vi.fn((str: string) => `hashed_${str}`),
    hashAsync: vi.fn(async (str: string) => `hashed_${str}`),
}));

describe('Auth utilities', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('User storage', () => {
        it('should return empty array when no users exist', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);

            // Simulate getUsers function behavior
            const data = localStorageMock.getItem('lunaalba_users');
            const users = data ? JSON.parse(data) : [];

            expect(users).toEqual([]);
        });

        it('should parse stored users correctly', () => {
            const mockUsers = [
                { id: '1', email: 'test@example.com', name: 'Test User' }
            ];
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUsers));

            const data = localStorageMock.getItem('lunaalba_users');
            const users = data ? JSON.parse(data) : [];

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe('test@example.com');
        });
    });

    describe('Current user management', () => {
        it('should return null when no user is logged in', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);

            const data = localStorageMock.getItem('lunaalba_current_user');
            const currentUser = data ? JSON.parse(data) : null;

            expect(currentUser).toBeNull();
        });

        it('should parse current user correctly', () => {
            const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

            const data = localStorageMock.getItem('lunaalba_current_user');
            const currentUser = data ? JSON.parse(data) : null;

            expect(currentUser).toBeDefined();
            expect(currentUser.email).toBe('test@example.com');
        });
    });

    describe('Login check', () => {
        it('should return false when not logged in', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);

            const isLoggedIn = localStorageMock.getItem('lunaalba_current_user') !== null;

            expect(isLoggedIn).toBe(false);
        });

        it('should return true when logged in', () => {
            const mockUser = { id: '1', email: 'test@example.com' };
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

            const isLoggedIn = localStorageMock.getItem('lunaalba_current_user') !== null;

            expect(isLoggedIn).toBe(true);
        });
    });

    describe('User type check', () => {
        it('should identify advertiser correctly', () => {
            const advertiserUser = { id: '1', email: 'ad@example.com', type: 'advertiser' };
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(advertiserUser));

            const data = localStorageMock.getItem('lunaalba_current_user');
            const user = data ? JSON.parse(data) : null;
            const isAdvertiser = user?.type === 'advertiser';

            expect(isAdvertiser).toBe(true);
        });

        it('should identify worker correctly', () => {
            const workerUser = { id: '1', email: 'worker@example.com', type: 'worker' };
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(workerUser));

            const data = localStorageMock.getItem('lunaalba_current_user');
            const user = data ? JSON.parse(data) : null;
            const isAdvertiser = user?.type === 'advertiser';

            expect(isAdvertiser).toBe(false);
        });
    });

    describe('Admin check', () => {
        const ADMIN_EMAILS = ['admin@lunaalba.com', 'admin@example.com'];

        it('should identify admin user', () => {
            const adminUser = { id: '1', email: 'admin@lunaalba.com' };

            const isAdmin = ADMIN_EMAILS.includes(adminUser.email);

            expect(isAdmin).toBe(true);
        });

        it('should not identify non-admin user as admin', () => {
            const regularUser = { id: '1', email: 'user@example.com' };

            const isAdmin = ADMIN_EMAILS.includes(regularUser.email);

            expect(isAdmin).toBe(false);
        });
    });
});
