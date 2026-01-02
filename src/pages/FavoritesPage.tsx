import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { allAds } from '../data/mockAds';

const FavoritesPage: React.FC = () => {
  const { state, toggleFavorite } = useApp();

  // Get favorited ads
  const favoriteAds = state.favorites
    .map(fav => {
      const ad = allAds.find(a => String(a.id) === fav.id);
      return ad ? { ...ad, addedAt: fav.addedAt } : null;
    })
    .filter(Boolean);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Info */}
      <div className="px-4 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Heart size={24} className="text-primary" fill="currentColor" />
              찜한 공고
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {favoriteAds.length}개의 공고를 찜했습니다
            </p>
          </div>
          {favoriteAds.length > 0 && (
            <button
              onClick={() => {
                if (confirm('모든 찜 목록을 삭제하시겠습니까?')) {
                  state.favorites.forEach(f => toggleFavorite(f.id));
                }
              }}
              className="text-sm text-text-muted hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 size={16} />
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {/* Favorites List */}
      {favoriteAds.length > 0 ? (
        <div className="divide-y divide-border">
          <AnimatePresence>
            {favoriteAds.map((ad: any) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative bg-white"
              >
                <Link
                  to={`/ad/${ad.id}`}
                  className="flex gap-4 p-4 active:bg-accent"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-accent flex-shrink-0">
                    <img
                      src={ad.thumbnail}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-main truncate pr-8">
                      {ad.title}
                    </h3>
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {ad.location}
                    </p>
                    <p className="text-primary font-bold mt-2">{ad.pay}</p>
                    <p className="text-xs text-text-light flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {formatDate(ad.addedAt)}에 찜함
                    </p>
                  </div>
                </Link>

                {/* Remove Button */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(String(ad.id));
                  }}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-red-50"
                >
                  <Heart size={20} className="text-primary" fill="currentColor" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6">
            <Heart size={40} className="text-text-muted" />
          </div>
          <h2 className="text-lg font-bold text-text-main mb-2">
            찜한 공고가 없습니다
          </h2>
          <p className="text-text-muted text-center mb-6">
            마음에 드는 공고를 찜해보세요!<br />
            나중에 쉽게 다시 볼 수 있습니다.
          </p>
          <Link
            to="/search"
            className="bg-primary text-white font-bold px-8 py-3 rounded-full"
          >
            공고 둘러보기
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
