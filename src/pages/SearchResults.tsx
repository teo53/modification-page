import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock } from 'lucide-react';
import AdCard from '../components/ad/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import HorizontalFilterBar from '../components/ui/HorizontalFilterBar';
import { allAds, jewelAds, vipAds, specialAds } from '../data/mockAds';
import { useApp } from '../context/AppContext';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { state, addSearchHistory, dispatch } = useApp();
    const [sortOrder, setSortOrder] = useState('latest');
    const [displayCount, setDisplayCount] = useState(12);
    const [searchQuery, setSearchQuery] = useState('');
    const [tierFilter, setTierFilter] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [filters, setFilters] = useState({
        region: 'all',
        industry: 'all',
        salary: 'all',
        type: 'all'
    });

    // Read URL query parameters on mount
    useEffect(() => {
        const type = searchParams.get('type');
        const brand = searchParams.get('brand');
        const tier = searchParams.get('tier');

        if (brand) {
            setSearchQuery(brand);
        }
        if (type) {
            if (type === 'special') {
                setTierFilter('special');
            } else {
                setFilters(prev => ({ ...prev, type }));
            }
        }
        if (tier) {
            setTierFilter(tier);
        }
    }, [searchParams]);

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        setShowHistory(false);
        setDisplayCount(12);
    };

    const clearHistory = () => {
        dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
    };

    const SORT_OPTIONS = [
        { label: '최신순', value: 'latest' },
        { label: '급여높은순', value: 'pay' },
        { label: '인기순', value: 'popular' },
    ];

    // 필터링 및 정렬된 광고 목록
    const filteredAds = useMemo(() => {
        // Start with tier-filtered ads if tier is set
        let results: typeof allAds;
        if (tierFilter === 'jewel') {
            results = [...jewelAds];
        } else if (tierFilter === 'vip') {
            results = [...vipAds];
        } else if (tierFilter === 'special') {
            results = [...specialAds];
        } else {
            results = [...allAds];
        }

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
                        ad.badges.some(b => b.includes('초보'))
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
                        ad.badges.some(b => b.includes('당일'))
                    );
                    break;
            }
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
    }, [searchQuery, filters, sortOrder, tierFilter]);

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setDisplayCount(12);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addSearchHistory(searchQuery.trim());
        }
        setShowHistory(false);
        setDisplayCount(12);
    };

    return (
        <div className="pb-20 bg-background">
            {/* Search Header */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-xl font-bold text-text-main mb-4">검색 결과</h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="지역, 업종, 키워드로 검색해보세요"
                                className="w-full bg-accent border border-border rounded-lg py-3 pl-12 pr-4 text-text-main focus:border-primary outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowHistory(true)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />

                            {/* Search History Dropdown */}
                            {showHistory && state.searchHistory.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                                    <div className="flex items-center justify-between p-3 border-b border-border">
                                        <span className="text-sm font-bold text-text-main flex items-center gap-2">
                                            <Clock size={14} />
                                            최근 검색어
                                        </span>
                                        <button
                                            type="button"
                                            onClick={clearHistory}
                                            className="text-xs text-text-muted hover:text-primary"
                                        >
                                            전체 삭제
                                        </button>
                                    </div>
                                    {state.searchHistory.slice(0, 10).map((item, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleHistoryClick(item.query)}
                                            className="w-full text-left px-4 py-2 text-text-main hover:bg-surface transition-colors flex items-center gap-2"
                                        >
                                            <Clock size={14} className="text-text-muted" />
                                            {item.query}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                        >
                            검색
                        </button>
                        <button
                            type="button"
                            className="bg-accent border border-border text-text-main px-4 rounded-lg flex items-center gap-2 hover:bg-accent-dark"
                        >
                            <Filter size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Horizontal Filter Bar */}
            <HorizontalFilterBar onFilterChange={handleFilterChange} />

            {/* Results Section */}
            <div className="container mx-auto px-4 py-4">
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
                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                        >
                            더보기 ({filteredAds.length - displayCount}건)
                        </button>
                    </div>
                )}

                {filteredAds.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-text-muted text-lg">검색 결과가 없습니다.</p>
                        <p className="text-text-light mt-2">다른 검색어나 필터를 시도해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
