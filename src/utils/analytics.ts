// User Analytics Tracking System - Enhanced
// Tracks user behavior: clicks, scrolls, page views, ad interactions
// Data is stored in localStorage for Admin CRM analysis

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

export interface ClickEvent {
    x: number;
    y: number;
    pageX: number;
    pageY: number;
    elementId?: string;
    elementClass?: string;
    elementText?: string;
    timestamp: number;
    page: string;
    sessionId: string;
    viewportWidth: number;
}

export interface PageView {
    page: string;
    referrer: string;
    timestamp: number;
    sessionId: string;
    duration?: number;
}

export interface AdInteraction {
    adId: number;
    adTitle: string;
    adType: 'vip' | 'special' | 'premium' | 'general';
    action: 'view' | 'click' | 'hover';
    timestamp: number;
    sessionId: string;
    page: string;
}

export interface AnalyticsData {
    clicks: ClickEvent[];
    scrolls: ScrollData[];
    pageViews: PageView[];
    adInteractions: AdInteraction[];
    lastUpdated: string;
}

const CLICK_STORAGE_KEY = 'lunaalba_heatmap_clicks';
const SCROLL_STORAGE_KEY = 'lunaalba_heatmap_scrolls';
const ANALYTICS_KEY = 'lunaalba_analytics';
const SESSION_KEY = 'lunaalba_session_id';

// Generate or retrieve session ID
export const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
};

// Get all analytics data
export const getAnalyticsData = (): AnalyticsData => {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        clicks: [],
        scrolls: [],
        pageViews: [],
        adInteractions: [],
        lastUpdated: new Date().toISOString()
    };
};

// Save analytics data
const saveAnalyticsData = (data: AnalyticsData) => {
    data.lastUpdated = new Date().toISOString();
    // Keep only last 1000 events per category to prevent memory issues
    data.clicks = data.clicks.slice(-1000);
    data.scrolls = data.scrolls.slice(-500);
    data.pageViews = data.pageViews.slice(-500);
    data.adInteractions = data.adInteractions.slice(-1000);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
};

// Track page view
let pageViewStart: number = 0;
export const trackPageView = () => {
    const data = getAnalyticsData();

    const pageView: PageView = {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: Date.now(),
        sessionId: getSessionId()
    };

    pageViewStart = Date.now();
    data.pageViews.push(pageView);
    saveAnalyticsData(data);
};

// Track page leave (update duration)
export const trackPageLeave = () => {
    if (!pageViewStart) return;

    const data = getAnalyticsData();
    const lastPageView = data.pageViews.find(
        pv => pv.page === window.location.pathname &&
            pv.sessionId === getSessionId() &&
            !pv.duration
    );

    if (lastPageView) {
        lastPageView.duration = Date.now() - pageViewStart;
        saveAnalyticsData(data);
    }
};

// Track ad interaction
export const trackAdInteraction = (
    adId: number,
    adTitle: string,
    adType: 'vip' | 'special' | 'premium' | 'general',
    action: 'view' | 'click' | 'hover'
) => {
    const data = getAnalyticsData();

    const interaction: AdInteraction = {
        adId,
        adTitle,
        adType,
        action,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        page: window.location.pathname
    };

    data.adInteractions.push(interaction);
    saveAnalyticsData(data);
};

// Initialize all event listeners
let isInitialized = false;
export const initializeAnalytics = () => {
    if (isInitialized) return;
    isInitialized = true;

    // Track clicks
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const data = getAnalyticsData();

        const clickEvent: ClickEvent = {
            x: event.clientX,
            y: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            elementId: target.id || undefined,
            elementClass: target.className?.toString?.() || undefined,
            elementText: target.textContent?.slice(0, 50) || undefined,
            timestamp: Date.now(),
            page: window.location.pathname,
            sessionId: getSessionId(),
            viewportWidth: window.innerWidth
        };

        data.clicks.push(clickEvent);
        saveAnalyticsData(data);

        // Also save to legacy format for heatmap
        AnalyticsService.trackClick(event.clientX, event.clientY, window.location.pathname);
    }, { passive: true });

    // Track scroll (debounced)
    let scrollTimeout: number | null = null;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;

        scrollTimeout = window.setTimeout(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            AnalyticsService.trackScroll(window.location.pathname, isNaN(scrollPercent) ? 0 : scrollPercent);
            scrollTimeout = null;
        }, 500);
    }, { passive: true });

    // Track initial page view
    trackPageView();

    // Track page leave
    window.addEventListener('beforeunload', trackPageLeave);

    if (import.meta.env.DEV) {
        console.log('[Analytics] Enhanced tracking initialized');
    }
};

// Get analytics summary for Admin CRM
export const getAnalyticsSummary = () => {
    const data = getAnalyticsData();
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const last7Days = now - (7 * 24 * 60 * 60 * 1000);

    // Filter by time
    const recentClicks = data.clicks.filter(c => c.timestamp > last24Hours);
    const weeklyClicks = data.clicks.filter(c => c.timestamp > last7Days);
    const recentPageViews = data.pageViews.filter(pv => pv.timestamp > last24Hours);
    const weeklyPageViews = data.pageViews.filter(pv => pv.timestamp > last7Days);
    const recentAdInteractions = data.adInteractions.filter(ai => ai.timestamp > last24Hours);

    // Unique sessions
    const uniqueSessions24h = new Set(recentPageViews.map(pv => pv.sessionId)).size;
    const uniqueSessions7d = new Set(weeklyPageViews.map(pv => pv.sessionId)).size;

    // Page popularity
    const pageStats: Record<string, number> = {};
    recentPageViews.forEach(pv => {
        pageStats[pv.page] = (pageStats[pv.page] || 0) + 1;
    });

    // Ad performance
    const adStats: Record<number, { views: number; clicks: number; title: string; type: string }> = {};
    data.adInteractions.forEach(ai => {
        if (!adStats[ai.adId]) {
            adStats[ai.adId] = { views: 0, clicks: 0, title: ai.adTitle, type: ai.adType };
        }
        if (ai.action === 'view') adStats[ai.adId].views++;
        if (ai.action === 'click') adStats[ai.adId].clicks++;
    });

    // Note: Heatmap data removed - using Microsoft Clarity instead

    return {
        summary: {
            totalClicks24h: recentClicks.length,
            totalClicks7d: weeklyClicks.length,
            pageViews24h: recentPageViews.length,
            pageViews7d: weeklyPageViews.length,
            uniqueVisitors24h: uniqueSessions24h,
            uniqueVisitors7d: uniqueSessions7d,
            adInteractions24h: recentAdInteractions.length
        },
        pageStats: Object.entries(pageStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([page, count]) => ({ page, count })),
        adStats: Object.entries(adStats)
            .map(([id, stats]) => ({
                adId: parseInt(id),
                ...stats,
                ctr: stats.views > 0 ? ((stats.clicks / stats.views) * 100).toFixed(2) : '0'
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 20)
    };
};

// Legacy AnalyticsService for backward compatibility
export const AnalyticsService = {
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

        if (existing.length > 1000) existing.shift();

        localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(existing));
    },

    trackScroll: (path: string, scrollPercent: number) => {
        const data: ScrollData = {
            path,
            maxScroll: scrollPercent,
            timestamp: Date.now()
        };

        const existing = AnalyticsService.getScrolls();
        existing.push(data);
        if (existing.length > 100) existing.shift();

        localStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(existing));
    },

    getClicks: (): HeatmapPoint[] => {
        try {
            const data = localStorage.getItem(CLICK_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    getScrolls: (): ScrollData[] => {
        try {
            const data = localStorage.getItem(SCROLL_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    clearData: () => {
        localStorage.removeItem(CLICK_STORAGE_KEY);
        localStorage.removeItem(SCROLL_STORAGE_KEY);
        localStorage.removeItem(ANALYTICS_KEY);
    }
};

export default {
    initializeAnalytics,
    trackPageView,
    trackPageLeave,
    trackAdInteraction,
    getAnalyticsData,
    getAnalyticsSummary,
    getSessionId,
    AnalyticsService
};
