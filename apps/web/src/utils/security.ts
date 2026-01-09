// Security utilities for anti-debugging and protection

// 개발자 모드 활성화 상태 (비밀 단축키로 활성화)
let devModeEnabled = false;
let devModeKeySequence: number[] = [];
const DEV_MODE_TIMEOUT = 2000; // 2초 내에 3번 입력

// 비밀 단축키: Ctrl+Alt+Shift+D 를 3번 연속 입력
export const enableDevModeShortcut = () => {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Alt+Shift+D 감지
        if (e.ctrlKey && e.altKey && e.shiftKey && e.key === 'D') {
            const now = Date.now();

            // 오래된 입력 제거
            devModeKeySequence = devModeKeySequence.filter(t => now - t < DEV_MODE_TIMEOUT);
            devModeKeySequence.push(now);

            // 3번 연속 입력 시 개발자 모드 토글
            if (devModeKeySequence.length >= 3) {
                devModeEnabled = !devModeEnabled;
                devModeKeySequence = [];

                if (devModeEnabled) {
                    console.log('%c🔓 개발자 모드 활성화됨 (F12 사용 가능)', 'color: #00ff00; font-size: 16px; font-weight: bold; background: #000; padding: 8px;');
                    alert('🔓 개발자 모드 활성화\n\nF12 및 개발자 도구를 사용할 수 있습니다.\n페이지 새로고침 시 비활성화됩니다.');
                } else {
                    console.log('%c🔒 개발자 모드 비활성화됨', 'color: #ff0000; font-size: 16px; font-weight: bold;');
                }
            }

            e.preventDefault();
        }
    });
};

// 개발자 모드 상태 확인
export const isDevModeEnabled = (): boolean => devModeEnabled;

// Check if current user is admin (role 기반 체크)
export const isCurrentUserAdmin = (): boolean => {
    try {
        const userStr = localStorage.getItem('lunaalba_current_user');
        if (!userStr) return false;
        const user = JSON.parse(userStr);
        // role 필드가 'admin'인지 확인 (이메일 기반 체크 제거)
        return user.role === 'admin';
    } catch {
        return false;
    }
};

// Disable right-click context menu
export const disableRightClick = () => {
    document.addEventListener('contextmenu', (e) => {
        if (isCurrentUserAdmin() || isDevModeEnabled()) return; // Allow for admins or dev mode
        e.preventDefault();
        return false;
    });
};

// Disable keyboard shortcuts for developer tools
export const disableDevToolsShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // Allow all shortcuts for admins or dev mode
        if (isCurrentUserAdmin() || isDevModeEnabled()) return;

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
        // Skip detection for admins or dev mode
        if (isCurrentUserAdmin() || isDevModeEnabled()) return;

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

// Anti-debugging: debugger trap
export const enableDebuggerTrap = () => {
    // This will pause if DevTools is open
    setInterval(() => {
        const start = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            // DevTools is open
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-size:24px;">접근이 제한되었습니다.</div>';
        }
    }, 1000);
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

    // 항상 비밀 단축키 활성화 (Ctrl+Alt+Shift+D x3)
    enableDevModeShortcut();

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
        console.log('%c💡 힌트: Ctrl+Alt+Shift+D x3', 'color: #666; font-size: 10px;');
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
