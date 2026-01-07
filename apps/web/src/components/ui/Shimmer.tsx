import React from 'react';

interface ShimmerProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button';
}

const Shimmer: React.FC<ShimmerProps> = ({ className = '', variant = 'text' }) => {
  const baseClass = 'animate-pulse bg-gradient-to-r from-surface via-accent to-surface bg-[length:200%_100%]';

  if (variant === 'card') {
    return (
      <div className={`rounded-xl overflow-hidden ${className}`}>
        <div className={`h-24 ${baseClass}`} />
        <div className="p-2 space-y-2">
          <div className={`h-4 rounded ${baseClass}`} />
          <div className={`h-3 w-3/4 rounded ${baseClass}`} />
          <div className={`h-3 w-1/2 rounded ${baseClass}`} />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`rounded-full ${baseClass} ${className}`} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={`rounded-lg ${baseClass} ${className}`} />
    );
  }

  return (
    <div className={`rounded ${baseClass} ${className}`} />
  );
};

// Skeleton grid for ad cards
export const AdCardSkeleton: React.FC = () => (
  <div className="rounded-xl overflow-hidden border border-border bg-card">
    <div className="relative h-24 bg-surface animate-pulse" />
    <div className="p-2 space-y-2">
      <div className="h-4 bg-surface rounded animate-pulse" />
      <div className="h-3 w-3/4 bg-surface rounded animate-pulse" />
      <div className="flex justify-between">
        <div className="h-3 w-1/3 bg-surface rounded animate-pulse" />
        <div className="h-3 w-8 bg-surface rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export const AdListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-2 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <AdCardSkeleton key={i} />
    ))}
  </div>
);

export default Shimmer;
