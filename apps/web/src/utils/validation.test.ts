// =============================================================================
// 📁 src/utils/validation.test.ts
// 🧪 입력 유효성 검사 테스트
// =============================================================================

import { describe, it, expect, vi } from 'vitest';

// Mock the hash module to avoid actual hashing during tests
vi.mock('./hash', () => ({
    hashSync: vi.fn((str: string) => `hashed_${str}`),
    hashAsync: vi.fn(async (str: string) => `hashed_${str}`),
}));

describe('Validation utilities', () => {
    describe('Email validation', () => {
        const isValidEmail = (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        it('should accept valid email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
            expect(isValidEmail('user+tag@gmail.com')).toBe(true);
        });

        it('should reject invalid email addresses', () => {
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('no@domain')).toBe(false);
            expect(isValidEmail('@nodomain.com')).toBe(false);
        });
    });

    describe('Password validation', () => {
        const isStrongPassword = (password: string): { valid: boolean; message: string } => {
            if (password.length < 8) {
                return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
            }
            if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) {
                return { valid: false, message: '비밀번호에 영문자가 포함되어야 합니다.' };
            }
            if (!/[0-9]/.test(password)) {
                return { valid: false, message: '비밀번호에 숫자가 포함되어야 합니다.' };
            }
            return { valid: true, message: '' };
        };

        it('should accept strong passwords', () => {
            expect(isStrongPassword('Password123').valid).toBe(true);
            expect(isStrongPassword('MySecure99').valid).toBe(true);
            expect(isStrongPassword('abcdefgh1').valid).toBe(true);
        });

        it('should reject short passwords', () => {
            const result = isStrongPassword('short1');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('8자');
        });

        it('should reject passwords without numbers', () => {
            const result = isStrongPassword('NoNumbersHere');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('숫자');
        });
    });

    describe('Phone number validation', () => {
        const isValidPhone = (phone: string): boolean => {
            const cleaned = phone.replace(/[-\s]/g, '');
            return /^01[0-9]{8,9}$/.test(cleaned);
        };

        it('should accept valid Korean phone numbers', () => {
            expect(isValidPhone('01012345678')).toBe(true);
            expect(isValidPhone('010-1234-5678')).toBe(true);
            expect(isValidPhone('010 1234 5678')).toBe(true);
            expect(isValidPhone('01112345678')).toBe(true);
        });

        it('should reject invalid phone numbers', () => {
            expect(isValidPhone('')).toBe(false);
            expect(isValidPhone('123')).toBe(false);
            expect(isValidPhone('02-123-4567')).toBe(false);
            expect(isValidPhone('010123')).toBe(false);
        });
    });

    describe('Business number validation', () => {
        const isValidBusinessNumber = (num: string): boolean => {
            const cleaned = num.replace(/-/g, '');
            return /^[0-9]{10}$/.test(cleaned);
        };

        it('should accept valid business numbers', () => {
            expect(isValidBusinessNumber('1234567890')).toBe(true);
            expect(isValidBusinessNumber('123-45-67890')).toBe(true);
        });

        it('should reject invalid business numbers', () => {
            expect(isValidBusinessNumber('')).toBe(false);
            expect(isValidBusinessNumber('123')).toBe(false);
            expect(isValidBusinessNumber('12345678901')).toBe(false);
        });
    });
});
