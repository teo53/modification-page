import React from 'react';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';

interface DiamondAd {
    id: string;
    businessName: string;
    title: string;
    location: string;
    salary: string;
    workHours: string;
    logoUrl?: string;
}

// Sample Diamond ads data
const diamondAds: DiamondAd[] = [
    {
        id: 'diamond-1',
        businessName: '강남 프레스티지',
        title: '최고급 VIP 룸살롱 정규직 모집',
        location: '강남역 5번출구',
        salary: '일 100만~200만',
        workHours: '저녁 7시~새벽 3시',
    },
    {
        id: 'diamond-2',
        businessName: '청담 엘리트',
        title: '하이엔드 클럽 신규 오픈 급구',
        location: '청담동 명품거리',
        salary: '일 80만~150만',
        workHours: '저녁 8시~새벽 4시',
    },
    {
        id: 'diamond-3',
        businessName: '압구정 로얄',
        title: '프리미엄 라운지 즉시 출근',
        location: '압구정역 3번출구',
        salary: '일 70만~120만',
        workHours: '저녁 7시~새벽 2시',
    },
];

const DiamondAdCard: React.FC<{ ad: DiamondAd }> = ({ ad }) => {
    return (
        <div className="diamond-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10">
            {/* Aurora Border Effect */}
            <div className="aurora-border absolute inset-0 rounded-2xl p-[2px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 opacity-80" />
                <div className="aurora-shimmer absolute inset-0 rounded-2xl" />
            </div>

            {/* Card Content */}
            <div className="relative bg-gradient-to-br from-[#1a1520] via-[#1f1a28] to-[#151015] rounded-2xl m-[2px] p-5">
                {/* Diamond Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold shadow-lg shadow-yellow-500/30">
                    <Star size={12} fill="currentColor" />
                    DIAMOND
                </div>

                <div className="flex gap-4">
                    {/* Logo */}
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 flex items-center justify-center">
                        {ad.logoUrl ? (
                            <img src={ad.logoUrl} alt={ad.businessName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-yellow-400 text-2xl font-bold">{ad.businessName.charAt(0)}</div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-yellow-300 transition-colors">
                            {ad.title}
                        </h3>
                        <p className="text-yellow-400 font-medium mb-3">{ad.businessName}</p>

                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center gap-1 text-text-muted">
                                <MapPin size={14} className="text-yellow-400" />
                                {ad.location}
                            </span>
                            <span className="flex items-center gap-1 text-text-muted">
                                <DollarSign size={14} className="text-yellow-400" />
                                {ad.salary}
                            </span>
                            <span className="flex items-center gap-1 text-text-muted">
                                <Clock size={14} className="text-yellow-400" />
                                {ad.workHours}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-yellow-400/0 via-transparent to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </div>
    );
};

const DiamondAdSection: React.FC = () => {
    return (
        <section className="mb-10">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30">
                    <Star size={18} className="text-yellow-400" fill="currentColor" />
                    <span className="text-yellow-400 font-bold">DIAMOND</span>
                </div>
                <span className="text-text-muted text-sm">최상위 프리미엄 광고</span>
            </div>

            {/* Diamond Cards Grid */}
            <div className="grid md:grid-cols-3 gap-4">
                {diamondAds.map((ad) => (
                    <DiamondAdCard key={ad.id} ad={ad} />
                ))}
            </div>

            {/* CSS for Aurora Animation */}
            <style>{`
                .diamond-card {
                    box-shadow: 0 0 30px rgba(251, 191, 36, 0.15);
                }
                
                .diamond-card:hover {
                    box-shadow: 0 0 50px rgba(251, 191, 36, 0.25);
                }
                
                .aurora-shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(251, 191, 36, 0.4) 25%,
                        rgba(245, 158, 11, 0.6) 50%,
                        rgba(251, 191, 36, 0.4) 75%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: aurora-wave 3s ease-in-out infinite;
                }
                
                @keyframes aurora-wave {
                    0%, 100% {
                        background-position: 200% 0;
                        opacity: 0.3;
                    }
                    50% {
                        background-position: -200% 0;
                        opacity: 0.8;
                    }
                }
                
                .diamond-card:hover .aurora-shimmer {
                    animation-duration: 1.5s;
                }
            `}</style>
        </section>
    );
};

export default DiamondAdSection;
