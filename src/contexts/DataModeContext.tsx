// Data Mode Context - Controls whether to show real scraped data or sample demo data
// Only admin users can toggle this setting

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser } from '../utils/auth';

interface DataModeContextType {
    useSampleData: boolean;
    setUseSampleData: (value: boolean) => void;
    toggleDataMode: () => void;
    isAdmin: boolean;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@lunaalba.com', 'admin@example.com', 'admin@dalbitalba.com'];
const DATA_MODE_KEY = 'lunaalba_data_mode';
const CRM_MODE_KEY = 'lunaalba_crm_mode';

export const DataModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // ============================================
    // 🚨 강제 샘플 모드 - 라이브 사이트 안정성을 위해
    // localStorage 무시하고 항상 샘플 데이터 사용
    // ============================================
    const [useSampleData, setUseSampleDataState] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = () => {
            const user = getCurrentUser();
            setIsAdmin(user ? ADMIN_EMAILS.includes(user.email) : false);
        };

        checkAdmin();

        // CRM 모드 변경 이벤트 리스너 (즉시 동기화)
        const handleCrmModeChange = (event: CustomEvent) => {
            const mode = event.detail?.mode;
            if (mode) {
                const shouldUseSample = mode !== 'operational';
                setUseSampleDataState(shouldUseSample);
            }
        };

        window.addEventListener('crmModeChange', handleCrmModeChange as EventListener);

        // Check periodically for login state changes and CRM mode changes
        // Reduced frequency to prevent excessive re-renders
        const interval = setInterval(() => {
            checkAdmin();
            // Sync with CRM mode - only update if value actually changed
            const crmMode = localStorage.getItem(CRM_MODE_KEY);
            if (crmMode) {
                const shouldUseSample = crmMode !== 'operational';
                setUseSampleDataState(prev => {
                    // Only update if different to prevent unnecessary re-renders
                    if (prev !== shouldUseSample) {
                        return shouldUseSample;
                    }
                    return prev;
                });
            }
        }, 5000); // Increased from 1s to 5s

        return () => {
            clearInterval(interval);
            window.removeEventListener('crmModeChange', handleCrmModeChange as EventListener);
        };
    }, []);

    const setUseSampleData = (value: boolean) => {
        if (!isAdmin) return;
        localStorage.setItem(DATA_MODE_KEY, value ? 'sample' : 'real');
        // Also sync with CRM mode
        localStorage.setItem(CRM_MODE_KEY, value ? 'demo' : 'operational');
        setUseSampleDataState(value);
    };

    const toggleDataMode = () => {
        setUseSampleData(!useSampleData);
    };

    return (
        <DataModeContext.Provider value={{ useSampleData, setUseSampleData, toggleDataMode, isAdmin }}>
            {children}
        </DataModeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataMode = (): DataModeContextType => {
    const context = useContext(DataModeContext);
    if (!context) {
        throw new Error('useDataMode must be used within DataModeProvider');
    }
    return context;
};

export default DataModeContext;
