import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { allAds, type Advertisement } from '../data/mockAds';

// Extended type for viewed ads with timestamp
interface ViewedAd extends Advertisement {
    viewedAt: number;
}

const MyPageViews: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useApp();

    // Get recently viewed ads with full data and proper typing
    const recentViewAds: ViewedAd[] = state.recentViews
        .map(view => {
            const ad = allAds.find(a => String(a.id) === view.id);
            return ad ? { ...ad, viewedAt: view.viewedAt } : null;
        })
        .filter((ad): ad is ViewedAd => ad !== null);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days === 1) return '어제';
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen pb-24 bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-text-main">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-text-main">최근 본 공고</h1>
                <span className="text-sm text-text-muted ml-auto">{recentViewAds.length}개</span>
            </div>

            {recentViewAds.length > 0 ? (
                <div className="divide-y divide-border">
                    <AnimatePresence>
                        {recentViewAds.map((ad) => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <Link
                                    to={`/ad/${ad.id}`}
                                    className="flex gap-4 p-4 active:bg-surface bg-card"
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
                                        <h3 className="font-bold text-text-main truncate">
                                            {ad.title}
                                        </h3>
                                        <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                                            <MapPin size={14} />
                                            {ad.location}
                                        </p>
                                        <p className="text-primary font-bold mt-2">{ad.pay}</p>
                                        <p className="text-xs text-text-muted/60 flex items-center gap-1 mt-1">
                                            <Clock size={12} />
                                            {formatDate(ad.viewedAt)}에 봄
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-6">
                        <Clock size={40} className="text-text-muted" />
                    </div>
                    <h2 className="text-lg font-bold text-text-main mb-2">
                        최근 본 공고가 없습니다
                    </h2>
                    <p className="text-text-muted text-center mb-6">
                        공고를 둘러보면 여기에 기록됩니다.
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

export default MyPageViews;
