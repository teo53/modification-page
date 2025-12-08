import React, { useState } from 'react';
import { Wine, Music, Mic2, Coffee, GlassWater, Sparkles, Building2, MoreHorizontal, Briefcase, TrendingUp, DollarSign, Search } from 'lucide-react';
import AdCard from '../components/ui/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';

const industries = [
    { id: 'room-salon', name: '룸살롱', icon: Wine, color: 'text-pink-500' },
    { id: 'club', name: '클럽', icon: Music, color: 'text-purple-500' },
    { id: 'bar', name: '바(Bar)', icon: GlassWater, color: 'text-blue-500' },
    { id: 'karaoke', name: '노래방', icon: Mic2, color: 'text-yellow-500' },
    { id: 'ten-cafe', name: '텐카페', icon: Coffee, color: 'text-amber-600' },
    { id: 'high-end', name: '쩜오/하이쩜오', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'business', name: '비즈니스클럽', icon: Building2, color: 'text-indigo-500' },
    { id: 'other', name: '기타', icon: MoreHorizontal, color: 'text-gray-400' },
];

const IndustryPage: React.FC = () => {
    const [activeIndustry, setActiveIndustry] = useState('room-salon');
    const [sortOrder, setSortOrder] = useState('latest');

    const SORT_OPTIONS = [
        { label: '최신순', value: 'latest' },
        { label: '급여높은순', value: 'pay' },
        { label: '인기순', value: 'popular' },
    ];

    // Mock data
    const results = Array(12).fill(null).map((_, i) => ({
        id: i + 1,
        title: `강남 상위 1% ${industries.find(ind => ind.id === activeIndustry)?.name} 채용`,
        location: '서울 강남구',
        pay: '월 1,000만원 이상',
        image: `https://images.unsplash.com/photo-${1570000000000 + i}?q=80&w=800&auto=format&fit=crop`,
        badges: ['업계최고대우', '당일지급'],
        isNew: i < 2,
        isHot: i === 0,
        variant: i < 4 ? 'vip' as const : 'regular' as const
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">지역별 채용 정보</h1>
                <p className="text-text-muted mb-6">전국 17개 지역, 1,666개 업소에서 당신을 기다립니다</p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="지역명, 업종, 키워드로 검색..."
                            className="w-full bg-accent border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-accent/50 rounded-xl border border-white/5 p-8 text-center">
                    <Briefcase className="text-yellow-400 w-10 h-10 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-2">1,666</div>
                    <div className="text-sm text-text-muted">총 업소</div>
                </div>
                <div className="bg-accent/50 rounded-xl border border-white/5 p-8 text-center">
                    <TrendingUp className="text-red-400 w-10 h-10 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-2">349건</div>
                    <div className="text-sm text-text-muted">급구 채용</div>
                </div>
                <div className="bg-accent/50 rounded-xl border border-white/5 p-8 text-center">
                    <DollarSign className="text-green-400 w-10 h-10 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-2">64,647원</div>
                    <div className="text-sm text-text-muted">평균 시급</div>
                </div>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
                <button className="px-4 py-2 bg-accent border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-colors">
                    전국보기
                </button>
                <button className="px-4 py-2 bg-accent border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-colors">
                    급구채용
                </button>
                <button className="px-4 py-2 bg-accent border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-colors">
                    축소채용
                </button>
            </div>

            {/* Region Selection Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                {[
                    { name: '서울', count: '420개', salary: '시급 90,000원', color: 'border-blue-500/30' },
                    { name: '경기', count: '280개', salary: '시급 75,000원', color: 'border-green-500/30' },
                    { name: '부산', count: '180개', salary: '시급 70,000원', color: 'border-purple-500/30' },
                    { name: '인천', count: '95개', salary: '시급 68,000원', color: 'border-cyan-500/30' },
                    { name: '대구', count: '65개', salary: '시급 65,000원', color: 'border-yellow-500/30' },
                ].map((region) => (
                    <button
                        key={region.name}
                        className={`p-6 rounded-xl border ${region.color} bg-accent/30 hover:bg-accent/50 transition-all duration-300 text-center group`}
                    >
                        <div className="w-4 h-4 mx-auto mb-2 rounded-full bg-primary"></div>
                        <div className="text-xl font-bold text-white mb-1">{region.name}</div>
                        <div className="text-sm text-primary mb-1">{region.count} 업소</div>
                        <div className="text-xs text-text-muted">{region.salary}</div>
                    </button>
                ))}
            </div>

            {/* Industry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {industries.map((industry) => {
                    const Icon = industry.icon;
                    const isActive = activeIndustry === industry.id;
                    return (
                        <button
                            key={industry.id}
                            onClick={() => setActiveIndustry(industry.id)}
                            className={`
                                p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group
                                ${isActive
                                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'bg-accent border-white/5 hover:border-white/20 hover:bg-white/5'
                                }
                            `}
                        >
                            <div className={`
                                p-4 rounded-full bg-black/30 transition-transform duration-300 group-hover:scale-110
                                ${industry.color}
                            `}>
                                <Icon size={28} />
                            </div>
                            <span className={`font-bold text-lg ${isActive ? 'text-primary' : 'text-white'}`}>
                                {industry.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Results */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-primary">#{industries.find(i => i.id === activeIndustry)?.name}</span>
                        <span className="text-text-muted font-normal text-base">인기 채용공고</span>
                    </h2>
                    <SelectionGroup
                        options={SORT_OPTIONS}
                        value={sortOrder}
                        onChange={setSortOrder}
                    />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((ad) => (
                        <AdCard key={ad.id} {...ad} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IndustryPage;
