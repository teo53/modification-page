// =============================================================================
// Push Notification Service (Capacitor + Web)
// =============================================================================

import { Capacitor } from '@capacitor/core';

// Types
interface PushNotificationToken {
    value: string;
}

interface PushNotification {
    title?: string;
    body?: string;
    data: Record<string, unknown>;
}

type NotificationHandler = (notification: PushNotification) => void;

class PushNotificationService {
    private token: string | null = null;
    private listeners: NotificationHandler[] = [];
    private initialized = false;

    // Check if running in Capacitor native environment
    isNative(): boolean {
        return Capacitor.isNativePlatform();
    }

    // Initialize push notifications
    async init(): Promise<boolean> {
        if (this.initialized) return true;

        if (this.isNative()) {
            return this.initNative();
        } else {
            return this.initWeb();
        }
    }

    // Initialize for native platforms (Android/iOS)
    private async initNative(): Promise<boolean> {
        try {
            const { PushNotifications } = await import('@capacitor/push-notifications');

            // Request permission
            const permission = await PushNotifications.requestPermissions();
            if (permission.receive !== 'granted') {
                console.warn('Push notification permission denied');
                return false;
            }

            // Register for push notifications
            await PushNotifications.register();

            // Handle registration success
            PushNotifications.addListener('registration', (token: PushNotificationToken) => {
                this.token = token.value;
                console.log('Push registration success:', token.value.substring(0, 20) + '...');
                this.sendTokenToServer(token.value);
            });

            // Handle registration errors
            PushNotifications.addListener('registrationError', (error: { error: string }) => {
                console.error('Push registration error:', error.error);
            });

            // Handle received notifications
            PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
                console.log('Push notification received:', notification);
                this.notifyListeners(notification);
            });

            // Handle notification tap
            PushNotifications.addListener('pushNotificationActionPerformed', (action: { notification: PushNotification }) => {
                console.log('Push notification action:', action);
                this.handleNotificationTap(action.notification);
            });

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize native push:', error);
            return false;
        }
    }

    // Initialize for web (fallback/demo)
    private async initWeb(): Promise<boolean> {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Web notification permission denied');
                return false;
            }

            this.initialized = true;
            console.log('Web notifications initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize web notifications:', error);
            return false;
        }
    }

    // Send token to backend server
    private async sendTokenToServer(token: string): Promise<void> {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            console.log('[DEV] Would send push token to server:', token.substring(0, 20) + '...');
            return;
        }

        try {
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                console.warn('No auth token, skipping push token registration');
                return;
            }

            await fetch(`${apiUrl}/users/push-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ token, platform: Capacitor.getPlatform() }),
            });
        } catch (error) {
            console.error('Failed to send push token to server:', error);
        }
    }

    // Handle notification tap action
    private handleNotificationTap(notification: PushNotification): void {
        // Navigate based on notification data
        const data = notification.data;
        if (data.type === 'new_job') {
            window.location.href = `/job/${data.jobId}`;
        } else if (data.type === 'message') {
            window.location.href = '/messages';
        } else if (data.type === 'application') {
            window.location.href = '/advertiser/applications';
        }
    }

    // Add notification listener
    onNotification(handler: NotificationHandler): () => void {
        this.listeners.push(handler);
        return () => {
            this.listeners = this.listeners.filter(l => l !== handler);
        };
    }

    // Notify all listeners
    private notifyListeners(notification: PushNotification): void {
        this.listeners.forEach(handler => handler(notification));
    }

    // Show local notification (web only)
    showLocalNotification(title: string, body: string, data?: Record<string, unknown>): void {
        if (this.isNative()) {
            // Native local notifications would use @capacitor/local-notifications
            console.log('Local notification:', { title, body, data });
        } else if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, data: data as unknown as undefined });
        }
    }

    // Get current token
    getToken(): string | null {
        return this.token;
    }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
