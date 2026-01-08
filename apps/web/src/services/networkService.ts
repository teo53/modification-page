// =============================================================================
// Network Service (Capacitor + Web) - Offline Detection & Caching
// =============================================================================

import { Capacitor } from '@capacitor/core';

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

    // Check if running in Capacitor native environment
    isNative(): boolean {
        return Capacitor.isNativePlatform();
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

        if (this.isNative()) {
            await this.initNative();
        } else {
            this.initWeb();
        }

        this.initialized = true;
    }

    // Initialize for native platforms
    private async initNative(): Promise<void> {
        try {
            const { Network } = await import('@capacitor/network');

            // Get initial status
            const status = await Network.getStatus();
            this.isOnline = status.connected;
            this.connectionType = status.connectionType;

            // Listen for changes
            Network.addListener('networkStatusChange', (status) => {
                const wasOnline = this.isOnline;
                this.isOnline = status.connected;
                this.connectionType = status.connectionType;

                console.log('Network status changed:', status);

                // Notify listeners
                this.notifyListeners({
                    connected: this.isOnline,
                    connectionType: this.connectionType,
                });

                // Show notification on status change
                if (!wasOnline && this.isOnline) {
                    this.showOnlineNotification();
                } else if (wasOnline && !this.isOnline) {
                    this.showOfflineNotification();
                }
            });
        } catch (error) {
            console.error('Failed to init native network:', error);
            this.initWeb(); // Fallback to web
        }
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
        // Could trigger a toast/notification here
    }

    // Show offline notification
    private showOfflineNotification(): void {
        console.log('Network: Offline');
        // Could trigger a toast/notification here
    }

    // Cache data for offline use
    async cacheData(key: string, data: unknown): Promise<void> {
        try {
            if (this.isNative()) {
                const { Preferences } = await import('@capacitor/preferences');
                await Preferences.set({
                    key: `cache_${key}`,
                    value: JSON.stringify({
                        data,
                        timestamp: Date.now(),
                    }),
                });
            } else {
                localStorage.setItem(
                    `cache_${key}`,
                    JSON.stringify({
                        data,
                        timestamp: Date.now(),
                    })
                );
            }
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }

    // Get cached data
    async getCachedData<T>(key: string, maxAge?: number): Promise<T | null> {
        try {
            let cached: string | null = null;

            if (this.isNative()) {
                const { Preferences } = await import('@capacitor/preferences');
                const result = await Preferences.get({ key: `cache_${key}` });
                cached = result.value;
            } else {
                cached = localStorage.getItem(`cache_${key}`);
            }

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
            if (this.isNative()) {
                const { Preferences } = await import('@capacitor/preferences');
                if (key) {
                    await Preferences.remove({ key: `cache_${key}` });
                } else {
                    // Clear all cache_ prefixed items
                    const keys = await Preferences.keys();
                    for (const k of keys.keys) {
                        if (k.startsWith('cache_')) {
                            await Preferences.remove({ key: k });
                        }
                    }
                }
            } else {
                if (key) {
                    localStorage.removeItem(`cache_${key}`);
                } else {
                    // Clear all cache_ prefixed items
                    Object.keys(localStorage)
                        .filter(k => k.startsWith('cache_'))
                        .forEach(k => localStorage.removeItem(k));
                }
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
