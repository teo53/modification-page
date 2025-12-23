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
    const [useSampleData, setUseSampleDataState] = useState(() => {
        // Check CRM mode first, then fall back to data mode
        const crmMode = localStorage.getItem(CRM_MODE_KEY);
        if (crmMode) {
            // CRM operational mode = real data, demo mode = sample data
            return crmMode !== 'operational';
        }
        // Fall back to old data mode key
        const saved = localStorage.getItem(DATA_MODE_KEY);
        return saved === 'sample';
    });

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = () => {
            const user = getCurrentUser();
            setIsAdmin(user ? ADMIN_EMAILS.includes(user.email) : false);
        };

        checkAdmin();
        // Check periodically for login state changes and CRM mode changes
        const interval = setInterval(() => {
            checkAdmin();
            // Sync with CRM mode
            const crmMode = localStorage.getItem(CRM_MODE_KEY);
            if (crmMode) {
                const shouldUseSample = crmMode !== 'operational';
                setUseSampleDataState(shouldUseSample);
            }
        }, 1000);
        return () => clearInterval(interval);
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

export const useDataMode = (): DataModeContextType => {
    const context = useContext(DataModeContext);
    if (!context) {
        throw new Error('useDataMode must be used within DataModeProvider');
    }
    return context;
};

export default DataModeContext;
