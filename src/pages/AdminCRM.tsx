import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Clock, MessageSquare, Database, Shield, LayoutGrid, Table, Eye, MousePointer, TrendingUp, Activity, Target, X } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { getAnalyticsSummary } from '../utils/analytics';
import { getPendingAds, approveAd, rejectAd, type UserAd } from '../utils/adStorage';

// User type from localStorage
interface StoredUser {
    id: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    type: 'worker' | 'advertiser';
    businessNumber?: string;
    businessName?: string;
    createdAt: string;
}

const pieData = [
    { name: 'VIP', value: 400 },
    { name: 'Special', value: 300 },
    { name: 'Premium', value: 300 },
    { name: 'General', value: 200 },
];

const COLORS = ['#D4AF37', '#FF007F', '#FFFFFF', '#CCCCCC'];

const revenueData = [
    { name: '1주', amount: 4000 },
    { name: '2주', amount: 3000 },
    { name: '3주', amount: 2000 },
    { name: '4주', amount: 2780 },
];

const AdminCRM: React.FC = () => {
    const navigate = useNavigate();

    // CRM 전용 운영모드 (홈페이지 샘플모드와 독립적)
    const [crmOperationalMode, setCrmOperationalMode] = useState(() => {
        const saved = localStorage.getItem('lunaalba_crm_mode');
        return saved === 'operational';
    });

    const toggleCrmMode = () => {
        const newMode = !crmOperationalMode;
        setCrmOperationalMode(newMode);
        localStorage.setItem('lunaalba_crm_mode', newMode ? 'operational' : 'demo');
    };

    // 샘플 회원 데이터 (홍보 시연용)
    const sampleUsers: StoredUser[] = [
        { id: 'sample_1', email: 'kim.minjun@example.com', name: '김민준', nickname: '민준이', phone: '010-1234-5678', type: 'worker', createdAt: '2024-12-01T09:00:00Z' },
        { id: 'sample_2', email: 'lee.sooyoung@example.com', name: '이수영', nickname: '수영맘', phone: '010-2345-6789', type: 'worker', createdAt: '2024-12-05T14:30:00Z' },
        { id: 'sample_3', email: 'gangnam.lounge@business.com', name: '박대표', nickname: '강남라운지', phone: '010-9999-8888', type: 'advertiser', businessNumber: '123-45-67890', businessName: '강남 프리미엄 라운지', createdAt: '2024-11-15T10:00:00Z' },
        { id: 'sample_4', email: 'cheongdam.club@business.com', name: '최사장', nickname: '청담클럽', phone: '010-7777-6666', type: 'advertiser', businessNumber: '234-56-78901', businessName: '청담 VIP 클럽', createdAt: '2024-11-20T11:30:00Z' },
        { id: 'sample_5', email: 'hong.jisoo@example.com', name: '홍지수', nickname: '지수언니', phone: '010-3456-7890', type: 'worker', createdAt: '2024-12-10T16:45:00Z' },
        { id: 'sample_6', email: 'apgujeong.bar@business.com', name: '정매니저', nickname: '압구정바', phone: '010-5555-4444', type: 'advertiser', businessNumber: '345-67-89012', businessName: '압구정 칵테일 바', createdAt: '2024-12-08T09:15:00Z' },
        { id: 'sample_7', email: 'shin.yuna@example.com', name: '신유나', nickname: '유나짱', phone: '010-4567-8901', type: 'worker', createdAt: '2024-12-12T13:20:00Z' },
        { id: 'sample_8', email: 'itaewon.club@business.com', name: '김대표', nickname: '이태원클럽', phone: '010-3333-2222', type: 'advertiser', businessNumber: '456-78-90123', businessName: '이태원 나이트클럽', createdAt: '2024-12-03T18:00:00Z' },
    ];

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [users, setUsers] = useState<StoredUser[]>([]);
    const [userViewMode, setUserViewMode] = useState<'table' | 'card'>('table');
    const [userFilter, setUserFilter] = useState<'all' | 'worker' | 'advertiser'>('all');
    const [analyticsData, setAnalyticsData] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);
    const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);
    const [pendingAds, setPendingAds] = useState<UserAd[]>([]);

    // 현재 모드에 따른 표시 데이터
    const displayUsers = crmOperationalMode ? users : sampleUsers;

    // 샘플 대기 광고 (홍보 시연용)
    const samplePendingAds = [
        { id: 'sample_ad_1', title: '강남 룸살롱 신규 오픈', businessName: '강남 프리미엄 라운지', productType: 'diamond' as const, createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        { id: 'sample_ad_2', title: '청담 라운지 프리미엄', businessName: '청담 VIP 클럽', productType: 'sapphire' as const, createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
        { id: 'sample_ad_3', title: '압구정 클럽 리뉴얼', businessName: '압구정 칵테일 바', productType: 'gold' as const, createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
    ];

    const displayPendingAds = crmOperationalMode ? pendingAds : samplePendingAds;

    // 광고 승인 처리
    const handleApproveAd = (adId: string) => {
        if (!crmOperationalMode) {
            alert('시연 모드에서는 승인 기능이 비활성화됩니다.');
            return;
        }
        const result = approveAd(adId);
        if (result.success) {
            setPendingAds(getPendingAds());
            alert(result.message);
        } else {
            alert(result.message);
        }
    };

    // 광고 반려 처리
    const handleRejectAd = (adId: string) => {
        if (!crmOperationalMode) {
            alert('시연 모드에서는 반려 기능이 비활성화됩니다.');
            return;
        }
        const reason = prompt('반려 사유를 입력하세요:', '광고 정책 위반');
        if (reason !== null) {
            const result = rejectAd(adId, reason);
            if (result.success) {
                setPendingAds(getPendingAds());
                alert(result.message);
            } else {
                alert(result.message);
            }
        }
    };

    // Admin auth check - re-check on auth state changes
    useEffect(() => {
        const checkAuth = () => {
            const user = getCurrentUser();
            const adminEmails = ['admin@lunaalba.com', 'admin@example.com', 'admin@dalbitalba.com'];
            if (user && adminEmails.includes(user.email)) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
            setIsChecking(false);
        };

        checkAuth();

        // Listen for auth state changes
        window.addEventListener('authStateChange', checkAuth);

        // Load users from localStorage
        const loadUsers = () => {
            const storedUsers = JSON.parse(localStorage.getItem('lunaalba_users') || '[]');
            setUsers(storedUsers);
        };
        loadUsers();

        // Load pending ads
        const loadPendingAds = () => {
            setPendingAds(getPendingAds());
        };
        loadPendingAds();

        // Load analytics data
        const loadAnalytics = () => {
            const data = getAnalyticsSummary();
            setAnalyticsData(data);

        };
        loadAnalytics();

        // Refresh analytics and pending ads every 5 seconds
        const analyticsInterval = setInterval(() => {
            loadAnalytics();
            loadPendingAds();
        }, 5000);

        return () => {
            window.removeEventListener('authStateChange', checkAuth);
            clearInterval(analyticsInterval);
        };
    }, []);

    // Show loading while checking
    if (isChecking) return null;

    // Redirect if not authorized
    if (!isAuthorized) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto bg-accent rounded-xl border border-white/10 p-8">
                    <Shield className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-white mb-2">관리자 권한 필요</h2>
                    <p className="text-text-muted mb-4">이 페이지는 관리자만 접근할 수 있습니다.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-primary text-black font-bold rounded-lg"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Shield className="text-primary" size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">관리자 CRM</h1>
                        <p className="text-xs text-text-muted">Admin Dashboard</p>
                    </div>
                </div>

                {/* CRM 모드 표시 */}
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${crmOperationalMode
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-yellow-500/10 border-yellow-500/50'
                    }`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${crmOperationalMode ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className={`text-sm font-bold ${crmOperationalMode ? 'text-green-400' : 'text-yellow-400'}`}>
                        {crmOperationalMode ? '실제 운영 모드' : '홍보 시연 모드'}
                    </span>
                </div>
            </div>

            {/* CRM 모드 관리 패널 */}
            <div className="mb-8 bg-accent rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Database size={18} className="text-primary" />
                            CRM 운영 모드
                        </h3>
                        <p className="text-xs text-text-muted mt-1">CRM 전용 설정입니다. 홈페이지 샘플 모드와는 별개로 작동합니다.</p>
                    </div>

                    {/* 모드 토글 */}
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${!crmOperationalMode ? 'text-yellow-400' : 'text-text-muted'}`}>
                            홍보 시연
                        </span>
                        <button
                            onClick={toggleCrmMode}
                            className={`relative w-14 h-7 rounded-full transition-colors ${crmOperationalMode ? 'bg-green-500' : 'bg-yellow-500'}`}
                        >
                            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${crmOperationalMode ? 'left-8' : 'left-1'}`} />
                        </button>
                        <span className={`text-sm font-medium ${crmOperationalMode ? 'text-green-400' : 'text-text-muted'}`}>
                            실제 운영
                        </span>
                    </div>
                </div>

                {/* 현재 모드 상태 표시 */}
                <div className={`px-4 py-3 ${crmOperationalMode ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${crmOperationalMode ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div>
                            <p className={`text-sm font-bold ${crmOperationalMode ? 'text-green-400' : 'text-yellow-400'}`}>
                                {crmOperationalMode ? '실제 운영 모드' : '홍보/시연 모드'}
                            </p>
                            <p className="text-xs text-white/60">
                                {crmOperationalMode
                                    ? '백엔드 API와 연동된 실제 데이터를 표시합니다. 실제 사이트 관리 시 사용.'
                                    : '샘플 데이터로 CRM 기능을 시연합니다. 외부 발표/영업 시 권장.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 데이터 소스 상태 */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className={`bg-black/30 rounded-lg p-3 border ${crmOperationalMode ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${crmOperationalMode ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-xs text-text-muted">통계 데이터</span>
                        </div>
                        <p className={`text-sm font-bold ${crmOperationalMode ? 'text-green-400' : 'text-yellow-400'}`}>
                            {crmOperationalMode ? 'Backend API' : '샘플 (5,432명, 45.2M)'}
                        </p>
                    </div>
                    <div className={`bg-black/30 rounded-lg p-3 border ${crmOperationalMode ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${crmOperationalMode ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-xs text-text-muted">광고 관리</span>
                        </div>
                        <p className={`text-sm font-bold ${crmOperationalMode ? 'text-green-400' : 'text-yellow-400'}`}>
                            {crmOperationalMode ? 'Supabase DB' : '샘플 (12건 대기)'}
                        </p>
                    </div>
                    <div className={`bg-black/30 rounded-lg p-3 border ${crmOperationalMode ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${crmOperationalMode ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-xs text-text-muted">회원 관리</span>
                        </div>
                        <p className={`text-sm font-bold ${crmOperationalMode ? 'text-green-400' : 'text-yellow-400'}`}>
                            {crmOperationalMode ? 'localStorage + API' : '샘플 목록'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">총 회원수</span>
                        <Users className="text-blue-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {crmOperationalMode ? displayUsers.length.toLocaleString() : '5,432'}
                    </p>
                    <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        {crmOperationalMode ? `실제 데이터` : '+125명 (오늘)'}
                    </span>
                </div>
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">월 매출</span>
                        <DollarSign className="text-primary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {crmOperationalMode ? '₩0' : '₩45.2M'}
                    </p>
                    <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        {crmOperationalMode ? '결제 시스템 연동 필요' : '+12.5% (전월 대비)'}
                    </span>
                </div>
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">승인 대기 광고</span>
                        <Clock className="text-yellow-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {crmOperationalMode ? '0' : '12'}
                    </p>
                    <span className="text-xs text-text-muted mt-2">
                        {crmOperationalMode ? '광고 시스템 연동 필요' : '평균 처리 시간: 1.2시간'}
                    </span>
                </div>
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">신고 접수</span>
                        <AlertTriangle className="text-red-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {crmOperationalMode ? '0' : '3'}
                    </p>
                    <span className="text-xs text-red-500 mt-2">
                        {crmOperationalMode ? '신고 시스템 연동 필요' : '미처리 건수'}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Main Charts Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ad Type Distribution */}
                        <div className="bg-accent p-6 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">광고 상품 분포</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-4 text-sm text-text-muted">
                                {pieData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                        <span>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-accent p-6 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">매출 현황</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="name" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="amount" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Side Column: Activity & Tasks */}
                    <div className="space-y-8">
                        {/* Pending Approvals */}
                        <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white">승인 대기 목록</h3>
                                <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                                    {displayPendingAds.length}건
                                </span>
                            </div>
                            {displayPendingAds.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Clock size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                                    <p className="text-text-muted text-sm">대기 중인 승인 요청이 없습니다</p>
                                    <p className="text-xs text-text-muted/50 mt-1">광고 등록 시 여기에 표시됩니다</p>
                                </div>
                            ) : (
                                <>
                                    <div className="divide-y divide-white/5">
                                        {displayPendingAds.slice(0, 5).map((ad) => {
                                            const timeAgo = Math.floor((Date.now() - new Date(ad.createdAt).getTime()) / 60000);
                                            const timeText = timeAgo < 60 ? `${timeAgo}분 전` : `${Math.floor(timeAgo / 60)}시간 전`;
                                            const productLabel = ad.productType === 'diamond' ? 'Diamond' :
                                                ad.productType === 'sapphire' ? 'Sapphire' :
                                                    ad.productType === 'ruby' ? 'Ruby' :
                                                        ad.productType === 'gold' ? 'Gold' :
                                                            ad.productType === 'premium' ? 'Premium' :
                                                                ad.productType === 'special' ? 'Special' : 'Regular';
                                            return (
                                                <div key={ad.id} className="p-4 hover:bg-white/5 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-sm font-medium text-white">{ad.title}</span>
                                                        <span className="text-xs text-text-muted">{timeText}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className={`text-xs px-1.5 py-0.5 rounded ${['diamond', 'sapphire', 'ruby', 'gold'].includes(ad.productType)
                                                            ? 'bg-primary/20 text-primary'
                                                            : 'bg-secondary/20 text-secondary'
                                                            }`}>{productLabel}</span>
                                                        <span className="text-xs text-text-muted">{ad.businessName}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApproveAd(ad.id)}
                                                            className="flex-1 bg-green-500/20 text-green-500 text-xs py-1.5 rounded hover:bg-green-500/30 flex items-center justify-center gap-1"
                                                        >
                                                            <CheckCircle size={12} /> 승인
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectAd(ad.id)}
                                                            className="flex-1 bg-red-500/20 text-red-500 text-xs py-1.5 rounded hover:bg-red-500/30 flex items-center justify-center gap-1"
                                                        >
                                                            <XCircle size={12} /> 반려
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {displayPendingAds.length > 5 && (
                                        <div className="p-3 text-center border-t border-white/5">
                                            <button className="text-xs text-text-muted hover:text-white">
                                                +{displayPendingAds.length - 5}건 더보기
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h3 className="font-bold text-white">실시간 활동 로그</h3>
                            </div>
                            {
                                crmOperationalMode ? (
                                    <div className="p-8 text-center">
                                        <Activity size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                                        <p className="text-text-muted text-sm">활동 로그가 없습니다</p>
                                        <p className="text-xs text-text-muted/50 mt-1">실시간 로깅 시스템 연동 후 표시됩니다</p>
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-4">
                                        {[
                                            { type: 'join', text: '신규 회원 가입 (user123)', time: '방금 전' },
                                            { type: 'ad', text: '새로운 광고 등록 요청', time: '5분 전' },
                                            { type: 'report', text: '게시글 신고 접수', time: '12분 전' },
                                            { type: 'payment', text: 'VIP 상품 결제 완료', time: '25분 전' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full ${log.type === 'join' ? 'bg-blue-500' :
                                                    log.type === 'ad' ? 'bg-yellow-500' :
                                                        log.type === 'report' ? 'bg-red-500' : 'bg-green-500'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm text-white">{log.text}</p>
                                                    <span className="text-xs text-text-muted">{log.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>

                        {/* Reported Content */}
                        <div className="bg-accent rounded-xl border border-white/5 overflow-hidden" >
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white">신고 관리</h3>
                                <AlertTriangle size={16} className="text-red-500" />
                            </div>
                            {
                                crmOperationalMode ? (
                                    <div className="p-8 text-center">
                                        <CheckCircle size={32} className="mx-auto text-green-500 mb-2 opacity-50" />
                                        <p className="text-text-muted text-sm">처리할 신고가 없습니다</p>
                                        <p className="text-xs text-text-muted/50 mt-1">신고 시스템 연동 후 표시됩니다</p>
                                    </div>
                                ) : (
                                    <div className="p-4">
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MessageSquare size={14} className="text-red-500" />
                                                <span className="text-sm font-bold text-red-500">부적절한 게시글</span>
                                            </div>
                                            <p className="text-xs text-white mb-2">"여기 가지마세요 사장님이..."</p>
                                            <div className="flex justify-end gap-2">
                                                <button className="text-xs text-text-muted hover:text-white underline">상세보기</button>
                                                <button className="text-xs bg-red-500 text-white px-2 py-1 rounded">삭제</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div className="mt-8 bg-accent rounded-xl border border-white/5 overflow-hidden" >
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Users size={20} className="text-blue-400" />
                            <h3 className="font-bold text-white">회원 관리</h3>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                                {displayUsers.length}명
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Filter */}
                            <select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value as 'all' | 'worker' | 'advertiser')}
                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
                            >
                                <option value="all">전체</option>
                                <option value="worker">일반회원</option>
                                <option value="advertiser">광고주</option>
                            </select>
                            {/* View Mode Toggle */}
                            <div className="flex bg-black/40 rounded-lg p-1">
                                <button
                                    onClick={() => setUserViewMode('table')}
                                    className={`p-1.5 rounded ${userViewMode === 'table' ? 'bg-primary text-black' : 'text-white/50'}`}
                                >
                                    <Table size={16} />
                                </button>
                                <button
                                    onClick={() => setUserViewMode('card')}
                                    className={`p-1.5 rounded ${userViewMode === 'card' ? 'bg-primary text-black' : 'text-white/50'}`}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="p-4">
                        {displayUsers.filter(u => userFilter === 'all' || u.type === userFilter).length === 0 ? (
                            <p className="text-center text-text-muted py-8">등록된 회원이 없습니다.</p>
                        ) : userViewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm" style={{ minWidth: '700px' }}>
                                    <thead>
                                        <tr className="border-b border-white/10 text-left">
                                            <th className="pb-2 text-text-muted font-medium whitespace-nowrap pr-4" style={{ width: '25%' }}>이메일</th>
                                            <th className="pb-2 text-text-muted font-medium whitespace-nowrap pr-4" style={{ width: '15%' }}>이름</th>
                                            <th className="pb-2 text-text-muted font-medium whitespace-nowrap pr-4" style={{ width: '15%' }}>닉네임</th>
                                            <th className="pb-2 text-text-muted font-medium whitespace-nowrap pr-4" style={{ width: '15%' }}>유형</th>
                                            <th className="pb-2 text-text-muted font-medium whitespace-nowrap pr-4" style={{ width: '15%' }}>가입일</th>
                                            <th className="pb-2 text-text-muted font-medium whitespace-nowrap text-center" style={{ width: '15%' }}>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayUsers.filter(u => userFilter === 'all' || u.type === userFilter).map((user) => (
                                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-3 text-white whitespace-nowrap pr-4 max-w-[200px] truncate" title={user.email}>{user.email}</td>
                                                <td className="py-3 text-white whitespace-nowrap pr-4">{user.name}</td>
                                                <td className="py-3 text-text-muted whitespace-nowrap pr-4">{user.nickname}</td>
                                                <td className="py-3 whitespace-nowrap pr-4">
                                                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${user.type === 'advertiser' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {user.type === 'advertiser' ? '광고주' : '일반'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-text-muted text-xs whitespace-nowrap pr-4">
                                                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        className="text-text-muted hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
                                                        title="회원 상세보기"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {displayUsers.filter(u => userFilter === 'all' || u.type === userFilter).map((user) => (
                                    <div key={user.id} className="bg-black/30 rounded-lg border border-white/5 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${user.type === 'advertiser' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {user.type === 'advertiser' ? '🏢 광고주' : '👤 일반'}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-white mb-1">{user.name}</h4>
                                        <p className="text-sm text-text-muted mb-2">{user.email}</p>
                                        {user.type === 'advertiser' && user.businessName && (
                                            <p className="text-xs text-primary/80">📋 {user.businessName}</p>
                                        )}
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                                            <button className="text-xs text-text-muted hover:text-white flex items-center gap-1">
                                                <Eye size={12} /> 상세보기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Real-time Analytics Section */}
                {
                    analyticsData && (
                        <div className="mt-8 bg-accent rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Activity size={20} className="text-green-400" />
                                    <h3 className="font-bold text-white">실시간 사용자 분석</h3>
                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">
                                        LIVE
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MousePointer size={16} className="text-blue-400" />
                                            <span className="text-xs text-text-muted">클릭 (24h)</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{analyticsData.summary.totalClicks24h}</p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Eye size={16} className="text-purple-400" />
                                            <span className="text-xs text-text-muted">페이지뷰 (24h)</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{analyticsData.summary.pageViews24h}</p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users size={16} className="text-green-400" />
                                            <span className="text-xs text-text-muted">방문자 (24h)</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{analyticsData.summary.uniqueVisitors24h}</p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={16} className="text-primary" />
                                            <span className="text-xs text-text-muted">광고 상호작용</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{analyticsData.summary.adInteractions24h}</p>
                                    </div>
                                </div>

                                {/* Page Popularity */}
                                {analyticsData.pageStats.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <TrendingUp size={16} className="text-primary" />
                                            인기 페이지
                                        </h4>
                                        <div className="space-y-2">
                                            {analyticsData.pageStats.map((stat, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="text-xs text-text-muted w-24 truncate">{stat.page}</span>
                                                    <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${Math.min(100, (stat.count / Math.max(...analyticsData.pageStats.map(s => s.count))) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-white font-bold">{stat.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {/* Ad Performance Analytics */}
                {
                    analyticsData && analyticsData.adStats.length > 0 && (
                        <div className="mt-8 bg-accent rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Target size={20} className="text-primary" />
                                    <h3 className="font-bold text-white">광고 효율 분석</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10 text-left">
                                                <th className="pb-2 text-text-muted font-medium">광고 제목</th>
                                                <th className="pb-2 text-text-muted font-medium">유형</th>
                                                <th className="pb-2 text-text-muted font-medium text-center">노출수</th>
                                                <th className="pb-2 text-text-muted font-medium text-center">클릭수</th>
                                                <th className="pb-2 text-text-muted font-medium text-center">CTR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsData.adStats.slice(0, 10).map((ad) => (
                                                <tr key={ad.adId} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-3 text-white max-w-48 truncate">{ad.title}</td>
                                                    <td className="py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${ad.type === 'vip' ? 'bg-primary/20 text-primary' :
                                                            ad.type === 'special' ? 'bg-secondary/20 text-secondary' :
                                                                'bg-white/10 text-white/70'
                                                            }`}>
                                                            {ad.type.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-center text-white">{ad.views}</td>
                                                    <td className="py-3 text-center text-white">{ad.clicks}</td>
                                                    <td className="py-3 text-center">
                                                        <span className={`font-bold ${parseFloat(ad.ctr) >= 5 ? 'text-green-400' :
                                                            parseFloat(ad.ctr) >= 2 ? 'text-yellow-400' : 'text-red-400'
                                                            }`}>
                                                            {ad.ctr}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {analyticsData.adStats.length === 0 && (
                                    <p className="text-center text-text-muted py-8">아직 수집된 광고 데이터가 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )
                }

                {/* External Analytics Tools Guide - Clarity handles heatmaps */}
                <div className="mt-8 bg-accent rounded-xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Activity size={20} className="text-blue-400" />
                            <h3 className="font-bold text-white">외부 분석 도구 연동</h3>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Microsoft Clarity */}
                        <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-400 font-bold text-lg">C</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Microsoft Clarity</h4>
                                    <p className="text-xs text-text-muted">무료 세션 녹화 + 히트맵</p>
                                </div>
                                <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">무료</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1 mb-3">
                                <li>✓ 실시간 세션 녹화 (사용자 마우스 움직임)</li>
                                <li>✓ 클릭/스크롤 히트맵</li>
                                <li>✓ 분노 클릭(Rage Click) 감지</li>
                                <li>✓ 무제한 무료</li>
                            </ul>
                            <a
                                href="https://clarity.microsoft.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-sm text-blue-400 hover:text-blue-300 underline"
                            >
                                clarity.microsoft.com에서 프로젝트 생성 →
                            </a>
                        </div>

                        {/* Hotjar */}
                        <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-orange-400 font-bold text-lg">H</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Hotjar</h4>
                                    <p className="text-xs text-text-muted">프리미엄 사용자 분석</p>
                                </div>
                                <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">유료 (무료 플랜 있음)</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1">
                                <li>✓ 고급 세션 녹화</li>
                                <li>✓ 설문조사 및 피드백</li>
                                <li>✓ 퍼널 분석</li>
                            </ul>
                        </div>

                        {/* Google Analytics */}
                        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-green-400 font-bold text-lg">G</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Google Analytics 4</h4>
                                    <p className="text-xs text-text-muted">종합 웹 분석</p>
                                </div>
                                <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">무료</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1">
                                <li>✓ 페이지뷰, 세션, 사용자 분석</li>
                                <li>✓ 전환 추적</li>
                                <li>✓ 실시간 리포트</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <p className="text-sm text-yellow-400">
                                💡 <strong>설정 방법:</strong> index.html에 Clarity 스크립트가 이미 추가되어 있습니다.
                                clarity.microsoft.com에서 프로젝트를 생성하고 'YOUR_CLARITY_PROJECT_ID'를 실제 ID로 교체하세요.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {
                selectedUser && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-accent rounded-xl border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-accent">
                                <h3 className="font-bold text-white text-lg">회원 상세 정보</h3>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* User Type Badge */}
                                <div className="flex justify-center mb-4">
                                    <span className={`text-sm px-4 py-2 rounded-full ${selectedUser.type === 'advertiser'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {selectedUser.type === 'advertiser' ? '🏢 광고주 회원' : '👤 일반 회원'}
                                    </span>
                                </div>

                                {/* User Info Grid */}
                                <div className="space-y-3">
                                    <div className="bg-black/30 rounded-lg p-3">
                                        <span className="text-xs text-text-muted block mb-1">이메일</span>
                                        <span className="text-white font-medium">{selectedUser.email}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <span className="text-xs text-text-muted block mb-1">이름</span>
                                            <span className="text-white font-medium">{selectedUser.name}</span>
                                        </div>
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <span className="text-xs text-text-muted block mb-1">닉네임</span>
                                            <span className="text-white font-medium">{selectedUser.nickname}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <span className="text-xs text-text-muted block mb-1">연락처</span>
                                            <span className="text-white font-medium">{selectedUser.phone || '미입력'}</span>
                                        </div>
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <span className="text-xs text-text-muted block mb-1">가입일</span>
                                            <span className="text-white font-medium">
                                                {new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Advertiser specific info */}
                                    {selectedUser.type === 'advertiser' && (
                                        <>
                                            <div className="bg-black/30 rounded-lg p-3">
                                                <span className="text-xs text-text-muted block mb-1">사업자명</span>
                                                <span className="text-white font-medium">{selectedUser.businessName || '미입력'}</span>
                                            </div>
                                            <div className="bg-black/30 rounded-lg p-3">
                                                <span className="text-xs text-text-muted block mb-1">사업자등록번호</span>
                                                <span className="text-white font-medium">{selectedUser.businessNumber || '미입력'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-white/10">
                                    <button className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium">
                                        메시지 보내기
                                    </button>
                                    <button className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium">
                                        회원 정지
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default AdminCRM;
