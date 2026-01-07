import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Wine, Music, Mic2, Coffee, GlassWater, Sparkles, Building2, MoreHorizontal, Briefcase, TrendingUp, DollarSign, Search, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdCard from '../components/ad/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import { allAds } from '../data/mockAds';

// 숫자 카운트업 애니메이션 훅
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

            if (progress === 1) {
                setCount(end);
                return;
            }

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
        <div className="bg-accent/50 rounded-xl border border-white/5 p-8 text-center">
            <Icon className={`${iconColor} w-10 h-10 mx-auto mb-3`} />
            <div className="text-4xl font-bold text-white mb-2">
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
    { name: '서울', count: '0개', salary: '시급 90,000원', color: 'border-blue-500/30', subAreas: ['강남', '강북', '신촌', '홍대', '이태원', '압구정', '청담', '논현'] },
    { name: '경기', count: '0개', salary: '시급 75,000원', color: 'border-green-500/30', subAreas: ['수원', '성남', '용인', '부천', '안양', '고양', '의정부', '평택'] },
    { name: '인천', count: '0개', salary: '시급 68,000원', color: 'border-cyan-500/30', subAreas: ['부평', '구월', '송도', '연수', '남동', '계양'] },
    { name: '부산', count: '0개', salary: '시급 70,000원', color: 'border-purple-500/30', subAreas: ['해운대', '서면', '남포동', '센텀시티', '광안리'] },
    { name: '대구', count: '0개', salary: '시급 65,000원', color: 'border-yellow-500/30', subAreas: ['동성로', '수성구', '달서구', '북구'] },
    { name: '대전', count: '0개', salary: '시급 62,000원', color: 'border-red-500/30', subAreas: ['둔산', '유성', '대덕구', '중구'] },
    { name: '광주', count: '0개', salary: '시급 60,000원', color: 'border-pink-500/30', subAreas: ['상무', '충장로', '광산구', '북구'] },
    { name: '울산', count: '0개', salary: '시급 65,000원', color: 'border-teal-500/30', subAreas: ['삼산', '성남', '무거'] },
    { name: '세종', count: '0개', salary: '시급 63,000원', color: 'border-indigo-500/30', subAreas: ['나성', '도담', '어진'] },
    { name: '강원', count: '0개', salary: '시급 58,000원', color: 'border-lime-500/30', subAreas: ['춘천', '원주', '강릉', '속초'] },
    { name: '충청', count: '0개', salary: '시급 60,000원', color: 'border-amber-500/30', subAreas: ['청주', '천안', '아산', '충주'] },
    { name: '전라', count: '0개', salary: '시급 58,000원', color: 'border-emerald-500/30', subAreas: ['전주', '목포', '여수', '익산'] },
    { name: '경상', count: '0개', salary: '시급 62,000원', color: 'border-fuchsia-500/30', subAreas: ['창원', '포항', '구미', '김해'] },
    { name: '제주', count: '0개', salary: '시급 58,000원', color: 'border-orange-500/30', subAreas: ['제주시', '서귀포', '애월', '중문'] },
    { name: '기타', count: '0개', salary: '시급 0원', color: 'border-gray-500/30', subAreas: [] },
];

const SORT_OPTIONS = [
    { label: '최신순', value: 'latest' },
    { label: '급여높은순', value: 'pay' },
    { label: '인기순', value: 'popular' },
];

const IndustryPage: React.FC = () => {
    // 광고주 등록 데이터도 함께 가져오기
    const userAdsRaw = JSON.parse(localStorage.getItem('lunaalba_user_ads') || '[]');
    const userAds = userAdsRaw
        .filter((ad: any) => ad.status === 'active')
        .map((ad: any) => ({
            id: parseInt(ad.id),
            title: ad.title,
            location: ad.location,
            pay: ad.salary,
            thumbnail: '',
            images: [],
            badges: ad.themes || ['채용중'],
            isNew: true,
            isHot: false,
            productType: ad.productType || 'general',
            price: '협의',
            duration: '30일',
            industry: ad.industry || ''
        }));

    const adsData = [...userAds, ...allAds];

    // 각 지역별 실제 공고 개수 계산 (중복 집계 방지)
    const regionCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};

        // 초기화
        regions.forEach(r => counts[r.name] = 0);

        adsData.forEach(ad => {
            // Find the FIRST matching region to avoid double counting
            const matchedRegion = regions.find(region => {
                if (region.name === '기타') return false; // Skip 'other' in initial check

                // Check main name
                if (ad.location.includes(region.name)) return true;

                // Check specific province mapping
                if (region.name === '충청' && (ad.location.includes('충남') || ad.location.includes('충북') || ad.location.includes('충청'))) return true;
                if (region.name === '전라' && (ad.location.includes('전남') || ad.location.includes('전북') || ad.location.includes('전라'))) return true;
                if (region.name === '경상' && (ad.location.includes('경남') || ad.location.includes('경북') || ad.location.includes('경상'))) return true;

                // Check subAreas
                if (region.subAreas && region.subAreas.some(area => ad.location.includes(area))) return true;

                return false;
            });

            if (matchedRegion) {
                counts[matchedRegion.name] = (counts[matchedRegion.name] || 0) + 1;
            } else {
                counts['기타'] = (counts['기타'] || 0) + 1;
            }
        });

        return counts;
    }, [adsData]);

    const [activeIndustry, setActiveIndustry] = useState('room-salon');
    const [activeRegion, setActiveRegion] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(16);

    // 필터링된 광고 목록
    const filteredAds = useMemo(() => {
        let results = [...adsData];

        // 업종 필터
        const industry = industries.find(i => i.id === activeIndustry);
        if (industry) {
            results = results.filter(ad =>
                // 키워드 기반 검색 (기존)
                industry.keywords.some(keyword =>
                    ad.title.toLowerCase().includes(keyword.toLowerCase())
                ) ||
                // industry 필드 기반 검색 (신규 - UserAd용)
                (ad.industry && industry.keywords.some(keyword =>
                    ad.industry.toLowerCase().includes(keyword.toLowerCase())
                ))
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

        return results.length > 0 ? results : adsData.slice(0, 12);
    }, [activeIndustry, activeRegion, sortOrder, searchQuery, adsData]);

    // 실시간 통계
    const hotAdsCount = adsData.filter(a => a.isHot).length;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">업종별 채용 정보</h1>
                <p className="text-text-muted mb-6">전국 {adsData.length.toLocaleString()}개 업소에서 당신을 기다립니다</p>

                {/* 검색바 */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="업종명, 지역, 키워드로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-accent border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
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
                    value={adsData.length}
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
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
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
                                : `${region.color} bg-accent/30 hover:bg-accent/50`
                                }`}
                        >
                            <div className="text-lg font-bold text-white mb-1">{region.name}</div>
                            <div className="text-xs text-primary">{regionCounts[region.name] || 0}개</div>
                            <div className="text-xs text-text-muted">{region.salary}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 업종 그리드 */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4">업종 선택</h2>
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
            </div>

            {/* 결과 목록 */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
                            className="px-8 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
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
