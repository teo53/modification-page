import React, { useState } from 'react';
import { FileText, TrendingUp, Clock, CheckCircle, MapPin, DollarSign, HelpCircle, Settings, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdCard from '../components/ad/AdCard';

const AdvertiserDashboard: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [selectedCategory, setSelectedCategory] = useState('전체');

    // Mock statistics
    const stats = {
        total: 12,
        active: 8,
        reserved: 3,
        completed: 1
    };

    // Mock ads data
    const myAds: Array<{
        id: number;
        title: string;
        location: string;
        pay: string;
        image: string;
        status: string;
        views: number;
        badges: string[];
        productType: 'vip' | 'special' | 'premium' | 'general';
        price: string;
        duration: string;
    }> = [
            {
                id: 1,
                title: '강남 룸살롱 급구',
                location: '서울 강남구',
                pay: '시급 100,000원',
                image: '/images/ads/thumbnails/vip_ad_1_thumb.jpg',
                status: 'active',
                views: 234,
                badges: ['VIP', '급구'],
                productType: 'vip',
                price: '300,000원',
                duration: '30일'
            },
            // Add more mock ads as needed
        ];

    const regions = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주'];
    const categories = ['전체', '룸살롱', '클럽', '바(Bar)', '노래방', '텐카페'];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 sticky top-20 space-y-6">
                            {/* User Stats */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                                        <FileText className="text-primary" size={16} />
                                    </div>
                                    내 정보
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-background rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">게시글</div>
                                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                                    </div>
                                    <div className="bg-background rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">판매중</div>
                                        <div className="text-2xl font-bold text-green-400">{stats.active}</div>
                                    </div>
                                    <div className="bg-background rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">예약중</div>
                                        <div className="text-2xl font-bold text-yellow-400">{stats.reserved}</div>
                                    </div>
                                    <div className="bg-background rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">거래완료</div>
                                        <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded"></div>
                                    카테고리
                                </h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat
                                                ? 'bg-primary text-black font-bold'
                                                : 'bg-background text-text-muted hover:bg-white/5'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Region Filter */}
                            <div>
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <MapPin className="text-primary" size={16} />
                                    지역선택
                                </h4>
                                <div className="space-y-2">
                                    {regions.map((region) => (
                                        <button
                                            key={region}
                                            onClick={() => setSelectedRegion(region)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedRegion === region
                                                ? 'bg-primary text-black font-bold'
                                                : 'bg-background text-text-muted hover:bg-white/5'
                                                }`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <Link
                                    to="/support"
                                    className="flex items-center gap-3 px-3 py-2 bg-background rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <HelpCircle className="text-primary" size={20} />
                                    <span className="text-white">Q&A</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 px-3 py-2 bg-background rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <Settings className="text-primary" size={20} />
                                    <span className="text-white">내 정보 수정</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">광고주 대시보드</h1>
                                <p className="text-text-muted">내 광고를 관리하고 성과를 확인하세요</p>
                            </div>
                            <Link
                                to="/post-ad"
                                className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <Plus size={20} />
                                새 광고 등록
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="text-green-400" size={24} />
                                    <span className="text-xs text-green-400">+12%</span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">2,847</div>
                                <div className="text-sm text-text-muted">총 조회수</div>
                            </div>
                            <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Clock className="text-yellow-400" size={24} />
                                    <span className="text-xs text-yellow-400">진행중</span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stats.active}</div>
                                <div className="text-sm text-text-muted">활성 광고</div>
                            </div>
                            <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle className="text-blue-400" size={24} />
                                    <span className="text-xs text-blue-400">완료</span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stats.completed}</div>
                                <div className="text-sm text-text-muted">거래 완료</div>
                            </div>
                            <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <DollarSign className="text-primary" size={24} />
                                    <span className="text-xs text-primary">이번달</span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">450K</div>
                                <div className="text-sm text-text-muted">광고 비용</div>
                            </div>
                        </div>

                        {/* My Ads List */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">내 광고 목록</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myAds.map((ad) => (
                                    <div key={ad.id} className="relative">
                                        <AdCard {...ad} />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded text-xs hover:bg-white/20 transition-colors">
                                                수정
                                            </button>
                                            <button className="bg-red-500/20 backdrop-blur-sm text-red-400 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-colors">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserDashboard;
