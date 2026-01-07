import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Star, ChevronRight, Eye } from 'lucide-react';
import scrapedAdsData from '../../data/scraped_ads.json';

interface ScrapedAd {
    id: number;
    title: string;
    thumbnail: string;
    location?: string;
    pay?: string;
    advertiser?: {
        nickname?: string;
        business_name?: string;
        work_location?: string;
        views?: number;
    };
    recruitment?: {
        salary?: string;
    };
}

// Filter ads with valid thumbnails (not empty, not placeholder)
const validAds = (scrapedAdsData as ScrapedAd[]).filter(ad =>
    ad.thumbnail &&
    ad.thumbnail.trim() !== '' &&
    !ad.thumbnail.includes('mobile_img/banner')
);

// Get top 3 ads with highest views for Diamond section
const diamondAds = [...validAds]
    .sort((a, b) => (b.advertiser?.views || 0) - (a.advertiser?.views || 0))
    .slice(0, 3);

const DiamondAdCard: React.FC<{ ad: ScrapedAd }> = ({ ad }) => {
    return (
        <Link to={`/ad/${ad.id}`} className="diamond-card group relative h-80 overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10">
            {/* Aurora Border Effect */}
            <div className="aurora-border absolute inset-0 rounded-2xl p-[3px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600 opacity-80" />
                <div className="aurora-shimmer absolute inset-0 rounded-2xl" />
            </div>

            {/* Content Container */}
            <div className="relative h-full w-full bg-black rounded-2xl m-[3px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={ad.thumbnail}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-black text-[10px] font-extrabold shadow-lg shadow-yellow-500/50 animate-pulse">
                        <Star size={10} fill="currentColor" />
                        DIAMOND
                    </div>
                    {ad.advertiser?.views && ad.advertiser.views > 50000 && (
                        <span className="px-2 py-1 rounded-full bg-red-500/80 text-white text-[10px]">
                            🔥 HOT
                        </span>
                    )}
                </div>

                {/* Info Content (Bottom Aligned) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pt-10">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                        <p className="text-yellow-400 text-sm font-bold mb-1 flex items-center gap-2">
                            {ad.advertiser?.business_name || ad.advertiser?.nickname || '업체명'}
                            <ChevronRight size={14} />
                        </p>
                        <h3 className="text-xl font-bold text-white mb-3 leading-snug shadow-black drop-shadow-lg">
                            {ad.title}
                        </h3>

                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <DollarSign size={14} className="text-yellow-400" />
                                <span className="font-semibold text-white">{ad.pay || ad.recruitment?.salary || '협의'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <MapPin size={14} className="text-yellow-400" />
                                <span>{ad.location || ad.advertiser?.work_location || '위치 정보 없음'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Eye size={14} className="text-yellow-400" />
                                <span>조회수 {(ad.advertiser?.views || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const DiamondAdSection: React.FC = () => {
    if (diamondAds.length === 0) return null;

    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30">
                        <Star size={18} className="text-yellow-400" fill="currentColor" />
                        <span className="text-yellow-400 font-bold">PREMIUM DIA</span>
                    </div>
                    <span className="text-text-muted text-sm hidden sm:inline">상위 1% 고수익 보장 업소</span>
                </div>
                <Link to="/theme" className="text-sm text-text-muted hover:text-white transition-colors">
                    더보기 +
                </Link>
            </div>

            {/* Diamond Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {diamondAds.map((ad) => (
                    <DiamondAdCard key={ad.id} ad={ad} />
                ))}
            </div>

            {/* CSS for Aurora Animation */}
            <style>{`
                .diamond-card {
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
                }
                
                .diamond-card:hover {
                    box-shadow: 0 20px 40px -10px rgba(234, 179, 8, 0.3);
                }
                
                .aurora-shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(251, 191, 36, 0.4) 25%,
                        rgba(255, 255, 255, 0.6) 50%,
                        rgba(251, 191, 36, 0.4) 75%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: aurora-wave 3s ease-in-out infinite;
                }
                
                @keyframes aurora-wave {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </section>
    );
};

export default DiamondAdSection;

