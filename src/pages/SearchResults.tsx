import React from 'react';
import { Search, Filter } from 'lucide-react';
import AdCard from '../components/ui/AdCard';
import SelectionGroup from '../components/ui/SelectionGroup';
import HorizontalFilterBar from '../components/ui/HorizontalFilterBar';

const SearchResults: React.FC = () => {
    const [sortOrder, setSortOrder] = React.useState('latest');

    const SORT_OPTIONS = [
        { label: '최신순', value: 'latest' },
        { label: '급여높은순', value: 'pay' },
        { label: '인기순', value: 'popular' },
    ];
    // Mock data for search results
    const results = Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: `강남 최고급 룸살롱 ${i + 1}호점`,
        location: '서울 강남구 역삼동',
        pay: '시급 100,000원',
        image: `https://images.unsplash.com/photo-${1566737236500 + i}?q=80&w=800&auto=format&fit=crop`,
        badges: ['당일지급', '초보환영'],
        isNew: i < 2,
        isHot: i === 2,
        variant: i < 2 ? 'vip' as const : 'regular' as const
    }));

    return (
        <div className="pb-20">
            {/* Search Header */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-4">검색 결과</h1>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="지역, 업종, 키워드로 검색해보세요"
                            className="w-full bg-accent border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                            defaultValue="강남"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                    <button className="bg-accent border border-white/10 text-white px-4 rounded-lg flex items-center gap-2 hover:bg-white/5">
                        <Filter size={20} />
                        필터
                    </button>
                </div>
            </div>

            {/* Horizontal Filter Bar */}
            <HorizontalFilterBar />

            {/* Results Section */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-muted">총 <span className="text-primary font-bold">128</span>건의 검색결과</span>
                    <SelectionGroup
                        options={SORT_OPTIONS}
                        value={sortOrder}
                        onChange={setSortOrder}
                    />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {results.map((ad) => (
                        <AdCard key={ad.id} {...ad} />
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-colors">
                        더보기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
