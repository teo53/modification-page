import React, { useState } from 'react';
import { Star, Coffee, Clock, Calendar, DollarSign, Heart, Music, GlassWater } from 'lucide-react';
import AdCard from '../components/ui/AdCard';

const themes = [
    { id: 'high-pay', name: '고소득', icon: DollarSign, color: 'text-yellow-400' },
    { id: 'same-day', name: '당일지급', icon: Clock, color: 'text-blue-400' },
    { id: 'weekend', name: '주말알바', icon: Calendar, color: 'text-green-400' },
    { id: 'beginner', name: '초보환영', icon: Heart, color: 'text-pink-400' },
    { id: 'no-alcohol', name: '술강요X', icon: GlassWater, color: 'text-cyan-400' },
    { id: 'karaoke', name: '노래방', icon: Music, color: 'text-purple-400' },
    { id: 'cafe', name: '카페/바', icon: Coffee, color: 'text-orange-400' },
    { id: 'vip', name: 'VIP접대', icon: Star, color: 'text-red-400' },
];

const ThemePage: React.FC = () => {
    const [activeTheme, setActiveTheme] = useState('high-pay');

    // Mock data
    const results = Array(24).fill(null).map((_, i) => ({
        id: i + 1,
        title: `테마별 추천 업소 ${i + 1}호점`,
        location: '서울 강남구',
        pay: '시급 80,000원',
        image: `https://images.unsplash.com/photo-${1560000000000 + i}?q=80&w=800&auto=format&fit=crop`,
        badges: ['테마추천', '검증업소'],
        isNew: i < 5,
        isHot: i < 2,
        variant: i < 6 ? 'special' as const : 'regular' as const
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">테마별 알바</h1>
                <p className="text-text-muted">원하는 조건의 일자리를 테마별로 쉽고 빠르게 찾아보세요.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-accent/50 rounded-xl border border-white/5 p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">12</div>
                    <div className="text-sm text-text-muted">테마 카테고리</div>
                </div>
                <div className="bg-accent/50 rounded-xl border border-white/5 p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">850+</div>
                    <div className="text-sm text-text-muted">등록업소</div>
                </div>
                <div className="bg-accent/50 rounded-xl border border-white/5 p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">95%</div>
                    <div className="text-sm text-text-muted">만족도</div>
                </div>
                <div className="bg-accent/50 rounded-xl border border-white/5 p-6 text-center">
                    <div className="text-xl md:text-2xl font-bold text-red-400 mb-2">실시간</div>
                    <div className="text-sm text-text-muted">업데이트</div>
                </div>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {themes.map((theme) => {
                    const Icon = theme.icon;
                    const isActive = activeTheme === theme.id;
                    return (
                        <button
                            key={theme.id}
                            onClick={() => setActiveTheme(theme.id)}
                            className={`
                                p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3
                                ${isActive
                                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'bg-accent border-white/5 hover:border-white/20 hover:bg-white/5'
                                }
                            `}
                        >
                            <div className={`p-3 rounded-full bg-black/30 ${theme.color}`}>
                                <Icon size={24} />
                            </div>
                            <span className={`font-bold ${isActive ? 'text-primary' : 'text-white'}`}>
                                {theme.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Results */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-primary">#{themes.find(t => t.id === activeTheme)?.name}</span>
                    <span className="text-text-muted font-normal text-base">추천 리스트</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((ad) => (
                        <AdCard key={ad.id} {...ad} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemePage;
