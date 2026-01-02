import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Star, Coffee, Clock, Calendar, DollarSign, Heart, Music, GlassWater, Home, Sparkles, Users, Shield, Zap, Gift } from 'lucide-react';
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
    textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, iconColor, value, suffix = '', label, textColor = 'text-text-main' }) => {
    const animatedValue = useCountUp(value, 2000);

    return (
        <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
            <Icon className={`${iconColor} w-8 h-8 mx-auto mb-2`} />
            <div className={`text-3xl md:text-4xl font-bold ${textColor} mb-2`}>
                {animatedValue}{suffix}
            </div>
            <div className="text-sm text-text-muted">{label}</div>
        </div>
    );
};

// 테마 카테고리 정의 (키워드 기반 필터링)
const themes = [
    { id: 'high-pay', name: '고소득', icon: DollarSign, color: 'text-yellow-400', keywords: ['VIP', '고수입', '100,000', '120,000'] },
    { id: 'same-day', name: '당일지급', icon: Clock, color: 'text-blue-400', keywords: ['당일지급', '당일'] },
    { id: 'weekend', name: '주말알바', icon: Calendar, color: 'text-green-400', keywords: ['주말', '토요일', '일요일'] },
    { id: 'beginner', name: '초보환영', icon: Heart, color: 'text-pink-400', keywords: ['초보환영', '초보가능', '초보', '신입환영'] },
    { id: 'lodging', name: '숙소제공', icon: Home, color: 'text-purple-400', keywords: ['숙소지원', '숙소제공', '숙소'] },
    { id: 'no-alcohol', name: '술강요X', icon: GlassWater, color: 'text-cyan-400', keywords: ['술강요없음', '술X'] },
    { id: 'karaoke', name: '노래방', icon: Music, color: 'text-orange-400', keywords: ['노래방', '노래'] },
    { id: 'cafe', name: '카페/바', icon: Coffee, color: 'text-amber-400', keywords: ['카페', '바', 'Bar'] },
    { id: 'vip', name: 'VIP접대', icon: Star, color: 'text-red-400', keywords: ['VIP', '하이퍼블릭', '텐프로'] },
    { id: 'flexible', name: '유연근무', icon: Zap, color: 'text-lime-400', keywords: ['유연근무', '시간협의'] },
    { id: 'team', name: '팀모집', icon: Users, color: 'text-indigo-400', keywords: ['팀', '단체'] },
    { id: 'verified', name: '검증업소', icon: Shield, color: 'text-emerald-400', keywords: ['검증', '인증'] },
];

const SORT_OPTIONS = [
    { label: '최신순', value: 'latest' },
    { label: '급여높은순', value: 'pay' },
    { label: '인기순', value: 'popular' },
];

const ThemePage: React.FC = () => {
    const [activeTheme, setActiveTheme] = useState('high-pay');
    const [sortOrder, setSortOrder] = useState('latest');
    const [displayCount, setDisplayCount] = useState(24);

    // 필터링된 광고 목록
    const filteredAds = useMemo(() => {
        let results = [...allAds];

        // 테마 필터
        const theme = themes.find(t => t.id === activeTheme);
        if (theme) {
            results = results.filter(ad =>
                theme.keywords.some(keyword =>
                    ad.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    ad.badges.some(badge => badge.toLowerCase().includes(keyword.toLowerCase())) ||
                    ad.pay.includes(keyword)
                )
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

        // 결과가 없으면 기본 데이터 반환
        return results.length > 0 ? results : allAds.slice(0, 12);
    }, [activeTheme, sortOrder]);

    const activeThemeData = themes.find(t => t.id === activeTheme);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-text-main mb-4">테마별 알바</h1>
                <p className="text-text-muted">원하는 조건의 일자리를 테마별로 쉽고 빠르게 찾아보세요.</p>
            </div>

            {/* 통계 카드 - 애니메이션 적용 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatCard
                    icon={Sparkles}
                    iconColor="text-primary"
                    value={themes.length}
                    label="테마 카테고리"
                />
                <StatCard
                    icon={Gift}
                    iconColor="text-green-400"
                    value={allAds.length}
                    suffix="+"
                    label="등록업소"
                    textColor="text-green-400"
                />
                <StatCard
                    icon={Star}
                    iconColor="text-yellow-400"
                    value={95}
                    suffix="%"
                    label="만족도"
                    textColor="text-yellow-400"
                />
                <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
                    <Zap className="text-red-400 w-8 h-8 mx-auto mb-2" />
                    <div className="text-xl md:text-2xl font-bold text-red-400 mb-2 animate-pulse">실시간</div>
                    <div className="text-sm text-text-muted">업데이트</div>
                </div>
            </div>

            {/* 테마 그리드 */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-text-main mb-4">테마 선택</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isActive = activeTheme === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setActiveTheme(theme.id)}
                                className={`
                                    p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2
                                    ${isActive
                                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(255,107,53,0.2)]'
                                        : 'bg-card border-border hover:border-primary/30 hover:bg-surface'
                                    }
                                `}
                            >
                                <div className={`p-3 rounded-full bg-surface ${theme.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-text-main'}`}>
                                    {theme.name}
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
                        <span className="text-primary">#{activeThemeData?.name}</span>
                        <span className="text-text-muted font-normal text-base">
                            추천 리스트 ({filteredAds.length}건)
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
                            onClick={() => setDisplayCount(prev => Math.min(prev + 12, filteredAds.length))}
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

export default ThemePage;
