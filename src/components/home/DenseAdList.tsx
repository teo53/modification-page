import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, MapPin, Clock, Flame, ChevronRight } from 'lucide-react';
import { allSampleAds } from '../../data/sampleAds';

// 밀집형 광고 리스트 - 레퍼런스 사이트 스타일
// 한눈에 많은 광고를 볼 수 있도록 컴팩트하게 표시

interface DenseAd {
    id: number | string;
    title: string;
    location: string;
    pay?: string;
    salary?: string;
    isNew?: boolean;
    isHot?: boolean;
}

const DenseAdList: React.FC = () => {
    // Get sample ads as dense list
    const textAds: DenseAd[] = allSampleAds.slice(0, 30);

    // Group by category for tabs
    const categories = [
        { id: 'all', name: '전체', count: textAds.length },
        { id: 'urgent', name: '🔥급구', count: textAds.filter(a => a.isHot).length },
        { id: 'new', name: '🆕신규', count: textAds.filter(a => a.isNew).length },
    ];

    const [activeTab, setActiveTab] = useState('all');

    const filteredAds = activeTab === 'all'
        ? textAds
        : activeTab === 'urgent'
            ? textAds.filter(a => a.isHot)
            : textAds.filter(a => a.isNew);

    return (
        <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                        <List className="text-green-400" size={20} />
                    </div>
                    최신 채용정보
                    <span className="text-sm font-normal text-text-muted ml-2">
                        총 {textAds.length}건
                    </span>
                </h2>
                <Link to="/search" className="text-sm text-text-muted hover:text-primary flex items-center gap-1">
                    전체보기 <ChevronRight size={16} />
                </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === cat.id
                                ? 'bg-primary text-black'
                                : 'bg-accent text-text-muted hover:text-white'
                            }`}
                    >
                        {cat.name} <span className="opacity-70">({cat.count})</span>
                    </button>
                ))}
            </div>

            {/* Dense Ad List - 2 Column Grid */}
            <div className="bg-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <div className="grid md:grid-cols-2 divide-x divide-white/5">
                    {/* Left Column */}
                    <div className="divide-y divide-white/5">
                        {filteredAds.slice(0, Math.ceil(filteredAds.length / 2)).map((ad, idx) => (
                            <Link
                                key={ad.id}
                                to={`/ad/${ad.id}`}
                                className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group"
                            >
                                <span className="text-xs text-text-muted w-6">{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {ad.isHot && (
                                            <Flame size={12} className="text-red-400 flex-shrink-0" />
                                        )}
                                        <span className="text-sm text-white truncate group-hover:text-primary transition-colors">
                                            {ad.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <MapPin size={10} />
                                        <span>{ad.location}</span>
                                        <span>•</span>
                                        <span className="text-primary">{ad.pay || ad.salary}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-text-muted flex items-center gap-1">
                                    <Clock size={10} />
                                    오늘
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="divide-y divide-white/5">
                        {filteredAds.slice(Math.ceil(filteredAds.length / 2)).map((ad, idx) => (
                            <Link
                                key={ad.id}
                                to={`/ad/${ad.id}`}
                                className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group"
                            >
                                <span className="text-xs text-text-muted w-6">
                                    {Math.ceil(filteredAds.length / 2) + idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {ad.isHot && (
                                            <Flame size={12} className="text-red-400 flex-shrink-0" />
                                        )}
                                        <span className="text-sm text-white truncate group-hover:text-primary transition-colors">
                                            {ad.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <MapPin size={10} />
                                        <span>{ad.location}</span>
                                        <span>•</span>
                                        <span className="text-primary">{ad.pay || ad.salary}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-text-muted flex items-center gap-1">
                                    <Clock size={10} />
                                    오늘
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-4 text-center">
                <div className="text-sm">
                    <span className="text-text-muted">오늘 등록 </span>
                    <span className="text-green-400 font-bold">127</span>
                    <span className="text-text-muted">건</span>
                </div>
                <div className="text-sm">
                    <span className="text-text-muted">이번 주 </span>
                    <span className="text-primary font-bold">843</span>
                    <span className="text-text-muted">건</span>
                </div>
                <div className="text-sm">
                    <span className="text-text-muted">전체 </span>
                    <span className="text-secondary font-bold">2,847</span>
                    <span className="text-text-muted">건</span>
                </div>
            </div>
        </section>
    );
};

export default DenseAdList;
