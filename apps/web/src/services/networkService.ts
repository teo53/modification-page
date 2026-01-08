// =============================================================================
// Network Service - Offline Detection & Caching (Web Only)
// =============================================================================

// Types
interface NetworkStatus {
    connected: boolean;
    connectionType: string;
}

type NetworkHandler = (status: NetworkStatus) => void;

class NetworkService {
    private isOnline = true;
    private connectionType = 'unknown';
    private listeners: NetworkHandler[] = [];
    private initialized = false;

    // Check if running in native environment (for future Capacitor integration)
    isNative(): boolean {
        return false; // Web only for now
    }

    // Get current online status
    getStatus(): NetworkStatus {
        return {
            connected: this.isOnline,
            connectionType: this.connectionType,
        };
    }

    // Initialize network monitoring
    async init(): Promise<void> {
        if (this.initialized) return;

        this.initWeb();
        this.initialized = true;
    }

    // Initialize for web
    private initWeb(): void {
        this.isOnline = navigator.onLine;
        this.connectionType = navigator.onLine ? 'wifi' : 'none';

        window.addEventListener('online', () => {
            this.isOnline = true;
            this.connectionType = 'wifi';
            this.notifyListeners({ connected: true, connectionType: 'wifi' });
            this.showOnlineNotification();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.connectionType = 'none';
            this.notifyListeners({ connected: false, connectionType: 'none' });
            this.showOfflineNotification();
        });
    }

    // Add status change listener
    onStatusChange(handler: NetworkHandler): () => void {
        this.listeners.push(handler);
        return () => {
            this.listeners = this.listeners.filter(l => l !== handler);
        };
    }

    // Notify all listeners
    private notifyListeners(status: NetworkStatus): void {
        this.listeners.forEach(handler => handler(status));
    }

    // Show online notification
    private showOnlineNotification(): void {
        console.log('Network: Back online');
    }

    // Show offline notification
    private showOfflineNotification(): void {
        console.log('Network: Offline');
    }

    // Cache data for offline use
    async cacheData(key: string, data: unknown): Promise<void> {
        try {
            localStorage.setItem(
                `cache_${key}`,
                JSON.stringify({
                    data,
                    timestamp: Date.now(),
                })
            );
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }

    // Get cached data
    async getCachedData<T>(key: string, maxAge?: number): Promise<T | null> {
        try {
            const cached = localStorage.getItem(`cache_${key}`);

            if (!cached) return null;

            const parsed = JSON.parse(cached) as { data: T; timestamp: number };

            // Check if cache is expired
            if (maxAge) {
                const age = Date.now() - parsed.timestamp;
                if (age > maxAge) {
                    return null;
                }
            }

            return parsed.data;
        } catch (error) {
            console.error('Failed to get cached data:', error);
            return null;
        }
    }

    // Clear cached data
    async clearCache(key?: string): Promise<void> {
        try {
            if (key) {
                localStorage.removeItem(`cache_${key}`);
            } else {
                // Clear all cache_ prefixed items
                Object.keys(localStorage)
                    .filter(k => k.startsWith('cache_'))
                    .forEach(k => localStorage.removeItem(k));
            }
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }

    // Fetch with offline fallback
    async fetchWithCache<T>(
        url: string,
        cacheKey: string,
        options?: RequestInit,
        maxAge = 5 * 60 * 1000 // 5 minutes default
    ): Promise<T | null> {
        // If online, try to fetch
        if (this.isOnline) {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    const data = await response.json() as T;
                    // Cache the result
                    await this.cacheData(cacheKey, data);
                    return data;
                }
            } catch (error) {
                console.error('Fetch failed, using cache:', error);
            }
        }

        // Fall back to cache
        return this.getCachedData<T>(cacheKey, maxAge);
    }
}

export const networkService = new NetworkService();
export default networkService;
