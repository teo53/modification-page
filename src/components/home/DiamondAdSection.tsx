import React from 'react';
import { MapPin, Clock, DollarSign, Star, ChevronRight } from 'lucide-react';

interface DiamondAd {
    id: string;
    businessName: string;
    title: string;
    location: string;
    salary: string;
    workHours: string;
    imageUrl?: string;
    tags?: string[];
}

// Sample Diamond ads data
const diamondAds: DiamondAd[] = [
    {
        id: 'diamond-1',
        businessName: '강남 프레스티지',
        title: 'VIP 룸살롱 정규직/알바 모집',
        location: '강남역 5번출구',
        salary: '일 100만~200만',
        workHours: '저녁 7시~새벽 3시',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60',
        tags: ['고수익', '당일지급', '숙소제공']
    },
    {
        id: 'diamond-2',
        businessName: '청담 엘리트',
        title: '하이엔드 클럽 신규 오픈 멤버',
        location: '청담동 명품거리',
        salary: '일 80만~150만',
        workHours: '저녁 8시~새벽 4시',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=60',
        tags: ['신규오픈', '텃세없음', '초보환영']
    },
    {
        id: 'diamond-3',
        businessName: '압구정 로얄',
        title: '프리미엄 라운지 스탭 모집',
        location: '압구정역 3번출구',
        salary: '일 70만~120만',
        workHours: '저녁 7시~새벽 2시',
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=60',
        tags: ['주말알바', '대학생환영', '경력우대']
    },
];

const DiamondAdCard: React.FC<{ ad: DiamondAd }> = ({ ad }) => {
    return (
        <div className="diamond-card group relative h-80 overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10">
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
                        src={ad.imageUrl}
                        alt={ad.businessName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-black text-[10px] font-extrabold shadow-lg shadow-yellow-500/50 animate-pulse">
                        <Star size={10} fill="currentColor" />
                        DIAMOND
                    </div>
                    {ad.tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-black/50 border border-white/20 text-white text-[10px] backdrop-blur-sm">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Info Content (Bottom Aligned) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pt-10">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                        <p className="text-yellow-400 text-sm font-bold mb-1 flex items-center gap-2">
                            {ad.businessName} <ChevronRight size={14} />
                        </p>
                        <h3 className="text-xl font-bold text-white mb-3 leading-snug shadow-black drop-shadow-lg">
                            {ad.title}
                        </h3>

                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <DollarSign size={14} className="text-yellow-400" />
                                <span className="font-semibold text-white">{ad.salary}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <MapPin size={14} className="text-yellow-400" />
                                <span>{ad.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Clock size={14} className="text-yellow-400" />
                                <span>{ad.workHours}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DiamondAdSection: React.FC = () => {
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
                <button className="text-sm text-text-muted hover:text-white transition-colors">
                    더보기 +
                </button>
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
