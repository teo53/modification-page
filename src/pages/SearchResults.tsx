import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import AdCard from '../components/ad/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import HorizontalFilterBar from '../components/ui/HorizontalFilterBar';
import { allAds } from '../data/mockAds';
import { USE_API_ADS, fetchAdsFromApi } from '../utils/adStorage';

const SearchResults: React.FC = () => {
    const [sortOrder, setSortOrder] = useState('latest');
    const [displayCount, setDisplayCount] = useState(12);
    const [searchQuery, setSearchQuery] = useState('강남');
    const [apiAds, setApiAds] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        region: 'all',
        industry: 'all',
        salary: 'all',
        type: 'all'
    });

    // API에서 광고 데이터 로드
    useEffect(() => {
        const loadApiAds = async () => {
            if (USE_API_ADS) {
                try {
                    const response = await fetchAdsFromApi();
                    const data = response?.ads || [];
                    if (data.length > 0) {
                        setApiAds(data.map((ad: any) => ({
                            id: ad.id,
                            title: ad.title,
                            location: ad.location || ad.region || '',
                            pay: ad.salary || '협의',
                            thumbnail: ad.thumbnail || '',
                            images: ad.images || [],
                            badges: ad.themes || [],
                            isNew: true,
                            isHot: ad.productType === 'vip',
                            productType: ad.productType || 'general',
                            industry: ad.industry || ''
                        })));
                    }
                } catch (error) {
                    console.warn('API fetch failed for search, using local data');
                }
            }
        };
        loadApiAds();
    }, []);

    const SORT_OPTIONS = [
        { label: '최신순', value: 'latest' },
        { label: '급여높은순', value: 'pay' },
        { label: '인기순', value: 'popular' },
    ];

    // 광고주 등록 데이터 가져오기 (useMemo 밖으로 이동)
    const userAdsRaw = JSON.parse(localStorage.getItem('lunaalba_user_ads') || '[]');
    const userAds = useMemo(() => userAdsRaw
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
        })), [userAdsRaw]); // userAdsRaw는 렌더링마다 바뀌므로 useMemo로 감싸는게 좋음 (다만 localStorage.getItem은 사이드이펙트라 컴포넌트 내부 변수로 선언 시 매번 실행됨. 여기선 간단히 처리)

    // 필터링 및 정렬된 광고 목록
    const filteredAds = useMemo(() => {
        // API 광고 + 로컬 사용자 광고 + 목업 광고 병합
        let results = [...apiAds, ...userAds, ...allAds];

        // 검색어 필터
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(ad =>
                ad.title.toLowerCase().includes(query) ||
                ad.location.toLowerCase().includes(query)
            );
        }

        // 지역 필터
        if (filters.region !== 'all') {
            const regionMap: { [key: string]: string } = {
                'seoul': '서울',
                'gyeonggi': '경기',
                'incheon': '인천',
                'busan': '부산',
                'daegu': '대구',
                'gwangju': '광주',
                'daejeon': '대전'
            };
            const regionName = regionMap[filters.region];
            if (regionName) {
                results = results.filter(ad => ad.location.includes(regionName));
            }
        }

        // 업종 필터
        if (filters.industry !== 'all') {
            const industryKeywords: { [key: string]: string[] } = {
                'room-salon': ['룸', '하이퍼블릭', '텐프로'],
                'club': ['클럽', '라운지'],
                'bar': ['바', 'Bar'],
                'karaoke': ['노래방'],
                'ten-cafe': ['텐카페', '카페'],
                'massage': ['마사지'],
                'other': ['기타']
            };
            const keywords = industryKeywords[filters.industry] || [];
            if (keywords.length > 0) {
                results = results.filter(ad =>
                    keywords.some(kw => ad.title.toLowerCase().includes(kw.toLowerCase()))
                );
            }
        }

        // 급여 필터
        if (filters.salary !== 'all') {
            const minSalary = parseInt(filters.salary);
            results = results.filter(ad => {
                const payNum = parseInt(ad.pay.replace(/[^0-9]/g, '')) || 0;
                return payNum >= minSalary;
            });
        }

        // 조건 필터
        if (filters.type !== 'all') {
            switch (filters.type) {
                case 'urgent':
                    results = results.filter(ad => ad.isHot);
                    break;
                case 'beginner':
                    results = results.filter(ad =>
                        ad.badges.some((b: string) => b.includes('초보'))
                    );
                    break;
                case 'high-pay':
                    results = results.filter(ad => {
                        const payNum = parseInt(ad.pay.replace(/[^0-9]/g, '')) || 0;
                        return payNum >= 100000;
                    });
                    break;
                case 'same-day':
                    results = results.filter(ad =>
                        ad.badges.some((b: string) => b.includes('당일'))
                    );
                    break;
            }
        }

        // 정렬
        if (sortOrder === 'pay') {
            results.sort((a: any, b: any) => {
                const aPay = parseInt(a.pay.replace(/[^0-9]/g, '')) || 0;
                const bPay = parseInt(b.pay.replace(/[^0-9]/g, '')) || 0;
                return bPay - aPay;
            });
        } else if (sortOrder === 'popular') {
            results.sort((a: any, b: any) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
        }

        return results.length > 0 ? results : allAds.slice(0, 12);
    }, [searchQuery, filters, sortOrder, userAds, apiAds]);

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setDisplayCount(12); // 필터 변경 시 표시 개수 리셋
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setDisplayCount(12);
    };

    return (
        <div className="pb-20">
            {/* Search Header */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-4">검색 결과</h1>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="지역, 업종, 키워드로 검색해보세요"
                            className="w-full bg-accent border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-black px-6 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                        검색
                    </button>
                    <button
                        type="button"
                        className="bg-accent border border-white/10 text-white px-4 rounded-lg flex items-center gap-2 hover:bg-white/5"
                    >
                        <Filter size={20} />
                        필터
                    </button>
                </form>
            </div>

            {/* Horizontal Filter Bar */}
            <HorizontalFilterBar onFilterChange={handleFilterChange} />

            {/* Results Section */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-muted">
                        총 <span className="text-primary font-bold">{filteredAds.length}</span>건의 검색결과
                    </span>
                    <SelectionGroup
                        options={SORT_OPTIONS}
                        value={sortOrder}
                        onChange={setSortOrder}
                    />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setDisplayCount(prev => Math.min(prev + 12, filteredAds.length))}
                            className="bg-gradient-to-r from-primary/80 to-primary text-black px-8 py-3 rounded-lg font-bold hover:from-primary hover:to-primary/80 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            더보기 ({filteredAds.length - displayCount}건)
                        </button>
                    </div>
                )}

                {filteredAds.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-text-muted text-lg">검색 결과가 없습니다.</p>
                        <p className="text-text-muted/60 mt-2">다른 검색어나 필터를 시도해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
