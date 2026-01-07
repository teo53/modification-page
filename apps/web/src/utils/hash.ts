// Shared hash utilities for password and data hashing

/**
 * Synchronous hash function using djb2 algorithm with salt
 * Used for password hashing on the client side
 */
export const hashSync = (input: string, salt: string = 'lunaalba_salt_v1'): string => {
    let hash = 0;
    const str = input + salt;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'h_' + Math.abs(hash).toString(16);
};

/**
 * Async hash function using Web Crypto API (SHA-256)
 * More secure, use when async is acceptable
 */
export const hashAsync = async (input: string, salt: string = 'lunaalba_salt_v1'): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Simple hash for non-secure purposes (e.g., generating IDs)
 */
export const simpleHash = (input: string): string => {
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
    }
    return Math.abs(hash).toString(36);
};

/**
 * Generate a unique ID
 */
export const generateId = (prefix: string = ''): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};
