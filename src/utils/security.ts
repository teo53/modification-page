// Security utilities for anti-debugging and protection

// Admin emails list - users with these emails can access developer tools
const ADMIN_EMAILS = ['admin@lunaalba.com', 'admin@example.com', 'admin@dalbitalba.com'];

// Check if current user is admin
export const isCurrentUserAdmin = (): boolean => {
    try {
        const userStr = localStorage.getItem('lunaalba_current_user');
        if (!userStr) return false;
        const user = JSON.parse(userStr);
        return ADMIN_EMAILS.includes(user.email);
    } catch {
        return false;
    }
};

// Disable right-click context menu
export const disableRightClick = () => {
    document.addEventListener('contextmenu', (e) => {
        if (isCurrentUserAdmin()) return; // Allow for admins
        e.preventDefault();
        return false;
    });
};

// Disable keyboard shortcuts for developer tools
export const disableDevToolsShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // Allow all shortcuts for admins
        if (isCurrentUserAdmin()) return;

        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
    });
};

// Detect DevTools open (basic detection)
let devToolsOpen = false;
export const detectDevTools = (callback?: () => void) => {
    const threshold = 160;

    const check = () => {
        // Skip detection for admins
        if (isCurrentUserAdmin()) return;

        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                console.clear();
                console.log('%c⚠️ 경고: 개발자 도구가 감지되었습니다.', 'color: red; font-size: 20px; font-weight: bold;');
                if (callback) callback();
            }
        } else {
            devToolsOpen = false;
        }
    };

    setInterval(check, 1000);
    check();
};

// Disable text selection for protected content
export const disableTextSelection = () => {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
};

// Clear console periodically
export const clearConsolePeriodically = () => {
    setInterval(() => {
        console.clear();
    }, 2000);
};

// Anti-debugging: debugger trap (DISABLED - security risk)
// WARNING: This function was disabled because:
// 1. document.body.innerHTML manipulation creates XSS vulnerabilities
// 2. Breaks React application state completely
// 3. Ineffective as security measure (easily bypassed)
export const enableDebuggerTrap = () => {
    // Intentionally disabled for security reasons
    if (import.meta.env.DEV) {
        console.warn('[Security] enableDebuggerTrap is disabled - do not use in production');
    }
};

// Initialize all security measures (configurable)
export const initializeSecurity = (options: {
    disableRightClick?: boolean;
    disableDevToolsShortcuts?: boolean;
    detectDevTools?: boolean;
    disableTextSelection?: boolean;
    clearConsole?: boolean;
    debuggerTrap?: boolean;
} = {}) => {
    const settings = {
        disableRightClick: true,
        disableDevToolsShortcuts: true,
        detectDevTools: true,
        disableTextSelection: false, // Keep text selectable by default
        clearConsole: false, // Disabled by default for development
        debuggerTrap: false, // Disabled by default, too aggressive
        ...options
    };

    if (settings.disableRightClick) disableRightClick();
    if (settings.disableDevToolsShortcuts) disableDevToolsShortcuts();
    if (settings.detectDevTools) detectDevTools();
    if (settings.disableTextSelection) disableTextSelection();
    if (settings.clearConsole) clearConsolePeriodically();
    if (settings.debuggerTrap) enableDebuggerTrap();

    // Show different message for admins
    if (isCurrentUserAdmin()) {
        console.log('%c🔓 관리자 모드: 개발자 도구 접근이 허용됩니다.', 'color: blue; font-size: 14px; font-weight: bold;');
    } else {
        console.log('%c🛡️ Security measures initialized', 'color: green; font-size: 12px;');
    }
};

// Rate limiting for API requests (client-side)
const requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

export const isRateLimited = (endpoint: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const data = requestCounts.get(endpoint);

    if (!data || now > data.resetTime) {
        requestCounts.set(endpoint, { count: 1, resetTime: now + windowMs });
        return false;
    }

    if (data.count >= maxRequests) {
        return true;
    }

    data.count++;
    return false;
};

// Spam detection for form submissions
const submissionHistory: Map<string, number[]> = new Map();

export const isSpamSubmission = (formId: string, minIntervalMs: number = 3000, maxSubmissions: number = 5): boolean => {
    const now = Date.now();
    let history = submissionHistory.get(formId) || [];

    // Remove old entries (older than 1 minute)
    history = history.filter(time => now - time < 60000);

    // Check if too many submissions
    if (history.length >= maxSubmissions) {
        return true;
    }

    // Check if too fast
    if (history.length > 0 && now - history[history.length - 1] < minIntervalMs) {
        return true;
    }

    history.push(now);
    submissionHistory.set(formId, history);
    return false;
};

// Bot detection using simple honeypot
export const createHoneypot = (): { fieldName: string; isBot: (value: string) => boolean } => {
    const fieldName = 'hp_' + Math.random().toString(36).substring(2, 8);
    return {
        fieldName,
        isBot: (value: string) => value !== '' // Bots fill hidden fields
    };
};
