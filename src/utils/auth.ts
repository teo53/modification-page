// Simple LocalStorage-based Auth Utility
// For demo purposes - not for production

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    type: 'worker' | 'advertiser';
    createdAt: string;
}

const USERS_KEY = 'queenalba_users';
const CURRENT_USER_KEY = 'queenalba_current_user';

// Get all users
export const getUsers = (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

// Save users
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Sign up
export const signup = (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): { success: boolean; message: string; user?: User } => {
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: '이미 등록된 이메일입니다.' };
    }

    const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        type: userData.type,
        createdAt: new Date().toISOString(),
    };

    // Store password separately (simple hash simulation)
    const passwords = JSON.parse(localStorage.getItem('queenalba_passwords') || '{}');
    passwords[newUser.id] = userData.password;
    localStorage.setItem('queenalba_passwords', JSON.stringify(passwords));

    users.push(newUser);
    saveUsers(users);

    // Auto login
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true, message: '회원가입 성공!', user: newUser };
};

// Login
export const login = (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, message: '등록되지 않은 이메일입니다.' };
    }

    const passwords = JSON.parse(localStorage.getItem('queenalba_passwords') || '{}');
    if (passwords[user.id] !== password) {
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
    return data ? JSON.parse(data) : null;
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
