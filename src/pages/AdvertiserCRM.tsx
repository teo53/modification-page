import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, MousePointer, Phone, TrendingUp, FileText, MapPin, Plus, AlertCircle, Image, Trash2, Edit, XCircle, RotateCcw, ArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import {
    getMyAds, getAdStats, deleteAd, extendAd, closeAd, type UserAd,
    USE_API_ADS, fetchMyAdsFromApi
} from '../utils/adStorage';

// Sample chart data - will be replaced by real API data when backend returns analytics
const defaultChartData = [
    { name: '월', views: 0, clicks: 0, calls: 0 },
    { name: '화', views: 0, clicks: 0, calls: 0 },
    { name: '수', views: 0, clicks: 0, calls: 0 },
    { name: '목', views: 0, clicks: 0, calls: 0 },
    { name: '금', views: 0, clicks: 0, calls: 0 },
    { name: '토', views: 0, clicks: 0, calls: 0 },
    { name: '일', views: 0, clicks: 0, calls: 0 },
];

const AdvertiserCRM: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [myAds, setMyAds] = useState<UserAd[]>([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, expired: 0, totalViews: 0, totalInquiries: 0 });
    const [activeTab, setActiveTab] = useState<'analytics' | 'management'>('management');
    const [adTab, setAdTab] = useState<'active' | 'pending' | 'rejected' | 'expired'>('active');
    const [jumpUpCount, setJumpUpCount] = useState(9);
    const [showLogoModal, setShowLogoModal] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');
    const [chartData, _setChartData] = useState(defaultChartData);
    const [_isLoading, setLoading] = useState(true);

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

        // Load ads: Use API if available, fallback to localStorage
        const loadAds = async () => {
            setLoading(true);
            try {
                if (USE_API_ADS) {
                    const apiAds = await fetchMyAdsFromApi();
                    setMyAds(apiAds);
                    // Calculate stats from API ads
                    const apiStats = {
                        total: apiAds.length,
                        active: apiAds.filter(a => a.status === 'active').length,
                        pending: apiAds.filter(a => a.status === 'pending').length,
                        expired: apiAds.filter(a => a.status === 'expired' || a.status === 'closed').length,
                        totalViews: apiAds.reduce((sum, a) => sum + (a.views || 0), 0),
                        totalInquiries: apiAds.reduce((sum, a) => sum + (a.inquiries || 0), 0)
                    };
                    setStats(apiStats);
                } else {
                    // Fallback to localStorage
                    setMyAds(getMyAds());
                    setStats(getAdStats());
                }
            } catch (error) {
                console.error('Failed to load ads:', error);
                // Fallback to localStorage on error
                setMyAds(getMyAds());
                setStats(getAdStats());
            } finally {
                setLoading(false);
            }
        };

        loadAds();
    }, [navigate]);

    const handleDeleteAd = async (adId: string) => {
        if (!window.confirm('정말 이 광고를 삭제하시겠습니까?')) return;

        if (USE_API_ADS) {
            const { deleteAdWithApi } = await import('../utils/adStorage');
            const result = await deleteAdWithApi(adId);
            if (result.success) {
                // Reload ads
                const apiAds = await fetchMyAdsFromApi();
                setMyAds(apiAds);
                // Update stats (re-calculate)
                const apiStats = {
                    total: apiAds.length,
                    active: apiAds.filter(a => a.status === 'active').length,
                    pending: apiAds.filter(a => a.status === 'pending').length,
                    expired: apiAds.filter(a => a.status === 'expired' || a.status === 'closed').length,
                    totalViews: apiAds.reduce((sum, a) => sum + (a.views || 0), 0),
                    totalInquiries: apiAds.reduce((sum, a) => sum + (a.inquiries || 0), 0)
                };
                setStats(apiStats);
            } else {
                alert(result.message);
            }
        } else {
            deleteAd(adId);
            setMyAds(getMyAds());
            setStats(getAdStats());
        }
    };

    const handleExtendAd = async (adId: string) => {
        const days = window.prompt('연장할 기간을 입력하세요 (일 수):', '30');
        if (!days) return;
        const extensionDays = parseInt(days);
        if (isNaN(extensionDays) || extensionDays <= 0) {
            alert('유효한 숫자를 입력해주세요.');
            return;
        }

        if (USE_API_ADS) {
            const { updateAdWithApi, fetchAdByIdFromApi } = await import('../utils/adStorage');
            // First get current ad to calculate new date
            const ad = await fetchAdByIdFromApi(adId);
            if (!ad) return;

            const currentExpires = new Date(ad.expiresAt);
            const now = new Date();
            const baseDate = currentExpires > now ? currentExpires : now;
            const newExpiresAt = new Date(baseDate.getTime() + extensionDays * 24 * 60 * 60 * 1000).toISOString();

            const result = await updateAdWithApi(adId, {
                status: 'active', // Reactivate if expired
                expiresAt: newExpiresAt,
                endDate: newExpiresAt.split('T')[0]
            });

            alert(result.message);
            if (result.success) {
                const apiAds = await fetchMyAdsFromApi();
                setMyAds(apiAds);
                // Recalculate stats logic repeated... ideally extract to loadAds function
            }
        } else {
            const result = extendAd(adId, extensionDays);
            alert(result.message);
            if (result.success) {
                setMyAds(getMyAds());
                setStats(getAdStats());
            }
        }
    };

    const handleCloseAd = async (adId: string) => {
        if (!window.confirm('이 광고를 마감하시겠습니까?')) return;

        if (USE_API_ADS) {
            const { updateAdWithApi } = await import('../utils/adStorage');
            const result = await updateAdWithApi(adId, { status: 'closed' });
            alert(result.message);
            if (result.success) {
                const apiAds = await fetchMyAdsFromApi();
                setMyAds(apiAds);
            }
        } else {
            const result = closeAd(adId);
            alert(result.message);
            if (result.success) {
                setMyAds(getMyAds());
                setStats(getAdStats());
            }
        }
    };

    const handleJumpUp = (_adId: string) => {
        if (jumpUpCount <= 0) {
            alert('잔여 점프 횟수가 없습니다.');
            return;
        }
        if (window.confirm(`점프업을 사용하시겠습니까? (잔여: ${jumpUpCount}회)`)) {
            setJumpUpCount(prev => prev - 1);
            alert('광고가 상위로 올라갔습니다!');
        }
    };

    const activeAds = myAds.filter(ad => ad.status === 'active');
    const pendingAds = myAds.filter(ad => ad.status === 'pending');
    const rejectedAds = myAds.filter(ad => ad.status === 'rejected');
    const expiredAds = myAds.filter(ad => ad.status === 'expired' || ad.status === 'closed');

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <p className="text-white">로그인이 필요합니다.</p>
                    <Link to="/login" className="text-primary underline">로그인하기</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="text-sm text-text-muted mb-4">
                    <Link to="/" className="hover:text-primary">메인</Link> &gt; <span className="text-white">광고주 CRM</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">광고주 CRM</h1>
                        <p className="text-text-muted">광고 분석 및 관리를 한 곳에서</p>
                    </div>
                    <Link
                        to="/post-ad"
                        className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        새 광고 등록
                    </Link>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('management')}
                        className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'management'
                            ? 'bg-primary text-black'
                            : 'bg-accent/30 text-text-muted hover:bg-white/5'
                            }`}
                    >
                        광고 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'analytics'
                            ? 'bg-primary text-black'
                            : 'bg-accent/30 text-text-muted hover:bg-white/5'
                            }`}
                    >
                        분석
                    </button>
                </div>

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-text-muted">총 노출수</span>
                                    <Eye className="text-primary" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                                <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                                    <TrendingUp size={12} /> +12.5%
                                </span>
                            </div>
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-text-muted">클릭수</span>
                                    <MousePointer className="text-secondary" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">1,234</p>
                                <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                                    <TrendingUp size={12} /> +8.2%
                                </span>
                            </div>
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-text-muted">전화문의</span>
                                    <Phone className="text-blue-500" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.totalInquiries}</p>
                                <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                                    <TrendingUp size={12} /> +5.1%
                                </span>
                            </div>
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-text-muted">활성 광고</span>
                                    <FileText className="text-purple-500" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.active}</p>
                                <span className="text-xs text-text-muted mt-2">전체 {stats.total}개</span>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-6">주간 성과 추이</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis dataKey="name" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="views" stroke="#D4AF37" strokeWidth={2} />
                                            <Line type="monotone" dataKey="clicks" stroke="#FF007F" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-6">전환율 분석</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis dataKey="name" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="calls" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Management Tab */}
                {activeTab === 'management' && (
                    <>
                        {/* Profile Section */}
                        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 mb-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Image size={20} className="text-primary" />
                                업소 정보 관리
                            </h2>
                            <div className="flex flex-wrap gap-6 items-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-20 bg-background border border-white/10 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="로고" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <span className="text-2xl font-bold text-white/30">LOGO</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowLogoModal(true)}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        ± 로고/배너 수정
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-background rounded-lg p-4 text-center min-w-[100px]">
                                        <div className="text-xs text-text-muted mb-1">진행중</div>
                                        <div className="text-2xl font-bold text-green-400">{stats.active}개</div>
                                    </div>
                                    <div className="bg-background rounded-lg p-4 text-center min-w-[100px]">
                                        <div className="text-xs text-text-muted mb-1">대기중</div>
                                        <div className="text-2xl font-bold text-yellow-400">{stats.pending}개</div>
                                    </div>
                                    <div className="bg-background rounded-lg p-4 text-center min-w-[100px]">
                                        <div className="text-xs text-text-muted mb-1">마감</div>
                                        <div className="text-2xl font-bold text-gray-400">{stats.expired}개</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    <ArrowUp size={16} className="text-green-400" />
                                    <span className="text-white">잔여 점프:</span>
                                    <span className="text-2xl font-bold text-green-400">{jumpUpCount}회</span>
                                </div>
                            </div>
                        </div>

                        {/* Ad Tabs */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button
                                onClick={() => setAdTab('active')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${adTab === 'active' ? 'bg-green-500 text-white' : 'bg-accent/30 text-text-muted'
                                    }`}
                            >
                                진행중 ({activeAds.length})
                            </button>
                            <button
                                onClick={() => setAdTab('pending')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${adTab === 'pending' ? 'bg-yellow-500 text-black' : 'bg-accent/30 text-text-muted'
                                    }`}
                            >
                                승인대기 ({pendingAds.length})
                            </button>
                            <button
                                onClick={() => setAdTab('rejected')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${adTab === 'rejected' ? 'bg-red-500 text-white' : 'bg-accent/30 text-text-muted'
                                    }`}
                            >
                                반려됨 ({rejectedAds.length})
                            </button>
                            <button
                                onClick={() => setAdTab('expired')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${adTab === 'expired' ? 'bg-gray-500 text-white' : 'bg-accent/30 text-text-muted'
                                    }`}
                            >
                                마감됨 ({expiredAds.length})
                            </button>
                        </div>

                        {/* Ads List */}
                        <div className="bg-accent/30 rounded-xl border border-white/5">
                            {(() => {
                                const currentAds = adTab === 'active' ? activeAds :
                                    adTab === 'pending' ? pendingAds :
                                        adTab === 'rejected' ? rejectedAds : expiredAds;

                                if (currentAds.length === 0) {
                                    return (
                                        <div className="text-center py-12">
                                            <FileText className="mx-auto mb-4 text-text-muted" size={48} />
                                            <p className="text-text-muted mb-4">
                                                {adTab === 'active' ? '진행중인 광고가 없습니다.' :
                                                    adTab === 'pending' ? '승인 대기중인 광고가 없습니다.' :
                                                        adTab === 'rejected' ? '반려된 광고가 없습니다.' : '마감된 광고가 없습니다.'}
                                            </p>
                                            {(adTab === 'active' || adTab === 'pending') && (
                                                <Link to="/post-ad" className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-2 rounded-lg">
                                                    <Plus size={18} />
                                                    새 광고 등록
                                                </Link>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div className="divide-y divide-white/5">
                                        {currentAds.map((ad) => (
                                            <div key={ad.id} className="p-4 hover:bg-white/5 transition-colors">
                                                <div className="flex flex-wrap gap-4 items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                                                            <span>수정일: {ad.createdAt?.split('T')[0]}</span>
                                                            <span>마감일: {ad.endDate || ad.expiresAt?.split('T')[0]}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {ad.productType && (
                                                                <span className={`text-xs px-2 py-0.5 rounded font-bold ${ad.productType === 'diamond' ? 'bg-cyan-400 text-black' :
                                                                    ad.productType === 'vip' ? 'bg-primary text-black' :
                                                                        'bg-gray-500 text-white'
                                                                    }`}>
                                                                    {ad.productType.toUpperCase()}
                                                                </span>
                                                            )}
                                                            <h3 className="text-white font-bold truncate">{ad.title}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={12} />
                                                                {ad.location}
                                                            </span>
                                                            <span>급여: {ad.salary}</span>
                                                        </div>
                                                        {/* Show rejection reason if rejected */}
                                                        {ad.status === 'rejected' && ad.rejectionReason && (
                                                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                                <span className="text-xs text-red-400 font-bold">반려 사유: </span>
                                                                <span className="text-xs text-red-300">{ad.rejectionReason}</span>
                                                            </div>
                                                        )}
                                                        {/* Show pending status message */}
                                                        {ad.status === 'pending' && (
                                                            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                                <span className="text-xs text-yellow-400">⏳ 관리자 승인 대기중입니다. 승인 후 광고가 노출됩니다.</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {adTab === 'active' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleExtendAd(ad.id)}
                                                                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-600"
                                                                >
                                                                    <RotateCcw size={14} />
                                                                    연장
                                                                </button>
                                                                <button
                                                                    onClick={() => handleJumpUp(ad.id)}
                                                                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-600"
                                                                >
                                                                    <ArrowUp size={14} />
                                                                    점프
                                                                </button>
                                                            </>
                                                        )}
                                                        <Link
                                                            to={`/edit-ad/${ad.id}`}
                                                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-600"
                                                        >
                                                            <Edit size={14} />
                                                            수정
                                                        </Link>
                                                        {adTab === 'active' && (
                                                            <button
                                                                onClick={() => handleCloseAd(ad.id)}
                                                                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-600"
                                                            >
                                                                <XCircle size={14} />
                                                                마감
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteAd(ad.id)}
                                                            className="flex items-center gap-1 bg-red-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-900"
                                                        >
                                                            <Trash2 size={14} />
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Bottom Stats */}
                        <div className="mt-4 text-sm text-text-muted">
                            <span className="mr-4">지원자 [ 0명 ]</span>
                            <span className="mr-4">/ 미열람 [ 0명 ]</span>
                            <span className="mr-4">/ 인재스크랩 [ 0명 ]</span>
                            <span>/ 예비합격자 [ 0명 ]</span>
                        </div>
                    </>
                )}
            </div>

            {/* Logo/Banner Modal */}
            {showLogoModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowLogoModal(false)}>
                    <div className="bg-accent rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">로고 및 배너 수정</h3>

                        <div className="mb-6">
                            <label className="block text-sm text-white mb-2 font-bold">업소 로고 이미지</label>
                            <p className="text-xs text-text-muted mb-2">광고 카드 및 상세페이지 상단에 표시됩니다.</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="파일 선택..."
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-2 text-white"
                                />
                                <button className="bg-primary text-black px-4 py-2 rounded-lg font-bold">파일선택</button>
                            </div>
                            <div className="mt-2 p-3 bg-background rounded-lg border border-white/5">
                                <p className="text-xs text-primary font-bold mb-1">권장 규격</p>
                                <ul className="text-xs text-text-muted space-y-1">
                                    <li>• 이미지 크기: <span className="text-white">160 x 60px</span></li>
                                    <li>• 파일 형식: <span className="text-white">JPG, PNG, GIF</span></li>
                                    <li>• 최대 용량: <span className="text-white">500KB 이하</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-white mb-2 font-bold">광고용 배너 이미지</label>
                            <p className="text-xs text-text-muted mb-2">홈페이지 메인 및 광고 상세페이지에 노출됩니다.</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="파일 선택..."
                                    value={bannerUrl}
                                    onChange={(e) => setBannerUrl(e.target.value)}
                                    className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-2 text-white"
                                />
                                <button className="bg-primary text-black px-4 py-2 rounded-lg font-bold">파일선택</button>
                            </div>
                            <div className="mt-2 p-3 bg-background rounded-lg border border-white/5">
                                <p className="text-xs text-primary font-bold mb-1">권장 규격</p>
                                <ul className="text-xs text-text-muted space-y-1">
                                    <li>• 이미지 크기: <span className="text-white">640 x 480px</span></li>
                                    <li>• 파일 형식: <span className="text-white">JPG, PNG, GIF</span></li>
                                    <li>• 최대 용량: <span className="text-white">2MB 이하</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowLogoModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    alert('저장되었습니다.');
                                    setShowLogoModal(false);
                                }}
                                className="px-4 py-2 bg-primary text-black font-bold rounded-lg"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertiserCRM;
