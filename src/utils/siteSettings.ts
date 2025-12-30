/**
 * 사이트 설정 관리 유틸리티
 * localStorage 기반 저장/불러오기 (추후 백엔드 API 연동 가능)
 */

import { type SiteConfig, defaultSiteConfig } from '../config/siteConfig';

const SITE_CONFIG_KEY = 'dalbitAlba_site_config';
const CONFIG_VERSION = '1.0.0';

interface StoredConfig {
    version: string;
    config: SiteConfig;
}

/**
 * 사이트 설정 불러오기
 */
export function getSiteConfig(): SiteConfig {
    try {
        const stored = localStorage.getItem(SITE_CONFIG_KEY);
        if (!stored) {
            return defaultSiteConfig;
        }

        const parsed: StoredConfig = JSON.parse(stored);

        // 버전 체크 - 버전이 다르면 기본값과 병합
        if (parsed.version !== CONFIG_VERSION) {
            return mergeWithDefaults(parsed.config);
        }

        return parsed.config;
    } catch (error) {
        console.error('Failed to load site config:', error);
        return defaultSiteConfig;
    }
}

/**
 * 사이트 설정 저장
 */
export function saveSiteConfig(config: Partial<SiteConfig>): { success: boolean; message: string } {
    try {
        const currentConfig = getSiteConfig();
        const newConfig: SiteConfig = {
            ...currentConfig,
            ...config,
            lastUpdated: new Date().toISOString(),
        };

        const stored: StoredConfig = {
            version: CONFIG_VERSION,
            config: newConfig,
        };

        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(stored));

        // 변경 이벤트 발행 (다른 컴포넌트에서 구독 가능)
        window.dispatchEvent(new CustomEvent('siteConfigChanged', { detail: newConfig }));

        return { success: true, message: '설정이 저장되었습니다.' };
    } catch (error) {
        console.error('Failed to save site config:', error);
        return { success: false, message: '설정 저장에 실패했습니다.' };
    }
}

/**
 * 섹션별 설정 업데이트
 */
export function updateConfigSection<K extends keyof SiteConfig>(
    section: K,
    data: SiteConfig[K]
): { success: boolean; message: string } {
    const currentConfig = getSiteConfig();
    return saveSiteConfig({
        ...currentConfig,
        [section]: data,
    });
}

/**
 * 설정 초기화
 */
export function resetSiteConfig(): { success: boolean; message: string } {
    try {
        localStorage.removeItem(SITE_CONFIG_KEY);
        window.dispatchEvent(new CustomEvent('siteConfigChanged', { detail: defaultSiteConfig }));
        return { success: true, message: '설정이 초기화되었습니다.' };
    } catch (error) {
        console.error('Failed to reset site config:', error);
        return { success: false, message: '설정 초기화에 실패했습니다.' };
    }
}

/**
 * 설정 내보내기 (JSON 파일)
 */
export function exportSiteConfig(): void {
    const config = getSiteConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * 설정 가져오기 (JSON 파일)
 */
export async function importSiteConfig(file: File): Promise<{ success: boolean; message: string }> {
    try {
        const text = await file.text();
        const config = JSON.parse(text) as SiteConfig;

        // 필수 필드 검증
        if (!config.basic || !config.contact || !config.company) {
            return { success: false, message: '유효하지 않은 설정 파일입니다.' };
        }

        return saveSiteConfig(config);
    } catch (error) {
        console.error('Failed to import site config:', error);
        return { success: false, message: '설정 파일을 읽는 데 실패했습니다.' };
    }
}

/**
 * 기본값과 병합 (새 필드가 추가된 경우)
 */
function mergeWithDefaults(config: Partial<SiteConfig>): SiteConfig {
    return {
        basic: { ...defaultSiteConfig.basic, ...config.basic },
        contact: { ...defaultSiteConfig.contact, ...config.contact },
        company: { ...defaultSiteConfig.company, ...config.company },
        social: { ...defaultSiteConfig.social, ...config.social },
        pricing: config.pricing || defaultSiteConfig.pricing,
        quickMenu: config.quickMenu || defaultSiteConfig.quickMenu,
        homeSections: config.homeSections || defaultSiteConfig.homeSections,
        communityCategories: config.communityCategories || defaultSiteConfig.communityCategories,
        payment: { ...defaultSiteConfig.payment, ...config.payment },
        navigation: config.navigation || defaultSiteConfig.navigation,
        statsDisplay: { ...defaultSiteConfig.statsDisplay, ...config.statsDisplay },
        theme: { ...defaultSiteConfig.theme, ...config.theme },
        seo: { ...defaultSiteConfig.seo, ...config.seo },
        lastUpdated: config.lastUpdated || new Date().toISOString(),
        updatedBy: config.updatedBy || 'system',
    };
}

/**
 * 특정 가격 상품 업데이트
 */
export function updatePricingItem(
    productId: string,
    updates: Partial<SiteConfig['pricing'][0]>
): { success: boolean; message: string } {
    const config = getSiteConfig();
    const pricing = config.pricing.map((item) =>
        item.id === productId ? { ...item, ...updates } : item
    );
    return saveSiteConfig({ ...config, pricing });
}

/**
 * 빠른 메뉴 아이템 업데이트
 */
export function updateQuickMenuItem(
    itemId: string,
    updates: Partial<SiteConfig['quickMenu'][0]>
): { success: boolean; message: string } {
    const config = getSiteConfig();
    const quickMenu = config.quickMenu.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
    );
    return saveSiteConfig({ ...config, quickMenu });
}

/**
 * 홈 섹션 순서 변경
 */
export function reorderHomeSections(sectionIds: string[]): { success: boolean; message: string } {
    const config = getSiteConfig();
    const homeSections = sectionIds.map((id, index) => {
        const section = config.homeSections.find((s) => s.id === id);
        if (!section) throw new Error(`Section ${id} not found`);
        return { ...section, order: index + 1 };
    });
    return saveSiteConfig({ ...config, homeSections });
}

/**
 * React Hook: 설정 구독
 */
export function useSiteConfig(): SiteConfig {
    // 이 함수는 컴포넌트에서 호출됨 - 실제 Hook은 별도로 구현
    return getSiteConfig();
}

export default {
    get: getSiteConfig,
    save: saveSiteConfig,
    updateSection: updateConfigSection,
    reset: resetSiteConfig,
    export: exportSiteConfig,
    import: importSiteConfig,
    updatePricing: updatePricingItem,
    updateQuickMenu: updateQuickMenuItem,
    reorderSections: reorderHomeSections,
};
