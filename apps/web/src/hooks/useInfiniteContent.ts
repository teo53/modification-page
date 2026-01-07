// =============================================================================
// useInfiniteContent - Cursor-based pagination hook for virtualized lists
// =============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type { AdListItem, PaginatedResponse } from '@lunaalba/types';

interface UseInfiniteContentOptions {
  limit?: number;
  maxPages?: number; // Hard cap on pages kept in memory
  initialCursor?: string;
}

interface UseInfiniteContentReturn {
  items: AdListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  hasPrevious: boolean;
  loadMore: () => Promise<void>;
  loadPrevious: () => Promise<void>;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function useInfiniteContent(
  options: UseInfiniteContentOptions = {}
): UseInfiniteContentReturn {
  const { limit = 20, maxPages = 10 } = options;

  const [items, setItems] = useState<AdListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Track in-flight requests to prevent duplicates
  const inFlightRef = useRef<boolean>(false);
  const cursorsRef = useRef<Set<string>>(new Set());
  const pageCountRef = useRef<number>(0);

  const fetchContent = useCallback(
    async (cursor?: string, direction: 'forward' | 'backward' = 'forward') => {
      // Prevent duplicate requests
      if (inFlightRef.current) return;

      const cursorKey = cursor || 'initial';
      if (cursorsRef.current.has(cursorKey)) return;

      inFlightRef.current = true;
      cursorsRef.current.add(cursorKey);

      try {
        const params = new URLSearchParams();
        params.set('limit', limit.toString());
        if (cursor) params.set('cursor', cursor);

        const response = await fetch(
          `${API_BASE_URL}/api/ads?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PaginatedResponse<AdListItem> = await response.json();

        setItems((prev) => {
          if (direction === 'forward') {
            const newItems = [...prev, ...data.items];
            // Enforce max pages by trimming from the beginning
            if (pageCountRef.current >= maxPages && data.items.length > 0) {
              const trimCount = Math.min(limit, newItems.length - maxPages * limit);
              if (trimCount > 0) {
                setHasPrevious(true);
                return newItems.slice(trimCount);
              }
            }
            return newItems;
          } else {
            return [...data.items, ...prev];
          }
        });

        if (direction === 'forward') {
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
          pageCountRef.current++;
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch content'));
      } finally {
        inFlightRef.current = false;
      }
    },
    [limit, maxPages]
  );

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchContent();
      setIsLoading(false);
    };
    load();
  }, [fetchContent]);

  const loadMore = useCallback(async () => {
    if (!hasMore || inFlightRef.current || !nextCursor) return;
    setIsLoadingMore(true);
    await fetchContent(nextCursor, 'forward');
    setIsLoadingMore(false);
  }, [fetchContent, hasMore, nextCursor]);

  const loadPrevious = useCallback(async () => {
    if (!hasPrevious || inFlightRef.current || !prevCursor) return;
    setIsLoadingMore(true);
    await fetchContent(prevCursor, 'backward');
    setIsLoadingMore(false);
  }, [fetchContent, hasPrevious, prevCursor]);

  const refresh = useCallback(async () => {
    cursorsRef.current.clear();
    pageCountRef.current = 0;
    setItems([]);
    setNextCursor(null);
    setPrevCursor(null);
    setHasMore(true);
    setHasPrevious(false);
    setIsLoading(true);
    await fetchContent();
    setIsLoading(false);
  }, [fetchContent]);

  const retry = useCallback(async () => {
    setError(null);
    if (items.length === 0) {
      await refresh();
    } else {
      await loadMore();
    }
  }, [items.length, refresh, loadMore]);

  return {
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
  };
}

export default useInfiniteContent;
