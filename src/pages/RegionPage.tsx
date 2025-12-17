import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Navigation, Building2, TrendingUp, DollarSign, Search, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdCard from '../components/ad/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import { allAds } from '../data/mockAds';
import { allSampleAds } from '../data/sampleAds';
import { useDataMode } from '../contexts/DataModeContext';

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
        <div className="bg-accent/50 rounded-xl border border-white/5 p-8 text-center">
            <Icon className={`${iconColor} w-10 h-10 mx-auto mb-3`} />
            <div className="text-4xl font-bold text-white mb-2">
                {displayValue}{suffix}
            </div>
            <div className="text-sm text-text-muted">{label}</div>
        </div>
    );
};

// 지역 데이터 정의
const regions = [
    {
        id: 'seoul',
        name: '서울',
        icon: Building2,
        color: 'text-blue-500',
        subAreas: ['강남', '강북', '신촌', '홍대', '이태원', '압구정', '청담', '논현'],
        count: 320,
        avgSalary: '90,000원'
    },
    {
        id: 'gyeonggi',
        name: '경기',
        icon: Navigation,
        color: 'text-green-500',
        subAreas: ['수원', '성남', '용인', '부천', '안양', '고양', '의정부', '평택'],
        count: 180,
        avgSalary: '75,000원'
    },
    {
        id: 'incheon',
        name: '인천',
        icon: MapPin,
        color: 'text-cyan-500',
        subAreas: ['부평', '구월', '송도', '연수', '남동', '계양'],
        count: 65,
        avgSalary: '68,000원'
    },
    {
        id: 'busan',
        name: '부산',
        icon: MapPin,
        color: 'text-purple-500',
        subAreas: ['해운대', '서면', '남포동', '센텀시티', '광안리'],
        count: 95,
        avgSalary: '70,000원'
    },
    {
        id: 'daegu',
        name: '대구',
        icon: MapPin,
        color: 'text-yellow-500',
        subAreas: ['동성로', '수성구', '달서구', '북구'],
        count: 45,
        avgSalary: '65,000원'
    },
    {
        id: 'daejeon',
        name: '대전',
        icon: MapPin,
        color: 'text-red-500',
        subAreas: ['둔산', '유성', '대덕구', '중구'],
        count: 35,
        avgSalary: '62,000원'
    },
    {
        id: 'gwangju',
        name: '광주',
        icon: MapPin,
        color: 'text-pink-500',
        subAreas: ['상무', '충장로', '광산구', '북구'],
        count: 30,
        avgSalary: '60,000원'
    },
    {
        id: 'jeju',
        name: '제주',
        icon: MapPin,
        color: 'text-orange-500',
        subAreas: ['제주시', '서귀포', '애월', '중문'],
        count: 25,
        avgSalary: '58,000원'
    },
];

const SORT_OPTIONS = [
    { label: '최신순', value: 'latest' },
    { label: '급여높은순', value: 'pay' },
    { label: '인기순', value: 'popular' },
];

const RegionPage: React.FC = () => {
    const { useSampleData } = useDataMode();
    const adsData = useSampleData ? allSampleAds : allAds;

    const [activeRegion, setActiveRegion] = useState('seoul');
    const [activeSubArea, setActiveSubArea] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(16);

    // 현재 선택된 지역 정보
    const currentRegion = regions.find(r => r.id === activeRegion);

    // 필터링된 광고 목록
    const filteredAds = useMemo(() => {
        let results = [...adsData];

        // 지역 필터
        if (currentRegion) {
            results = results.filter(ad =>
                ad.location.includes(currentRegion.name) ||
                currentRegion.subAreas.some(area => ad.location.includes(area))
            );
        }

        // 세부 지역 필터
        if (activeSubArea) {
            results = results.filter(ad => ad.location.includes(activeSubArea));
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

        // 결과가 없으면 전체 광고에서 랜덤하게 표시
        return results.length > 0 ? results : adsData.slice(0, 12);
    }, [activeRegion, activeSubArea, sortOrder, searchQuery, currentRegion, adsData]);

    // 실시간 통계
    const totalAds = adsData.length;
    const hotAdsCount = adsData.filter(a => a.isHot).length;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-white">지역별 채용 정보</h1>
                    {useSampleData && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">샘플</span>
                    )}
                </div>
                <p className="text-text-muted mb-6">전국 각 지역의 채용 정보를 한눈에 확인하세요</p>

                {/* 검색바 */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="지역명, 업소명, 키워드로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-accent border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <StatCard
                    icon={Briefcase}
                    iconColor="text-yellow-400"
                    value={totalAds}
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

            {/* 지역 선택 그리드 */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="text-primary" size={20} />
                    지역 선택
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {regions.map((region) => {
                        const Icon = region.icon;
                        const isActive = activeRegion === region.id;
                        return (
                            <button
                                key={region.id}
                                onClick={() => {
                                    setActiveRegion(region.id);
                                    setActiveSubArea(null);
                                }}
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
                                    ${region.color}
                                `}>
                                    <Icon size={28} />
                                </div>
                                <span className={`font-bold text-lg ${isActive ? 'text-primary' : 'text-white'}`}>
                                    {region.name}
                                </span>
                                <div className="text-sm text-text-muted">
                                    <span className="text-primary">{region.count}개</span> 공고
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 세부 지역 선택 */}
            {currentRegion && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-3">
                        {currentRegion.name} 세부 지역
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveSubArea(null)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${!activeSubArea
                                ? 'bg-primary text-black font-bold'
                                : 'bg-accent text-text-muted hover:text-white border border-white/10'
                                }`}
                        >
                            전체
                        </button>
                        {currentRegion.subAreas.map((area) => (
                            <button
                                key={area}
                                onClick={() => setActiveSubArea(area)}
                                className={`px-4 py-2 rounded-full text-sm transition-colors ${activeSubArea === area
                                    ? 'bg-primary text-black font-bold'
                                    : 'bg-accent text-text-muted hover:text-white border border-white/10'
                                    }`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 결과 목록 */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-primary">#{currentRegion?.name}</span>
                        <span className="text-text-muted font-normal text-base">
                            {activeSubArea ? `${activeSubArea} 지역` : '전체'} ({filteredAds.length}건)
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

export default RegionPage;
