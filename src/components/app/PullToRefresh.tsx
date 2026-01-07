import React, { useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  threshold?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  isRefreshing,
  threshold = 60,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = scrollRef.current?.scrollTop || 0;
    if (scrollTop <= 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const scrollTop = scrollRef.current?.scrollTop || 0;
    if (scrollTop > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      const distance = Math.min(diff * 0.4, threshold * 1.5);
      setPullDistance(distance);
    }
  }, [isPulling, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    if (pullDistance >= threshold && !isRefreshing) {
      await onRefresh();
    }

    setPullDistance(0);
    setIsPulling(false);
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div className="relative h-full">
      {/* Pull indicator - fixed position */}
      {pullDistance > 10 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ top: Math.min(pullDistance - 40, 20) }}
        >
          <div
            className="flex flex-col items-center bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
            style={{ opacity: progress }}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${progress * 180}deg)` }}
            >
              <RefreshCw size={20} className={isRefreshing ? 'text-primary' : 'text-text-muted'} />
            </div>
          </div>
        </div>
      )}

      {/* Scrollable content - NO transform on content */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
