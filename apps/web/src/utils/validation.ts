// Input Validation & Sanitization Utilities
// Use these to validate user input before sending to backend

/**
 * Password validation rules
 * 백엔드와 동일한 규칙 유지 (signup.dto.ts 참조)
 */
export const passwordRules = {
    minLength: 12, // 백엔드: 12자 이상
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    allowedSpecialChars: '@$!%*?&' // 백엔드 허용 특수문자
};

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    if (password.length < passwordRules.minLength) {
        errors.push(`최소 ${passwordRules.minLength}자 이상이어야 합니다`);
    }
    if (passwordRules.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('대문자를 포함해야 합니다');
    }
    if (passwordRules.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('소문자를 포함해야 합니다');
    }
    if (passwordRules.requireNumber && !/[0-9]/.test(password)) {
        errors.push('숫자를 포함해야 합니다');
    }
    // 백엔드와 동일한 특수문자만 허용: @$!%*?&
    if (passwordRules.requireSpecial && !/[@$!%*?&]/.test(password)) {
        errors.push('특수문자(@$!%*?&)를 포함해야 합니다');
    }

    // Calculate strength
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

    return {
        isValid: errors.length === 0,
        errors,
        strength
    };
};

/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
};

/**
 * Phone number validation (Korean format)
 */
export const validatePhone = (phone: string): boolean => {
    // Remove hyphens and spaces
    const cleaned = phone.replace(/[-\s]/g, '');
    // Korean mobile: 010-XXXX-XXXX
    return /^01[016789]\d{7,8}$/.test(cleaned);
};

/**
 * Business registration number validation (Korean)
 */
export const validateBusinessNumber = (number: string): boolean => {
    const cleaned = number.replace(/[-\s]/g, '');
    if (!/^\d{10}$/.test(cleaned)) return false;

    // Checksum validation
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned[i]) * weights[i];
    }
    sum += Math.floor((parseInt(cleaned[8]) * 5) / 10);

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(cleaned[9]);
};

/**
 * XSS Prevention - Escape HTML entities
 */
export const escapeHtml = (str: string): string => {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
};

/**
 * Basic HTML sanitization (removes script tags and event handlers)
 */
export const sanitizeHtml = (html: string): string => {
    // Remove script tags
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove event handlers
    clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    // Remove javascript: URLs
    clean = clean.replace(/javascript:/gi, '');
    // Remove data: URLs in src/href
    clean = clean.replace(/(src|href)\s*=\s*["']data:[^"']*["']/gi, '');
    return clean;
};

/**
 * SQL Injection pattern detection (client-side warning)
 */
export const detectSqlInjection = (input: string): boolean => {
    const patterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
        /('|"|;|--|\*|\/\*|\*\/)/,
        /(\bOR\b.*=.*\bOR\b)/i,
        /(\bAND\b.*=.*\bAND\b)/i
    ];
    return patterns.some(pattern => pattern.test(input));
};

/**
 * Title/Name validation (prevents special characters)
 */
export const validateSafeText = (text: string, maxLength: number = 100): { valid: boolean; error?: string } => {
    if (!text || text.trim().length === 0) {
        return { valid: false, error: '필수 입력 항목입니다' };
    }
    if (text.length > maxLength) {
        return { valid: false, error: `최대 ${maxLength}자까지 입력 가능합니다` };
    }
    // Allow Korean, English, numbers, spaces, and basic punctuation
    if (!/^[가-힣a-zA-Z0-9\s.,!?()-]+$/.test(text)) {
        return { valid: false, error: '허용되지 않는 특수문자가 포함되어 있습니다' };
    }
    if (detectSqlInjection(text)) {
        return { valid: false, error: '유효하지 않은 입력입니다' };
    }
    return { valid: true };
};

/**
 * File upload validation
 */
export const validateFile = (
    file: File,
    options: {
        maxSize?: number;  // bytes
        allowedTypes?: string[];
    } = {}
): { valid: boolean; error?: string } => {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

    if (file.size > maxSize) {
        return { valid: false, error: `파일 크기는 ${Math.round(maxSize / 1024 / 1024)}MB 이하여야 합니다` };
    }
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: `허용된 파일 형식: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` };
    }
    // Check for suspicious file names
    if (/\.(exe|js|php|sh|bat|cmd)$/i.test(file.name)) {
        return { valid: false, error: '허용되지 않는 파일 형식입니다' };
    }
    return { valid: true };
};

/**
 * Data masking utilities
 */
export const maskPhone = (phone: string): string => {
    const cleaned = phone.replace(/[-\s]/g, '');
    if (cleaned.length >= 10) {
        return `${cleaned.slice(0, 3)}-****-${cleaned.slice(-4)}`;
    }
    return phone;
};

export const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length > 2
        ? `${local.slice(0, 2)}${'*'.repeat(Math.min(3, local.length - 2))}`
        : local;
    return `${maskedLocal}@${domain}`;
};

export const maskName = (name: string): string => {
    if (name.length <= 1) return name;
    if (name.length === 2) return `${name[0]}*`;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
};
