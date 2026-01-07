// =============================================================================
// VirtualizedFeed - High-performance infinite scroll for mobile WebView
// Uses @tanstack/react-virtual for DOM node recycling
// =============================================================================

import { useRef, useCallback, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteContent } from '../../hooks/useInfiniteContent';
import { AdCard } from './AdCard';
import { FeedSkeleton } from './FeedSkeleton';
import { ChevronUp, RefreshCw, AlertCircle } from 'lucide-react';
import type { AdListItem } from '@lunaalba/types';

interface VirtualizedFeedProps {
  className?: string;
}

const ITEM_HEIGHT_ESTIMATE = 280; // Estimated height for ad cards
const OVERSCAN = 5; // Number of items to render outside visible area
const SCROLL_THRESHOLD = 500; // Show "back to top" after this scroll distance

export function VirtualizedFeed({ className = '' }: VirtualizedFeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    hasPrevious,
    loadMore,
    loadPrevious,
    refresh,
    retry,
  } = useInfiniteContent({ limit: 20, maxPages: 10 });

  // Virtualizer configuration
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT_ESTIMATE,
    overscan: OVERSCAN,
    // Enable dynamic measurement for variable height items
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll trigger
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    // Load more when approaching the end
    if (lastItem.index >= items.length - 5 && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [virtualItems, items.length, hasMore, isLoadingMore, loadMore]);

  // Load previous when at top
  useEffect(() => {
    const firstItem = virtualItems[0];
    if (!firstItem) return;

    if (firstItem.index <= 2 && hasPrevious && !isLoadingMore) {
      loadPrevious();
    }
  }, [virtualItems, hasPrevious, isLoadingMore, loadPrevious]);

  // Track scroll position for "back to top" button
  const handleScroll = useCallback(() => {
    if (parentRef.current) {
      setShowBackToTop(parentRef.current.scrollTop > SCROLL_THRESHOLD);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    parentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Pull to refresh using native scroll (simplified)
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  if (isLoading) {
    return <FeedSkeleton count={5} />;
  }

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="w-12 h-12 text-theme-error mb-4" />
        <p className="text-theme-text-secondary text-center mb-4">
          콘텐츠를 불러오는데 실패했습니다
        </p>
        <button
          onClick={retry}
          className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-theme-text-inverse rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          다시 시도
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-theme-text-secondary">등록된 광고가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        className="absolute top-2 right-2 z-10 p-2 bg-theme-surface rounded-full shadow-theme-md"
        aria-label="새로고침"
      >
        <RefreshCw className="w-5 h-5 text-theme-text-secondary" />
      </button>

      {/* Virtualized scroll container */}
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="h-full overflow-auto"
        style={{ contain: 'strict' }}
      >
        {/* Load older content indicator */}
        {hasPrevious && (
          <button
            onClick={loadPrevious}
            className="w-full py-3 text-center text-theme-primary text-sm"
          >
            이전 항목 불러오기
          </button>
        )}

        {/* Virtual list container */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <AdCard ad={item} />
              </div>
            );
          })}
        </div>

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-theme-primary border-t-transparent" />
          </div>
        )}

        {/* End of list */}
        {!hasMore && items.length > 0 && (
          <div className="py-6 text-center text-theme-text-tertiary text-sm">
            모든 광고를 확인했습니다
          </div>
        )}
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 p-3 bg-theme-primary text-theme-text-inverse rounded-full shadow-theme-lg transition-transform hover:scale-110"
          aria-label="맨 위로"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default VirtualizedFeed;
