// Simple LocalStorage-based Auth Utility
// With password hashing for security
// Now with optional API backend integration

import { hashSync, hashAsync } from './hash';

// Re-export API functions for use when backend is available
export {
    loginWithApi,
    signupWithApi,
    logoutWithApi,
    initializeAuth,
    loadPersistedToken,
    checkApiConnection
} from './authService';

// Use API mode when VITE_API_URL is set
const API_URL = import.meta.env.VITE_API_URL || '';
export const USE_API_AUTH = API_URL.length > 0;

export interface User {
    id: string;
    email: string;
    name: string;
    nickname?: string;
    phone: string;
    phoneVerified?: boolean;  // 핸드폰 실명인증 완료 여부
    gender?: 'male' | 'female';  // 성별 (커뮤니티 접근 제한용)
    type: 'worker' | 'advertiser';
    role?: 'user' | 'admin'; // Admin role for CRM access
    businessNumber?: string;
    businessName?: string;
    createdAt: string;
    // Job seeker profile fields
    age?: string;
    location?: string;
    desiredJob?: string[];
    experience?: string;
    availableTime?: string[];
    introduction?: string;
}

const USERS_KEY = 'lunaalba_users';
const CURRENT_USER_KEY = 'lunaalba_current_user';
const PASSWORDS_KEY = 'lunaalba_passwords_hashed';

// Use shared hash functions
const hashPassword = hashAsync;
const hashPasswordSync = hashSync;

// Get all users
export const getUsers = (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

// Save users
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get hashed passwords storage
const getPasswordStore = (): Record<string, string> => {
    return JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
};

// Sign up (async for proper hashing)
export const signupAsync = async (
    userData: Omit<User, 'id' | 'createdAt'> & { password: string }
): Promise<{ success: boolean; message: string; user?: User }> => {
    const users = getUsers();

    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: '이미 등록된 이메일입니다.' };
    }

    const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        nickname: userData.nickname,
        phone: userData.phone,
        phoneVerified: userData.phoneVerified,
        gender: userData.gender,
        type: userData.type,
        businessNumber: userData.businessNumber,
        businessName: userData.businessName,
        createdAt: new Date().toISOString(),
    };

    // Hash password before storing
    const hashedPassword = await hashPassword(userData.password);
    const passwords = getPasswordStore();
    passwords[newUser.id] = hashedPassword;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event('authStateChange'));

    return { success: true, message: '회원가입 성공!', user: newUser };
};

// Sync signup for backwards compatibility
export const signup = (
    userData: Omit<User, 'id' | 'createdAt'> & { password: string }
): { success: boolean; message: string; user?: User } => {
    const users = getUsers();

    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: '이미 등록된 이메일입니다.' };
    }

    const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        nickname: userData.nickname,
        phone: userData.phone,
        phoneVerified: userData.phoneVerified,
        gender: userData.gender,
        type: userData.type,
        businessNumber: userData.businessNumber,
        businessName: userData.businessName,
        createdAt: new Date().toISOString(),
    };

    // Use sync hash for immediate response
    const hashedPassword = hashPasswordSync(userData.password);
    const passwords = getPasswordStore();
    passwords[newUser.id] = hashedPassword;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));

    // Also migrate from old plain text storage if exists
    const oldPasswords = JSON.parse(localStorage.getItem('lunaalba_passwords') || '{}');
    if (Object.keys(oldPasswords).length > 0) {
        // Migrate old passwords
        for (const [id, pwd] of Object.entries(oldPasswords)) {
            if (!passwords[id]) {
                passwords[id] = hashPasswordSync(pwd as string);
            }
        }
        localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
        localStorage.removeItem('lunaalba_passwords'); // Remove old plain text storage
    }

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event('authStateChange'));

    return { success: true, message: '회원가입 성공!', user: newUser };
};

// Login (with hash verification)
export const login = (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, message: '등록되지 않은 이메일입니다.' };
    }

    const passwords = getPasswordStore();
    const hashedInput = hashPasswordSync(password);

    // Check against hashed password
    if (passwords[user.id] !== hashedInput) {
        // Fallback: check old plain text storage for migration
        const oldPasswords = JSON.parse(localStorage.getItem('lunaalba_passwords') || '{}');
        if (oldPasswords[user.id] === password) {
            // Migrate to hashed
            passwords[user.id] = hashedInput;
            localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
            delete oldPasswords[user.id];
            localStorage.setItem('lunaalba_passwords', JSON.stringify(oldPasswords));
        } else {
            return { success: false, message: '비밀번호가 일치하지 않습니다.' };
        }
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('authStateChange'));
    return { success: true, message: '로그인 성공!', user };
};

// Logout
export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event('authStateChange'));
};

// Get current user
export const getCurrentUser = (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
    }
};

// Check if logged in
export const isLoggedIn = (): boolean => {
    return getCurrentUser() !== null;
};

// Check if advertiser
export const isAdvertiser = (): boolean => {
    const user = getCurrentUser();
    return user?.type === 'advertiser';
};

// Check if admin
export const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};

// Migrate all existing plain text passwords to hashed
export const migratePasswords = () => {
    const oldPasswords = JSON.parse(localStorage.getItem('lunaalba_passwords') || '{}');
    if (Object.keys(oldPasswords).length === 0) return;

    const hashedPasswords = getPasswordStore();
    for (const [id, pwd] of Object.entries(oldPasswords)) {
        if (!hashedPasswords[id]) {
            hashedPasswords[id] = hashPasswordSync(pwd as string);
        }
    }
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(hashedPasswords));
    localStorage.removeItem('lunaalba_passwords');
    if (import.meta.env.DEV) {
        console.log('[Security] Password migration complete');
    }
};
