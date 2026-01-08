// =============================================================================
// OfflineIndicator Component - Shows offline status banner
// =============================================================================

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface OfflineIndicatorProps {
    className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
    const { isOnline } = useNetworkStatus();

    if (isOnline) return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium ${className}`}
            role="alert"
            aria-live="polite"
        >
            <WifiOff size={16} aria-hidden="true" />
            <span>인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.</span>
            <button
                onClick={() => window.location.reload()}
                className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="새로고침"
            >
                <RefreshCw size={14} aria-hidden="true" />
            </button>
        </div>
    );
};

export default OfflineIndicator;
