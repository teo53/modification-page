import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Coffee, Clock, Calendar, DollarSign, Heart, Music, GlassWater, Home, Sparkles, Users, Shield, Zap, Gift } from 'lucide-react';
import AdCard from '../components/ad/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import { allAds } from '../data/mockAds';

// 테마 카테고리 정의 (키워드 기반 필터링)
const themes = [
    { id: 'high-pay', name: '고소득', icon: DollarSign, color: 'text-yellow-400', keywords: ['VIP', '고수입', '100,000', '120,000'] },
    { id: 'same-day', name: '당일지급', icon: Clock, color: 'text-blue-400', keywords: ['당일지급', '당일'] },
    { id: 'short', name: '단기알바', icon: Calendar, color: 'text-green-400', keywords: ['단기', '주말', '토요일', '일요일', '1일'] },
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
    const { category } = useParams<{ category: string }>();
    const [activeThemes, setActiveThemes] = useState<string[]>(['high-pay']);
    const [sortOrder, setSortOrder] = useState('latest');
    const [displayCount, setDisplayCount] = useState(24);

    // Read URL category parameter on mount
    useEffect(() => {
        if (category) {
            const matchedTheme = themes.find(t => t.id === category);
            if (matchedTheme) {
                setActiveThemes([category]);
            }
        }
    }, [category]);

    // Toggle theme selection (multi-select support)
    const toggleTheme = (themeId: string) => {
        setActiveThemes(prev => {
            if (prev.includes(themeId)) {
                // Remove if already selected (but keep at least one)
                const newThemes = prev.filter(t => t !== themeId);
                return newThemes.length > 0 ? newThemes : prev;
            } else {
                // Add to selection
                return [...prev, themeId];
            }
        });
    };

    // 필터링된 광고 목록 (multi-select: must match ALL selected themes)
    const filteredAds = useMemo(() => {
        let results = [...allAds];

        // 테마 필터 - must match ALL selected themes
        if (activeThemes.length > 0) {
            results = results.filter(ad => {
                return activeThemes.every(themeId => {
                    const theme = themes.find(t => t.id === themeId);
                    if (!theme) return true;
                    return theme.keywords.some(keyword =>
                        ad.title.toLowerCase().includes(keyword.toLowerCase()) ||
                        ad.badges.some(badge => badge.toLowerCase().includes(keyword.toLowerCase())) ||
                        ad.pay.includes(keyword)
                    );
                });
            });
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
    }, [activeThemes, sortOrder]);

    const activeThemeNames = activeThemes.map(id => themes.find(t => t.id === id)?.name).filter(Boolean);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* 헤더 */}
            <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-text-main mb-2">테마별 알바</h1>
                <p className="text-xs text-text-muted">원하는 조건의 일자리를 쉽고 빠르게 찾아보세요</p>
            </div>

            {/* 통계 카드 - 컴팩트 버전 */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                <div className="bg-card rounded-lg border border-border p-2 text-center">
                    <Sparkles className="text-primary w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-bold text-text-main">{themes.length}</div>
                    <div className="text-[10px] text-text-muted">테마</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-2 text-center">
                    <Gift className="text-green-400 w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-400">{allAds.length}+</div>
                    <div className="text-[10px] text-text-muted">업소</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-2 text-center">
                    <Star className="text-yellow-400 w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-bold text-yellow-400">95%</div>
                    <div className="text-[10px] text-text-muted">만족도</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-2 text-center">
                    <Zap className="text-red-400 w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-bold text-red-400 animate-pulse">실시간</div>
                    <div className="text-[10px] text-text-muted">업데이트</div>
                </div>
            </div>

            {/* 테마 그리드 */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-text-main">테마 선택</h2>
                    <span className="text-xs text-text-muted">복수 선택 가능</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isActive = activeThemes.includes(theme.id);
                        return (
                            <button
                                key={theme.id}
                                onClick={() => toggleTheme(theme.id)}
                                className={`
                                    p-2 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1
                                    ${isActive
                                        ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(255,107,53,0.2)]'
                                        : 'bg-card border-border hover:border-primary/30'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-full bg-surface ${theme.color}`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`font-bold text-[11px] leading-tight text-center whitespace-nowrap ${isActive ? 'text-primary' : 'text-text-main'}`}>
                                    {theme.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 결과 목록 */}
            <div className="mb-8">
                <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-text-main">
                            추천 리스트 <span className="text-primary">({filteredAds.length}건)</span>
                        </h2>
                        <SelectionGroup
                            options={SORT_OPTIONS}
                            value={sortOrder}
                            onChange={setSortOrder}
                        />
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {activeThemeNames.map((name, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                #{name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
