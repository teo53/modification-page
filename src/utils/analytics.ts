// Simple Analytics Service using LocalStorage for demo purposes

export interface HeatmapPoint {
    x: number;
    y: number;
    path: string;
    timestamp: number;
    viewportWidth: number;
}

export interface ScrollData {
    path: string;
    maxScroll: number; // percentage 0-100
    timestamp: number;
}

const CLICK_STORAGE_KEY = 'queenalba_heatmap_clicks';
const SCROLL_STORAGE_KEY = 'queenalba_heatmap_scrolls';

export const AnalyticsService = {
    // Track a click event
    trackClick: (x: number, y: number, path: string) => {
        const point: HeatmapPoint = {
            x,
            y,
            path,
            timestamp: Date.now(),
            viewportWidth: window.innerWidth
        };

        const existing = AnalyticsService.getClicks();
        existing.push(point);

        // Limit storage to last 1000 clicks to prevent quota issues
        if (existing.length > 1000) existing.shift();

        localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(existing));
    },

    // Track scroll depth
    trackScroll: (path: string, scrollPercent: number) => {
        // We only care about the max scroll depth for a session/page view
        // For simplicity in this demo, we just store discrete scroll events
        const data: ScrollData = {
            path,
            maxScroll: scrollPercent,
            timestamp: Date.now()
        };

        // In a real app, we'd aggregate this on the server. 
        // Here we just store the last 100 scroll events.
        const existing = AnalyticsService.getScrolls();
        existing.push(data);
        if (existing.length > 100) existing.shift();

        localStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(existing));
    },

    // Get all click data
    getClicks: (): HeatmapPoint[] => {
        try {
            const data = localStorage.getItem(CLICK_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // Get all scroll data
    getScrolls: (): ScrollData[] => {
        try {
            const data = localStorage.getItem(SCROLL_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // Clear data
    clearData: () => {
        localStorage.removeItem(CLICK_STORAGE_KEY);
        localStorage.removeItem(SCROLL_STORAGE_KEY);
    }
};
