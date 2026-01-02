import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Wine, Music, Mic2, Coffee, GlassWater, Sparkles, Building2, MoreHorizontal, Briefcase, TrendingUp, DollarSign, Search, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdCard from '../components/ad/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import { allAds } from '../data/mockAds';

// 숫자 카운트업 애니메이션 훅
const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // easeOutExpo 이징 함수
            const easeProgress = 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(startValue + (end - startValue) * easeProgress);

            if (countRef.current !== currentValue) {
                countRef.current = currentValue;
                setCount(currentValue);
            }

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [end, duration]);

    return count;
};

// 통계 카드 컴포넌트
interface StatCardProps {
    icon: LucideIcon;
    iconColor: string;
    value: number;
    suffix?: string;
    label: string;
    format?: (n: number) => string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, iconColor, value, suffix = '', label, format }) => {
    const animatedValue = useCountUp(value, 2000);
    const displayValue = format ? format(animatedValue) : animatedValue;

    return (
        <div className="bg-white rounded-xl border border-border p-8 text-center shadow-sm">
            <Icon className={`${iconColor} w-10 h-10 mx-auto mb-3`} />
            <div className="text-4xl font-bold text-text-main mb-2">
                {displayValue}{suffix}
            </div>
            <div className="text-sm text-text-muted">{label}</div>
        </div>
    );
};

// 업종 카테고리 정의
const industries = [
    { id: 'room-salon', name: '룸살롱', icon: Wine, color: 'text-pink-500', keywords: ['룸', '하이퍼블릭', '텐프로', '퍼블릭'] },
    { id: 'club', name: '클럽', icon: Music, color: 'text-purple-500', keywords: ['클럽', '라운지'] },
    { id: 'bar', name: '바(Bar)', icon: GlassWater, color: 'text-blue-500', keywords: ['바', '토킹바', '와인바'] },
    { id: 'karaoke', name: '노래방', icon: Mic2, color: 'text-yellow-500', keywords: ['노래방', '노래'] },
    { id: 'ten-cafe', name: '텐카페', icon: Coffee, color: 'text-amber-600', keywords: ['텐카페', '카페'] },
    { id: 'high-end', name: '쩜오/하이쩜오', icon: Sparkles, color: 'text-cyan-400', keywords: ['쩜오', '하이쩜오', 'VIP'] },
    { id: 'business', name: '비즈니스클럽', icon: Building2, color: 'text-indigo-500', keywords: ['비즈니스', '접대'] },
    { id: 'other', name: '기타', icon: MoreHorizontal, color: 'text-gray-400', keywords: ['기타', '일반'] },
];

// 지역 데이터
const regions = [
    { name: '서울', count: '320개', salary: '시급 90,000원', color: 'border-blue-500/30' },
    { name: '경기', count: '180개', salary: '시급 75,000원', color: 'border-green-500/30' },
    { name: '부산', count: '95개', salary: '시급 70,000원', color: 'border-purple-500/30' },
    { name: '인천', count: '65개', salary: '시급 68,000원', color: 'border-cyan-500/30' },
    { name: '대구', count: '45개', salary: '시급 65,000원', color: 'border-yellow-500/30' },
    { name: '대전', count: '35개', salary: '시급 62,000원', color: 'border-red-500/30' },
    { name: '광주', count: '30개', salary: '시급 60,000원', color: 'border-pink-500/30' },
    { name: '제주', count: '25개', salary: '시급 58,000원', color: 'border-orange-500/30' },
];

const SORT_OPTIONS = [
    { label: '최신순', value: 'latest' },
    { label: '급여높은순', value: 'pay' },
    { label: '인기순', value: 'popular' },
];

const IndustryPage: React.FC = () => {
    const [activeIndustry, setActiveIndustry] = useState('room-salon');
    const [activeRegion, setActiveRegion] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(16);

    // 필터링된 광고 목록
    const filteredAds = useMemo(() => {
        let results = [...allAds];

        // 업종 필터
        const industry = industries.find(i => i.id === activeIndustry);
        if (industry) {
            results = results.filter(ad =>
                industry.keywords.some(keyword =>
                    ad.title.toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }

        // 지역 필터
        if (activeRegion) {
            results = results.filter(ad => ad.location.includes(activeRegion));
        }

        // 검색어 필터
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(ad =>
                ad.title.toLowerCase().includes(query) ||
                ad.location.toLowerCase().includes(query)
            );
        }

        // 정렬
        if (sortOrder === 'pay') {
            results.sort((a, b) => {
                const aPay = parseInt(a.pay.replace(/[^0-9]/g, '')) || 0;
                const bPay = parseInt(b.pay.replace(/[^0-9]/g, '')) || 0;
                return bPay - aPay;
            });
        } else if (sortOrder === 'popular') {
            results.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
        }

        return results.length > 0 ? results : allAds.slice(0, 12);
    }, [activeIndustry, activeRegion, sortOrder, searchQuery]);

    // 실시간 통계
    const hotAdsCount = allAds.filter(a => a.isHot).length;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-text-main mb-4">업종별 채용 정보</h1>
                <p className="text-text-muted mb-6">전국 1,666개 업소에서 당신을 기다립니다</p>

                {/* 검색바 */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="업종명, 지역, 키워드로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-border rounded-lg py-3 pl-12 pr-4 text-text-main focus:border-primary outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                </div>
            </div>

            {/* 통계 카드 - 애니메이션 적용 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <StatCard
                    icon={Briefcase}
                    iconColor="text-yellow-400"
                    value={allAds.length}
                    label="총 채용공고"
                />
                <StatCard
                    icon={TrendingUp}
                    iconColor="text-red-400"
                    value={hotAdsCount}
                    suffix="건"
                    label="급구 채용"
                />
                <StatCard
                    icon={DollarSign}
                    iconColor="text-green-400"
                    value={90000}
                    suffix="원"
                    format={(n) => n.toLocaleString()}
                    label="평균 시급"
                />
            </div>

            {/* 지역 선택 카드 */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                    <MapPin className="text-primary" size={20} />
                    지역별 채용
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {regions.map((region) => (
                        <button
                            key={region.name}
                            onClick={() => setActiveRegion(activeRegion === region.name ? null : region.name)}
                            className={`p-4 rounded-xl border transition-all duration-300 text-center ${activeRegion === region.name
                                ? 'bg-primary/20 border-primary'
                                : `${region.color} bg-white hover:bg-surface`
                                }`}
                        >
                            <div className="text-lg font-bold text-text-main mb-1">{region.name}</div>
                            <div className="text-xs text-primary">{region.count}</div>
                            <div className="text-xs text-text-muted">{region.salary}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 업종 그리드 */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-text-main mb-4">업종 선택</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(255,107,53,0.2)]'
                                        : 'bg-white border-border hover:border-primary/30 hover:bg-surface'
                                    }
                                `}
                            >
                                <div className={`
                                    p-4 rounded-full bg-surface transition-transform duration-300 group-hover:scale-110
                                    ${industry.color}
                                `}>
                                    <Icon size={28} />
                                </div>
                                <span className={`font-bold text-lg ${isActive ? 'text-primary' : 'text-text-main'}`}>
                                    {industry.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 결과 목록 */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <span className="text-primary">#{industries.find(i => i.id === activeIndustry)?.name}</span>
                        <span className="text-text-muted font-normal text-base">
                            {activeRegion ? `${activeRegion} 지역` : '전체'} ({filteredAds.length}건)
                        </span>
                    </h2>
                    <SelectionGroup
                        options={SORT_OPTIONS}
                        value={sortOrder}
                        onChange={setSortOrder}
                    />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredAds.slice(0, displayCount).map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            title={ad.title}
                            location={ad.location}
                            pay={ad.pay}
                            image={ad.thumbnail}
                            badges={ad.badges}
                            isNew={ad.isNew}
                            isHot={ad.isHot}
                            variant={ad.productType === 'vip' ? 'vip' : ad.productType === 'special' ? 'special' : 'regular'}
                        />
                    ))}
                </div>

                {filteredAds.length > displayCount && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setDisplayCount(prev => Math.min(prev + 16, filteredAds.length))}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            더보기 ({filteredAds.length - displayCount}건)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndustryPage;
