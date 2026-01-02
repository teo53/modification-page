import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-white text-sm font-medium">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>인터넷 연결이 복구되었습니다</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>오프라인 모드 - 일부 기능이 제한될 수 있습니다</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
