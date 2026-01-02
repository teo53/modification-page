import React, { useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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
  threshold = 80,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const y = useMotionValue(0);
  const progress = useTransform(y, [0, threshold], [0, 1]);
  const rotation = useTransform(y, [0, threshold], [0, 180]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      // Apply resistance
      const resistance = 0.5;
      const pullDistance = Math.min(diff * resistance, threshold * 1.5);
      y.set(pullDistance);

      // Prevent default scroll when pulling
      if (pullDistance > 0) {
        e.preventDefault();
      }
    }
  }, [isPulling, isRefreshing, threshold, y]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    const pullDistance = y.get();

    if (pullDistance >= threshold && !isRefreshing) {
      // Trigger refresh
      animate(y, threshold, { duration: 0.2 });
      await onRefresh();
    }

    // Reset
    animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
    setIsPulling(false);
  }, [isPulling, threshold, isRefreshing, onRefresh, y]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-auto overflow-x-hidden"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        style={{ y: useTransform(y, (v) => v - 60) }}
        className="absolute left-0 right-0 flex items-center justify-center h-16 z-10"
      >
        <motion.div
          style={{ opacity: progress }}
          className="flex flex-col items-center"
        >
          <motion.div
            style={{ rotate: isRefreshing ? undefined : rotation }}
            animate={isRefreshing ? { rotate: 360 } : undefined}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : undefined}
            className="w-8 h-8 flex items-center justify-center"
          >
            <RefreshCw
              size={24}
              className={isRefreshing ? 'text-primary' : 'text-text-muted'}
            />
          </motion.div>
          <motion.span
            style={{ opacity: progress }}
            className="text-xs text-text-muted mt-1"
          >
            {isRefreshing ? '새로고침 중...' : y.get() >= threshold ? '놓으면 새로고침' : '당겨서 새로고침'}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
