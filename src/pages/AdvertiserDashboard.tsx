import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Rocket, MapPin, Eye, HelpCircle, Settings, Plus, AlertCircle, ArrowUp, Zap, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getMyAds, getAdStats, deleteAd, type UserAd } from '../utils/adStorage';

const AdvertiserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [myAds, setMyAds] = useState<UserAd[]>([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, expired: 0, totalViews: 0, totalInquiries: 0 });
    const [jumpUpCredits, setJumpUpCredits] = useState(5);

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

    const handleJumpUp = (_adId: string) => {
        if (jumpUpCredits <= 0) {
            alert('점프업 크레딧이 부족합니다. 충전해주세요.');
            return;
        }
        if (window.confirm('이 광고를 점프업 하시겠습니까? (1크레딧 차감)')) {
            setJumpUpCredits(prev => prev - 1);
            // TODO: Implement actual jump-up API call with _adId
            alert('점프업이 완료되었습니다! 광고가 상단으로 이동했습니다.');
        }
    };

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
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-text-main">광고 관리</h1>
                            <p className="text-sm text-text-muted">{user.email}</p>
                        </div>
                        <Link
                            to="/post-ad"
                            className="bg-primary text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Plus size={18} />
                            새 광고
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 space-y-6">
                {/* ====================== JUMP UP SECTION - MAIN FEATURE ====================== */}
                <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">점프업 (Jump-Up)</h2>
                                <p className="text-white/80 text-sm">광고를 상단으로 끌어올리세요!</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black">{jumpUpCredits}</div>
                            <div className="text-white/80 text-sm">크레딧 보유</div>
                        </div>
                    </div>

                    {/* Jump Up Benefits */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <ArrowUp size={20} className="mx-auto mb-1" />
                            <div className="text-xs">상단 노출</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <Eye size={20} className="mx-auto mb-1" />
                            <div className="text-xs">조회수 UP</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <Zap size={20} className="mx-auto mb-1" />
                            <div className="text-xs">즉시 적용</div>
                        </div>
                    </div>

                    {/* Jump Up Credit Purchase */}
                    <button className="w-full bg-white text-green-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Plus size={20} />
                        점프업 크레딧 충전하기
                    </button>
                </section>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-card rounded-xl border border-border p-4 text-center">
                        <div className="text-2xl font-bold text-text-main">{stats.total}</div>
                        <div className="text-xs text-text-muted">전체</div>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.active}</div>
                        <div className="text-xs text-text-muted">활성</div>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                        <div className="text-xs text-text-muted">대기</div>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{stats.totalViews}</div>
                        <div className="text-xs text-text-muted">조회</div>
                    </div>
                </div>

                {/* My Ads List with Jump-Up Buttons */}
                <section>
                    <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-primary" />
                        내 광고 목록
                    </h2>

                    {myAds.length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-xl border border-border">
                            <FileText className="mx-auto mb-4 text-text-muted" size={48} />
                            <p className="text-text-muted mb-4">등록된 광고가 없습니다.</p>
                            <Link to="/post-ad" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-2 rounded-lg">
                                <Plus size={18} />
                                새 광고 등록
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myAds.map((ad) => (
                                <div key={ad.id} className="bg-card rounded-xl border border-border overflow-hidden">
                                    {/* Ad Info Row */}
                                    <div className="flex gap-4 p-4">
                                        {/* Thumbnail */}
                                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
                                            <img
                                                src="/images/ads/thumbnails/default_thumb.jpg"
                                                alt={ad.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>

                                        {/* Ad Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                                    ad.status === 'active' ? 'bg-green-500 text-white' :
                                                    ad.status === 'pending' ? 'bg-yellow-500 text-black' :
                                                    'bg-gray-500 text-white'
                                                }`}>
                                                    {ad.status === 'active' ? '활성' : ad.status === 'pending' ? '대기중' : '만료'}
                                                </span>
                                                {ad.productType && ad.productType !== 'regular' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary text-white font-bold">
                                                        {ad.productType.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-text-main text-sm line-clamp-1">{ad.title}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {ad.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={12} />
                                                    {ad.views || 0}회
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-text-light">
                                                <Calendar size={12} />
                                                {new Date(ad.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Jump-Up Prominent */}
                                    <div className="grid grid-cols-3 border-t border-border">
                                        {/* JUMP UP - Main Action */}
                                        <button
                                            onClick={() => handleJumpUp(ad.id)}
                                            disabled={ad.status !== 'active'}
                                            className={`flex items-center justify-center gap-2 py-3 font-bold text-sm ${
                                                ad.status === 'active'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-surface text-text-muted cursor-not-allowed'
                                            }`}
                                        >
                                            <Rocket size={16} />
                                            점프업
                                        </button>

                                        {/* Edit */}
                                        <button className="flex items-center justify-center gap-2 py-3 text-sm text-text-main hover:bg-surface border-l border-border">
                                            수정
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeleteAd(ad.id)}
                                            className="flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:bg-red-50 border-l border-border"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Performance Overview */}
                <section>
                    <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" />
                        성과 요약
                    </h2>
                    <div className="bg-card rounded-xl border border-border p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-surface rounded-xl">
                                <div className="text-3xl font-bold text-text-main mb-1">{stats.totalViews}</div>
                                <div className="text-sm text-text-muted">총 조회수</div>
                                <div className="text-xs text-green-500 mt-1">+12% 이번주</div>
                            </div>
                            <div className="text-center p-4 bg-surface rounded-xl">
                                <div className="text-3xl font-bold text-text-main mb-1">{stats.totalInquiries}</div>
                                <div className="text-sm text-text-muted">총 문의</div>
                                <div className="text-xs text-green-500 mt-1">+8% 이번주</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Links */}
                <section className="grid grid-cols-2 gap-3">
                    <Link
                        to="/support"
                        className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
                    >
                        <HelpCircle className="text-primary" size={24} />
                        <span className="text-text-main font-medium">고객센터</span>
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
                    >
                        <Settings className="text-primary" size={24} />
                        <span className="text-text-main font-medium">설정</span>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default AdvertiserDashboard;
