import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

interface JobCardProps {
  id: string | number;
  title: string;
  location: string;
  pay: string;
  image: string;
  badges?: string[];
  isNew?: boolean;
  isHot?: boolean;
  variant?: 'grid' | 'list' | 'compact' | 'minimal';
}

const JobCard: React.FC<JobCardProps> = ({
  id: rawId,
  title,
  location,
  pay,
  image,
  badges = [],
  isNew = false,
  isHot = false,
  variant = 'grid',
}) => {
  // Convert id to string for consistency
  const id = String(rawId);

  const { isFavorite, toggleFavorite, addRecentView } = useApp();
  const isFav = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleCardClick = () => {
    addRecentView({ id, title, location, pay });
  };

  // Grid variant (2 columns)
  if (variant === 'grid') {
    return (
      <Link to={`/ad/${id}`} onClick={handleCardClick}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm active:border-primary/30"
        >
          {/* Image */}
          <div className="relative aspect-[4/3]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {isHot && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1">
                  <Zap size={10} /> 급구
                </span>
              )}
              {isNew && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
                  NEW
                </span>
              )}
            </div>
            {/* Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
            >
              <Heart
                size={18}
                className={isFav ? 'text-secondary' : 'text-white'}
                fill={isFav ? 'currentColor' : 'none'}
              />
            </motion.button>
          </div>
          {/* Info */}
          <div className="p-3">
            <h3 className="font-bold text-text-main text-sm line-clamp-1">{title}</h3>
            <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
              <MapPin size={12} />
              {location}
            </p>
            <p className="text-primary font-bold text-sm mt-2">{pay}</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  // List variant (horizontal)
  if (variant === 'list') {
    return (
      <Link to={`/ad/${id}`} onClick={handleCardClick}>
        <motion.div
          whileTap={{ scale: 0.99 }}
          className="flex gap-3 p-3 bg-white rounded-xl border border-border shadow-sm active:border-primary/30"
        >
          {/* Image */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {isHot && (
              <span className="absolute top-1 left-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500">
                <Zap size={10} className="text-white" />
              </span>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-text-main text-sm line-clamp-1">{title}</h3>
              {isNew && (
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold flex-shrink-0">
                  N
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
              <MapPin size={12} />
              {location}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-primary font-bold text-sm">{pay}</p>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleFavoriteClick}
                className="p-1"
              >
                <Heart
                  size={18}
                  className={isFav ? 'text-secondary' : 'text-text-muted'}
                  fill={isFav ? 'currentColor' : 'none'}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Compact variant (horizontal scroll cards)
  if (variant === 'compact') {
    return (
      <Link to={`/ad/${id}`} onClick={handleCardClick}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm"
        >
          {/* Image */}
          <div className="relative h-32">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            {isHot && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1">
                <Zap size={10} /> 급구
              </span>
            )}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/40"
            >
              <Heart
                size={14}
                className={isFav ? 'text-secondary' : 'text-white'}
                fill={isFav ? 'currentColor' : 'none'}
              />
            </motion.button>
            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-bold text-white text-sm line-clamp-1">{title}</h3>
              <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                <MapPin size={10} />
                {location}
              </p>
            </div>
          </div>
          {/* Bottom */}
          <div className="px-3 py-2 flex items-center justify-between">
            <p className="text-primary font-bold text-sm">{pay}</p>
            {badges.length > 0 && (
              <span className="text-xs text-text-muted">{badges[0]}</span>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  // Minimal variant (small thumbnail)
  if (variant === 'minimal') {
    return (
      <Link to={`/ad/${id}`} onClick={handleCardClick}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl overflow-hidden border border-border shadow-sm"
        >
          <div className="aspect-[4/3]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-2">
            <h3 className="font-medium text-text-main text-xs line-clamp-1">{title}</h3>
            <p className="text-primary font-bold text-xs mt-1">{pay}</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  return null;
};

export default JobCard;
