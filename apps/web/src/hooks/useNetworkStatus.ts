// =============================================================================
// useNetworkStatus Hook - React hook for network status
// =============================================================================

import { useState, useEffect } from 'react';
import { networkService } from '../services/networkService';

interface NetworkStatus {
    isOnline: boolean;
    connectionType: string;
}

// Get initial status from service or browser
function getInitialStatus(): NetworkStatus {
    const currentStatus = networkService.getStatus();
    return {
        isOnline: currentStatus.connected,
        connectionType: currentStatus.connectionType,
    };
}

export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>(getInitialStatus);

    useEffect(() => {
        // Initialize network service
        networkService.init().catch(console.error);

        // Subscribe to changes
        const unsubscribe = networkService.onStatusChange((newStatus) => {
            setStatus({
                isOnline: newStatus.connected,
                connectionType: newStatus.connectionType,
            });
        });

        return unsubscribe;
    }, []);

    return status;
}

export default useNetworkStatus;
