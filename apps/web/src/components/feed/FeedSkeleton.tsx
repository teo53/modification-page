// =============================================================================
// FeedSkeleton - Loading skeleton for the feed
// =============================================================================

import { memo } from 'react';

interface FeedSkeletonProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-theme-surface rounded-xl overflow-hidden shadow-theme-sm mx-4 my-2 animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="aspect-[16/9] bg-theme-bg-tertiary" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Business name */}
        <div className="h-4 bg-theme-bg-tertiary rounded w-1/3 mb-2" />

        {/* Title */}
        <div className="h-5 bg-theme-bg-tertiary rounded w-full mb-1" />
        <div className="h-5 bg-theme-bg-tertiary rounded w-2/3 mb-3" />

        {/* Location & Salary */}
        <div className="flex gap-4 mb-3">
          <div className="h-4 bg-theme-bg-tertiary rounded w-24" />
          <div className="h-4 bg-theme-bg-tertiary rounded w-20" />
        </div>

        {/* Footer */}
        <div className="flex justify-between">
          <div className="h-3 bg-theme-bg-tertiary rounded w-16" />
          <div className="h-3 bg-theme-bg-tertiary rounded w-12" />
        </div>
      </div>
    </div>
  );
}

function FeedSkeletonComponent({ count = 5 }: FeedSkeletonProps) {
  return (
    <div className="py-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export const FeedSkeleton = memo(FeedSkeletonComponent);
export default FeedSkeleton;
