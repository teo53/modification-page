// =============================================================================
// 📁 src/pages/AdDetail.tsx
// 🏷️  광고 상세 페이지 - 홈페이지 톤앤매너 통일 (다크 테마)
// 📐 레이아웃: 모던 카드 스타일
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Phone, MessageCircle, Share2, AlertCircle,
    MapPin, Eye, Briefcase, Clock, Building2, ChevronLeft,
    ThumbsUp, DollarSign, Calendar, Star, Users, Gift
} from 'lucide-react';
import { fetchAdByIdFromApi } from '../utils/adStorage';
import scrapedAds from '../data/scraped_ads.json';
import ReportButton from '../components/common/ReportButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { estimateGradeFromDays } from '../utils/advertiserGrade';

// =============================================================================
// 타입 정의
// =============================================================================

interface AdvertiserInfo {
    nickname: string;
    call_number?: string;
    call_mgmt_number?: string;
    phone: string;
    kakao_id?: string;
    telegram_id?: string;
    business_name?: string;
    work_location?: string;
    views?: number;
}

interface RecruitmentInfo {
    job_type: string;
    employment_type: string;
    salary: string;
    deadline: string;
    benefits: string[];
    keywords: string[];
}

interface CompanyInfo {
    company_name: string;
    company_address: string;
    representative: string;
}

interface ScrapedAd {
    id: number;
    title: string;
    thumbnail: string;
    detail_images?: string[];
    location: string;
    pay: string;
    phones: string[];
    content: string;
    url?: string;
    scraped_at?: string;
    advertiser?: AdvertiserInfo;
    recruitment?: RecruitmentInfo;
    company?: CompanyInfo;
    rotationCount?: number;
    firstAdDate?: string;
    detail?: {
        description: string;
        images: string[];
    };
}

// =============================================================================
// 유틸리티 함수
// =============================================================================

const calculateActiveDays = (firstAdDate?: string): number => {
    if (!firstAdDate) return 0;
    const start = new Date(firstAdDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// =============================================================================
// 메인 컴포넌트
// =============================================================================

const AdDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ad, setAd] = useState<ScrapedAd | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    // 좋아요 상태 확인 (localStorage에서)
    useEffect(() => {
        if (id) {
            const likedAds = JSON.parse(localStorage.getItem('likedAds') || '{}');
            if (likedAds[id]) {
                setHasLiked(true);
            }
        }
    }, [id]);

    // 좋아요 클릭 핸들러
    const handleLike = () => {
        if (hasLiked || !id) return;

        // localStorage에 저장
        const likedAds = JSON.parse(localStorage.getItem('likedAds') || '{}');
        likedAds[id] = true;
        localStorage.setItem('likedAds', JSON.stringify(likedAds));

        setLikes(l => l + 1);
        setHasLiked(true);
    };

    useEffect(() => {
        const loadAd = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const apiAd = await fetchAdByIdFromApi(id);

                if (apiAd) {
                    const mappedAd: ScrapedAd = {
                        id: Number(apiAd.id),
                        title: apiAd.title,
                        thumbnail: apiAd.images?.[0] || 'https://via.placeholder.com/300x400',
                        location: apiAd.location,
                        pay: apiAd.salary,
                        phones: [apiAd.contact],
                        content: apiAd.description,
                        detail_images: apiAd.images || [],
                        rotationCount: (apiAd as { rotationCount?: number }).rotationCount || 1,
                        firstAdDate: (apiAd as { firstAdDate?: string }).firstAdDate,
                        advertiser: {
                            nickname: apiAd.businessName,
                            phone: apiAd.contact,
                            business_name: apiAd.businessName,
                            work_location: apiAd.location,
                            views: apiAd.views
                        },
                        recruitment: {
                            job_type: '상세내용 참고',
                            employment_type: '협의',
                            salary: apiAd.salary,
                            deadline: apiAd.endDate || '상시모집',
                            benefits: apiAd.themes || [],
                            keywords: []
                        },
                        company: {
                            company_name: apiAd.businessName,
                            company_address: apiAd.location,
                            representative: ''
                        },
                        detail: {
                            description: apiAd.description,
                            images: apiAd.images || []
                        }
                    };
                    setAd(mappedAd);
                } else {
                    const numId = parseInt(id, 10);
                    const localAd = (scrapedAds as ScrapedAd[]).find(a => a.id === numId || String(a.id) === id);

                    if (localAd) {
                        const fullLocalAd: ScrapedAd = {
                            ...localAd,
                            detail_images: localAd.detail_images || localAd.detail?.images || [],
                            advertiser: localAd.advertiser || {} as AdvertiserInfo,
                            recruitment: localAd.recruitment || {} as RecruitmentInfo,
                            company: localAd.company || {} as CompanyInfo,
                            detail: localAd.detail || { description: localAd.content, images: localAd.detail_images || [] }
                        };
                        setAd(fullLocalAd);
                    } else {
                        const sampleAd: ScrapedAd = {
                            id: 0,
                            title: `[샘플] 광고 상세 - ${id}`,
                            thumbnail: `https://picsum.photos/seed/${id}/400/300`,
                            location: '서울 강남구',
                            pay: '시급 150,000원',
                            phones: ['010-0000-0000'],
                            content: `이 광고는 샘플 데이터입니다. 광고 ID: ${id}\n\n실제 광고는 관리자 승인 후 표시됩니다.`,
                            detail_images: [
                                `https://picsum.photos/seed/${id}1/400/300`,
                                `https://picsum.photos/seed/${id}2/400/300`,
                            ],
                            rotationCount: Math.floor(Math.random() * 50) + 1,
                            firstAdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                            advertiser: {
                                nickname: '샘플 업체',
                                phone: '010-0000-0000',
                                business_name: '샘플 비즈니스',
                                work_location: '서울 강남구',
                                views: Math.floor(Math.random() * 5000) + 100
                            },
                            recruitment: {
                                job_type: '상세내용 참고',
                                employment_type: '협의',
                                salary: '시급 150,000원',
                                deadline: '상시모집',
                                benefits: ['숙소제공', '식사제공', '교통비지원'],
                                keywords: ['샘플', '테스트']
                            },
                            company: {
                                company_name: '샘플 업체',
                                company_address: '서울 강남구',
                                representative: ''
                            },
                            detail: {
                                description: `이 광고는 샘플 데이터입니다.\n\n광고 ID: ${id}`,
                                images: [
                                    `https://picsum.photos/seed/${id}1/400/300`,
                                    `https://picsum.photos/seed/${id}2/400/300`,
                                ]
                            }
                        };
                        setAd(sampleAd);
                    }
                }
            } catch (err) {
                console.error(err);
                setError('오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadAd();
    }, [id]);

    // 로딩 상태
    if (loading) {
        return <LoadingSpinner fullScreen text="광고 정보를 불러오는 중" />;
    }

    // 에러 상태
    if (error || !ad) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-accent rounded-xl border border-white/10 p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">광고를 찾을 수 없습니다</h2>
                    <p className="text-text-muted">{error || '요청하신 광고 정보가 존재하지 않습니다.'}</p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 데이터 추출
    const advertiser = ad.advertiser || {} as AdvertiserInfo;
    const recruitment = ad.recruitment || {} as RecruitmentInfo;
    const company = ad.company || {} as CompanyInfo;
    const detailImages = ad.detail?.images || ad.detail_images || [];
    const primaryPhone = advertiser?.phone || ad.phones?.[0] || '';
    const rotationCount = ad.rotationCount || 1;
    const activeDays = calculateActiveDays(ad.firstAdDate) || Math.floor(Math.random() * 500) + 30;

    // 광고주 등급 계산 - estimateGradeFromDays는 AdvertiserGrade 객체 반환
    const gradeInfo = estimateGradeFromDays(activeDays);
    const gradeIcon = gradeInfo.icon;
    const gradeBgColor = gradeInfo.bgColor;
    const gradeTextColor = gradeInfo.textColor;

    return (
        <div className="pb-24 md:pb-12 bg-background min-h-screen">
            {/* 모바일 헤더 */}
            <div className="md:hidden sticky top-0 z-40 bg-accent/95 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
                <Link to="/" className="text-white hover:text-primary transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <span className="font-bold text-white">채용정보</span>
                <div className="flex items-center gap-3">
                    <ReportButton targetType="ad" targetId={String(ad.id)} targetTitle={ad.title} />
                    <button className="text-text-muted hover:text-white transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* 메인 컨테이너 */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

                {/* ============================================= */}
                {/* 히어로 섹션 - 업체 핵심 정보 */}
                {/* ============================================= */}
                <div className="relative bg-gradient-to-br from-accent via-accent to-background rounded-2xl border border-white/10 overflow-hidden">
                    {/* 배경 블러 효과 */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

                    <div className="relative p-6">
                        {/* 상단: 등급 배지 & 조회수 */}
                        <div className="flex items-center justify-between mb-6">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${gradeBgColor}`}>
                                <span className="text-xl">{gradeIcon}</span>
                                <span className={`font-bold ${gradeTextColor}`}>{gradeInfo.nameKo}</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-muted text-sm">
                                <span className="flex items-center gap-1">
                                    <Eye size={16} />
                                    {advertiser.views?.toLocaleString() || Math.floor(Math.random() * 50000)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {rotationCount}회 {activeDays}일
                                </span>
                            </div>
                        </div>

                        {/* 메인 정보 영역 */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* 썸네일 */}
                            <div className="w-full md:w-48 h-48 bg-black/30 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={ad.thumbnail}
                                    alt={ad.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/192?text=No+Image';
                                    }}
                                />
                            </div>

                            {/* 정보 */}
                            <div className="flex-1 space-y-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                    {advertiser.nickname || ad.title}
                                </h1>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <MapPin size={18} className="text-primary" />
                                        <span>{advertiser.work_location || ad.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <DollarSign size={18} className="text-green-400" />
                                        <span className="text-green-400 font-bold">{recruitment.salary || ad.pay || '협의'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <Building2 size={18} className="text-blue-400" />
                                        <span>{advertiser.business_name || company.company_name || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <Calendar size={18} className="text-pink-400" />
                                        <span>{recruitment.deadline || '상시모집'}</span>
                                    </div>
                                </div>

                                {/* 연락처 버튼 */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <a
                                        href={`tel:${primaryPhone}`}
                                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all hover:scale-105"
                                    >
                                        <Phone size={20} />
                                        전화하기
                                    </a>
                                    <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 bg-[#FAE100] text-[#371D1E] font-bold rounded-xl hover:bg-[#FAE100]/90 transition-all hover:scale-105">
                                        <MessageCircle size={20} />
                                        카톡문의
                                    </button>
                                    <button
                                        onClick={handleLike}
                                        disabled={hasLiked}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${hasLiked
                                                ? 'bg-pink-500/20 border border-pink-500/30 cursor-not-allowed'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <ThumbsUp size={18} className={hasLiked ? 'text-pink-500' : 'text-pink-400'} />
                                        <span className={`font-bold ${hasLiked ? 'text-pink-400' : 'text-white'}`}>{likes}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================= */}
                {/* 업소 이미지 갤러리 */}
                {/* ============================================= */}
                {detailImages.length > 0 && (
                    <div className="bg-accent rounded-2xl border border-white/10 overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                            <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                <Star size={18} className="text-pink-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">업소 이미지</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                {detailImages.slice(0, 5).map((img, idx) => (
                                    <div key={idx} className="aspect-[4/3] bg-black/30 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                                        <img
                                            src={img}
                                            alt={`업소 이미지 ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x90?text=No+Image';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================= */}
                {/* 채용 정보 카드 */}
                {/* ============================================= */}
                <div className="bg-accent rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Briefcase size={18} className="text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">채용 정보</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow icon={<Users size={16} />} label="업무내용" value={recruitment.job_type || '기타'} />
                        <InfoRow icon={<Briefcase size={16} />} label="고용형태" value={recruitment.employment_type || '협의'} />
                        <InfoRow icon={<DollarSign size={16} />} label="급여" value={recruitment.salary || ad.pay || '면접 후 협의'} highlight />
                        <InfoRow icon={<Calendar size={16} />} label="마감일자" value={recruitment.deadline || '상시모집'} />

                        {/* 편의사항 */}
                        <div className="md:col-span-2 flex items-start gap-3 py-3 border-t border-white/5">
                            <Gift size={16} className="text-text-muted mt-0.5" />
                            <div>
                                <div className="text-text-muted text-sm mb-2">편의사항</div>
                                <div className="flex flex-wrap gap-2">
                                    {(recruitment.benefits?.length > 0 ? recruitment.benefits : ['선불가능', '뒷방없음', '헛세없음', '월룸제공']).map((b, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================= */}
                {/* 상세 이미지 */}
                {/* ============================================= */}
                {detailImages.length > 0 && (
                    <div className="bg-accent rounded-2xl border border-white/10 overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Star size={18} className="text-green-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">상세 정보</h2>
                        </div>
                        <div className="p-4 flex flex-col items-center gap-4">
                            {detailImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`상세 이미지 ${idx + 1}`}
                                    className="max-w-full h-auto rounded-xl"
                                    style={{ maxWidth: '100%' }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ============================================= */}
                {/* 기업 정보 */}
                {/* ============================================= */}
                <div className="bg-accent rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            <Building2 size={18} className="text-amber-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">기업 정보</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <InfoRow icon={<Building2 size={16} />} label="회사명" value={company.company_name || advertiser.business_name || '-'} />
                        <InfoRow icon={<MapPin size={16} />} label="회사주소" value={company.company_address || ad.location || '-'} />
                        <InfoRow icon={<Users size={16} />} label="대표자명" value={company.representative || '-'} />
                    </div>
                </div>

                {/* 하단 안내 */}
                <div className="bg-gradient-to-r from-pink-500/20 to-primary/20 rounded-2xl border border-white/10 p-6 text-center">
                    <p className="text-white">
                        <span className="text-primary font-bold">'달빛알바에서 보고 연락드립니다'</span>
                        <br />
                        <span className="text-text-muted text-sm">라고 하시면 정확한 상담을 받으실 수 있습니다.</span>
                    </p>
                </div>
            </div>

            {/* 모바일 하단 고정 버튼 - z-30으로 헤더(z-40)보다 아래 설정, safe-area 대응 */}
            <div
                className="md:hidden fixed bottom-0 left-0 right-0 bg-accent/95 backdrop-blur-md border-t border-white/10 z-30"
                style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
                <div className="p-4 pt-3 flex gap-3">
                    <a
                        href={`tel:${primaryPhone}`}
                        className="flex-1 py-4 rounded-xl bg-primary text-black font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform touch-manipulation"
                    >
                        <Phone size={20} />
                        전화하기
                    </a>
                    <button
                        className="flex-1 py-4 rounded-xl bg-[#FAE100] text-[#371D1E] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform touch-manipulation"
                        onClick={() => window.open('https://open.kakao.com/', '_blank')}
                    >
                        <MessageCircle size={20} />
                        카톡문의
                    </button>
                </div>
            </div>
        </div>
    );
};

// 정보 행 컴포넌트
const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}> = ({ icon, label, value, highlight }) => (
    <div className="flex items-center gap-3 py-2">
        <span className="text-text-muted">{icon}</span>
        <span className="text-text-muted text-sm w-20">{label}</span>
        <span className={`${highlight ? 'text-primary font-bold' : 'text-white'}`}>{value}</span>
    </div>
);

export default AdDetail;
