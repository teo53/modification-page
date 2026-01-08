// =============================================================================
// Push Notification Service (Web Only)
// =============================================================================

// Types
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

    // Check if running in native environment (for future Capacitor integration)
    isNative(): boolean {
        return false; // Web only for now
    }

    // Initialize push notifications
    async init(): Promise<boolean> {
        if (this.initialized) return true;

        return this.initWeb();
    }

    // Initialize for web
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

    // Handle notification tap action
    private handleNotificationTap(notification: PushNotification): void {
        // Notify listeners first
        this.listeners.forEach(handler => handler(notification));

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

    // Show local notification (web only)
    showLocalNotification(title: string, body: string, data?: Record<string, unknown>): void {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, { body });
            notification.onclick = () => {
                if (data) {
                    this.handleNotificationTap({ title, body, data });
                }
            };
        }
    }

    // Get current token
    getToken(): string | null {
        return this.token;
    }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
