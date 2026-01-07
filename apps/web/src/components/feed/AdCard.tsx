// =============================================================================
// AdCard - Lightweight card component for ad list items
// Optimized for virtualized lists with lazy image loading
// =============================================================================

import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Eye, Flame, Zap } from 'lucide-react';
import type { AdListItem } from '@lunaalba/types';

interface AdCardProps {
  ad: AdListItem;
}

function AdCardComponent({ ad }: AdCardProps) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    navigate(`/ad/${ad.id}`);
  }, [navigate, ad.id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <article
      onClick={handleClick}
      className="bg-theme-surface rounded-xl overflow-hidden shadow-theme-sm hover:shadow-theme-md transition-shadow cursor-pointer mx-4 my-2"
    >
      {/* Thumbnail with lazy loading */}
      <div className="relative aspect-[16/9] bg-theme-bg-tertiary">
        {!imageError && ad.thumbnail ? (
          <>
            {/* Placeholder skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-theme-bg-tertiary animate-pulse" />
            )}
            <img
              src={ad.thumbnail}
              alt={ad.title}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-theme-text-tertiary">
            <span className="text-4xl">🏢</span>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex gap-1">
          {ad.isUrgent && (
            <span className="px-2 py-0.5 bg-theme-error text-white text-xs font-bold rounded">
              <Zap className="w-3 h-3 inline mr-0.5" />
              급구
            </span>
          )}
          {ad.isHot && (
            <span className="px-2 py-0.5 bg-theme-warning text-white text-xs font-bold rounded">
              <Flame className="w-3 h-3 inline mr-0.5" />
              인기
            </span>
          )}
          {ad.isNew && (
            <span className="px-2 py-0.5 bg-theme-primary text-theme-text-inverse text-xs font-bold rounded">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Business name */}
        <p className="text-theme-text-secondary text-sm mb-1 truncate">
          {ad.businessName}
        </p>

        {/* Title */}
        <h3 className="text-theme-text font-semibold text-base line-clamp-2 mb-2">
          {ad.title}
        </h3>

        {/* Location & Salary */}
        <div className="flex items-center gap-4 text-sm text-theme-text-secondary mb-3">
          {ad.region && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {ad.region}
              {ad.district && ` ${ad.district}`}
            </span>
          )}
          {ad.salaryType && ad.salaryAmount && (
            <span className="text-theme-primary font-medium">
              {ad.salaryType} {ad.salaryAmount}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-theme-text-tertiary">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(ad.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {ad.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}

// Memoize to prevent unnecessary re-renders in virtual list
export const AdCard = memo(AdCardComponent);
export default AdCard;
