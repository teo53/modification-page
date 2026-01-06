// Safe JSON parsing utilities to prevent runtime errors from corrupted localStorage data

/**
 * Safely parse JSON with fallback value
 * @param jsonString - The JSON string to parse
 * @param fallback - Default value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
    if (!jsonString) return fallback;

    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('[safeJsonParse] Failed to parse JSON:', error);
        }
        return fallback;
    }
}

/**
 * Safely get and parse JSON from localStorage
 * @param key - localStorage key
 * @param fallback - Default value if key doesn't exist or parsing fails
 * @param clearOnError - Whether to clear the corrupted data from localStorage
 * @returns Parsed value or fallback
 */
export function safeLocalStorageGet<T>(key: string, fallback: T, clearOnError: boolean = true): T {
    try {
        const data = localStorage.getItem(key);
        if (!data) return fallback;

        return JSON.parse(data) as T;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn(`[safeLocalStorageGet] Failed to parse localStorage key "${key}":`, error);
        }

        if (clearOnError) {
            try {
                localStorage.removeItem(key);
            } catch {
                // Ignore removal errors
            }
        }

        return fallback;
    }
}

/**
 * Safely set JSON to localStorage
 * @param key - localStorage key
 * @param value - Value to stringify and store
 * @returns true if successful, false otherwise
 */
export function safeLocalStorageSet(key: string, value: unknown): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn(`[safeLocalStorageSet] Failed to set localStorage key "${key}":`, error);
        }
        return false;
    }
}
