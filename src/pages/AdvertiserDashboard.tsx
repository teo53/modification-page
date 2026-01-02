import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Clock, CheckCircle, MapPin, DollarSign, HelpCircle, Settings, Plus, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdCard from '../components/ad/AdCard';
import { getCurrentUser } from '../utils/auth';
import { getMyAds, getAdStats, deleteAd, type UserAd } from '../utils/adStorage';

const AdvertiserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [myAds, setMyAds] = useState<UserAd[]>([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, expired: 0, totalViews: 0, totalInquiries: 0 });
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [selectedCategory, setSelectedCategory] = useState('전체');

    // Load user data and ads
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (currentUser.type !== 'advertiser') {
            navigate('/');
            return;
        }
        setUser(currentUser);
        setMyAds(getMyAds());
        setStats(getAdStats());
    }, [navigate]);

    const handleDeleteAd = (adId: string) => {
        if (window.confirm('정말 이 광고를 삭제하시겠습니까?')) {
            deleteAd(adId);
            setMyAds(getMyAds());
            setStats(getAdStats());
        }
    };

    const regions = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주'];
    const categories = ['전체', '룸살롱', '클럽', '바(Bar)', '노래방', '텐카페'];

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <p className="text-text-main">로그인이 필요합니다.</p>
                    <Link to="/login" className="text-primary underline">로그인하기</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-border p-6 sticky top-20 space-y-6 shadow-sm">
                            {/* User Stats */}
                            <div>
                                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                                        <FileText className="text-primary" size={16} />
                                    </div>
                                    내 정보
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-surface rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">게시글</div>
                                        <div className="text-2xl font-bold text-text-main">{stats.total}</div>
                                    </div>
                                    <div className="bg-surface rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">판매중</div>
                                        <div className="text-2xl font-bold text-green-500">{stats.active}</div>
                                    </div>
                                    <div className="bg-surface rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">대기중</div>
                                        <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                                    </div>
                                    <div className="bg-surface rounded-lg p-3 text-center">
                                        <div className="text-xs text-text-muted mb-1">만료</div>
                                        <div className="text-2xl font-bold text-blue-500">{stats.expired}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded"></div>
                                    카테고리
                                </h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat
                                                ? 'bg-primary text-white font-bold'
                                                : 'bg-surface text-text-muted hover:bg-accent'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Region Filter */}
                            <div>
                                <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                                    <MapPin className="text-primary" size={16} />
                                    지역선택
                                </h4>
                                <div className="space-y-2">
                                    {regions.map((region) => (
                                        <button
                                            key={region}
                                            onClick={() => setSelectedRegion(region)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedRegion === region
                                                ? 'bg-primary text-white font-bold'
                                                : 'bg-surface text-text-muted hover:bg-accent'
                                                }`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2 pt-4 border-t border-border">
                                <Link
                                    to="/support"
                                    className="flex items-center gap-3 px-3 py-2 bg-surface rounded-lg hover:bg-accent transition-colors"
                                >
                                    <HelpCircle className="text-primary" size={20} />
                                    <span className="text-text-main">Q&A</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 px-3 py-2 bg-surface rounded-lg hover:bg-accent transition-colors"
                                >
                                    <Settings className="text-primary" size={20} />
                                    <span className="text-text-main">내 정보 수정</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-text-main mb-2">광고주 대시보드</h1>
                                <p className="text-text-muted">내 광고를 관리하고 성과를 확인하세요</p>
                            </div>
                            <Link
                                to="/post-ad"
                                className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
                            >
                                <Plus size={20} />
                                새 광고 등록
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="text-green-500" size={24} />
                                    <span className="text-xs text-green-500">+12%</span>
                                </div>
                                <div className="text-2xl font-bold text-text-main mb-1">2,847</div>
                                <div className="text-sm text-text-muted">총 조회수</div>
                            </div>
                            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <Clock className="text-yellow-500" size={24} />
                                    <span className="text-xs text-yellow-500">진행중</span>
                                </div>
                                <div className="text-2xl font-bold text-text-main mb-1">{stats.active}</div>
                                <div className="text-sm text-text-muted">활성 광고</div>
                            </div>
                            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle className="text-blue-500" size={24} />
                                    <span className="text-xs text-blue-500">만료</span>
                                </div>
                                <div className="text-2xl font-bold text-text-main mb-1">{stats.expired}</div>
                                <div className="text-sm text-text-muted">만료된 광고</div>
                            </div>
                            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <DollarSign className="text-primary" size={24} />
                                    <span className="text-xs text-primary">조회수</span>
                                </div>
                                <div className="text-2xl font-bold text-text-main mb-1">{stats.totalViews}</div>
                                <div className="text-sm text-text-muted">총 조회수</div>
                            </div>
                        </div>

                        {/* My Ads List */}
                        <div>
                            <h2 className="text-xl font-bold text-text-main mb-4">내 광고 목록</h2>
                            {myAds.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-border shadow-sm">
                                    <FileText className="mx-auto mb-4 text-text-muted" size={48} />
                                    <p className="text-text-muted mb-4">등록된 광고가 없습니다.</p>
                                    <Link to="/post-ad" className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-2 rounded-lg">
                                        <Plus size={18} />
                                        새 광고 등록
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {myAds.map((ad) => (
                                        <div key={ad.id} className="relative">
                                            <AdCard
                                                id={Number(ad.id)}
                                                title={ad.title}
                                                location={ad.location}
                                                pay={ad.salary}
                                                image="/images/ads/thumbnails/default_thumb.jpg"
                                                productType={ad.productType}
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <button className="bg-white/90 backdrop-blur-sm text-text-main px-3 py-1 rounded text-xs hover:bg-white transition-colors shadow-sm">
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAd(ad.id)}
                                                    className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserDashboard;
