// Simple LocalStorage-based Auth Utility
// For demo purposes - not for production

// Simple hash function using SubtleCrypto (browser native)
const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'lunaalba_salt_2024'); // Add salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export interface User {
    id: string;
    email: string;
    name: string;
    nickname?: string;
    phone: string;
    type: 'worker' | 'advertiser';
    role?: 'user' | 'admin'; // Admin role for CRM access
    businessNumber?: string;
    businessName?: string;
    createdAt: string;
    // Job seeker profile fields
    age?: string;
    gender?: string;
    location?: string;
    desiredJob?: string[];
    experience?: string;
    availableTime?: string[];
    introduction?: string;
}

const USERS_KEY = 'lunaalba_users';
const CURRENT_USER_KEY = 'lunaalba_current_user';

// Get all users
export const getUsers = (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

// Save users
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Sign up (async for password hashing)
export const signup = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<{ success: boolean; message: string; user?: User }> => {
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: '이미 등록된 이메일입니다.' };
    }

    const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        nickname: userData.nickname,
        phone: userData.phone,
        type: userData.type,
        businessNumber: userData.businessNumber,
        businessName: userData.businessName,
        createdAt: new Date().toISOString(),
    };

    // Store hashed password separately
    const hashedPassword = await hashPassword(userData.password);
    const passwords = JSON.parse(localStorage.getItem('lunaalba_passwords') || '{}');
    passwords[newUser.id] = hashedPassword;
    localStorage.setItem('lunaalba_passwords', JSON.stringify(passwords));

    users.push(newUser);
    saveUsers(users);

    // Auto login
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true, message: '회원가입 성공!', user: newUser };
};

// Login (async for password hashing)
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, message: '등록되지 않은 이메일입니다.' };
    }

    const passwords = JSON.parse(localStorage.getItem('lunaalba_passwords') || '{}');
    const hashedPassword = await hashPassword(password);
    if (passwords[user.id] !== hashedPassword) {
        return { success: false, message: '비밀번호가 일치하지 않습니다.' };
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, message: '로그인 성공!', user };
};

// Logout
export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
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
