import React from 'react';
import { Siren, Clock, Zap } from 'lucide-react';
import AdCard from '../components/ui/AdCard';

const UrgentPage: React.FC = () => {
    // Mock data for urgent ads
    const urgentAds = Array(24).fill(null).map((_, i) => ({
        id: i + 1,
        title: `급구! 오늘 바로 출근 가능하신 분 ${i + 1}`,
        location: '서울 전지역',
        pay: '일급 500,000원',
        image: `https://images.unsplash.com/photo-${1550000000000 + i}?q=80&w=800&auto=format&fit=crop`,
        badges: ['당일지급', '급구', '교통비지원'],
        isNew: true,
        isHot: i < 8,
        variant: i < 8 ? 'vip' as const : i < 16 ? 'special' as const : 'regular' as const
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-12 bg-gradient-to-r from-red-900/20 to-transparent p-8 rounded-2xl border border-red-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Siren size={200} className="text-red-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center gap-2">
                            <Zap size={14} fill="currentColor" />
                            긴급모집
                        </span>
                        <span className="text-red-400 font-medium flex items-center gap-1">
                            <Clock size={16} />
                            실시간 업데이트
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        오늘의 <span className="text-red-500">급구</span> 알바
                    </h1>
                    <p className="text-gray-300 max-w-2xl">
                        사장님들이 급하게 찾고 계신 일자리입니다.
                        지금 지원하면 채용 확률 200%! 망설이지 말고 지원해보세요.
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                {['전체', '강남구', '서초구', '송파구', '영등포구', '마포구'].map((region, i) => (
                    <button
                        key={region}
                        className={`
                            px-4 py-2 rounded-full whitespace-nowrap transition-colors
                            ${i === 0
                                ? 'bg-red-600 text-white font-bold'
                                : 'bg-accent text-text-muted hover:text-white hover:bg-white/10'
                            }
                        `}
                    >
                        {region}
                    </button>
                ))}
            </div>

            {/* Ad Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {urgentAds.map((ad) => (
                    <AdCard key={ad.id} {...ad} />
                ))}
            </div>
        </div>
    );
};

export default UrgentPage;
