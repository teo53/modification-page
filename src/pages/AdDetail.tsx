import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Phone, MessageCircle, Heart, Share2, AlertCircle, Calendar,
    User, Eye, Briefcase, DollarSign, Tag, Building2, ChevronUp, ChevronDown, ChevronLeft, MessageSquare
} from 'lucide-react';
import { fetchAdByIdFromApi } from '../utils/adStorage';
import scrapedAds from '../data/scraped_ads.json';
import ReportButton from '../components/common/ReportButton';

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
    detail?: {
        description: string;
        images: string[];
    };
}

// 업체정보 섹션 컴포넌트 (재사용 가능)
const AdvertiserInfoSection: React.FC<{
    ad: ScrapedAd;
    advertiser: AdvertiserInfo;
    company?: CompanyInfo;
    primaryPhone: string;
    isCompact?: boolean;
}> = ({ ad, advertiser, company, primaryPhone, isCompact: _isCompact }) => (
    <div className="bg-accent rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-3 border-b border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={20} className="text-primary" />
                업체정보 안내
            </h2>
        </div>
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Thumbnail - 고정 크기, 잘리지 않게 */}
                <div className="shrink-0 flex justify-center md:justify-start">
                    <div className="w-28 h-36 md:w-32 md:h-40 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                        <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            className="w-full h-full object-contain bg-black"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x160?text=No+Image';
                            }}
                        />
                    </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <InfoRow label="닉네임" value={advertiser.nickname || ad.title} />
                        <InfoRow label="전화번호" value={advertiser.phone || primaryPhone} highlight />
                        <InfoRow label="카톡 ID" value={advertiser.kakao_id} icon="kakao" />
                        <InfoRow label="상호" value={advertiser.business_name || company?.company_name} />
                        <InfoRow label="근무지역" value={advertiser.work_location || ad.location} />
                        {advertiser.call_number && <InfoRow label="콜번호" value={advertiser.call_number} />}
                        {advertiser.telegram_id && <InfoRow label="텔레그램" value={advertiser.telegram_id} icon="telegram" />}
                    </div>
                    {advertiser.views && advertiser.views > 0 && (
                        <div className="pt-2 flex items-center gap-1 text-text-muted">
                            <Eye size={14} />
                            <span>조회 <span className="text-white font-medium">{advertiser.views?.toLocaleString()}</span></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// 기본채용정보 섹션 컴포넌트 (재사용 가능)
const RecruitmentInfoSection: React.FC<{
    recruitment: RecruitmentInfo;
    ad: ScrapedAd;
}> = ({ recruitment, ad }) => (
    <div className="bg-accent rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-3 border-b border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-blue-400" />
                기본채용정보
            </h2>
        </div>
        <div className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-xs text-text-muted">업무내용</span>
                    <p className={`${recruitment.job_type ? 'text-white' : 'text-text-muted italic'}`}>
                        {recruitment.job_type || '상세내용 참고'}
                    </p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-text-muted">고용형태</span>
                    <p className={`${recruitment.employment_type ? 'text-white' : 'text-text-muted italic'}`}>
                        {recruitment.employment_type || '협의 가능'}
                    </p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                        <DollarSign size={12} /> 급여
                    </span>
                    <p className="text-lg font-bold text-primary">{recruitment.salary || ad.pay || '면접 후 결정'}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar size={12} /> 마감일자
                    </span>
                    <p className="text-white">{recruitment.deadline || '상시모집'}</p>
                </div>
            </div>

            {/* Benefits */}
            {recruitment.benefits && recruitment.benefits.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                    <span className="text-xs text-text-muted mb-2 block">우대사항</span>
                    <div className="flex flex-wrap gap-2">
                        {recruitment.benefits.map((benefit, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-white/5 text-sm text-white border border-white/10">
                                {benefit}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Keywords */}
            {recruitment.keywords && recruitment.keywords.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                    <span className="text-xs text-text-muted mb-2 flex items-center gap-1">
                        <Tag size={12} /> 키워드
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {recruitment.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

// 기업정보 섹션 컴포넌트 (재사용 가능)
const CompanyInfoSection: React.FC<{
    company: CompanyInfo;
    advertiser: AdvertiserInfo;
}> = ({ company, advertiser }) => {
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);

    return (
        <div className="bg-accent rounded-xl border border-white/10 overflow-hidden">
            <button
                onClick={() => setShowCompanyInfo(!showCompanyInfo)}
                className="w-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-6 py-3 border-b border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building2 size={20} className="text-amber-400" />
                    기업정보 확인하기
                </h2>
                {showCompanyInfo ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
            </button>

            {showCompanyInfo && (
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                            <span className="text-text-muted w-24 shrink-0">회사명</span>
                            <span className="text-white font-medium">{company.company_name || advertiser.business_name || '정보 없음'}</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                            <span className="text-text-muted w-24 shrink-0">회사주소</span>
                            <span className="text-white">{company.company_address || '정보 없음'}</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                            <span className="text-text-muted w-24 shrink-0">대표자명</span>
                            <span className="text-white">{company.representative || '정보 없음'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ad, setAd] = useState<ScrapedAd | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAd = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Try to fetch from API first
                const apiAd = await fetchAdByIdFromApi(id);

                if (apiAd) {
                    // Map API UserAd to View Model (ScrapedAd)
                    const mappedAd: ScrapedAd = {
                        id: Number(apiAd.id), // Ensure ID type compat
                        title: apiAd.title,
                        thumbnail: apiAd.images?.[0] || 'https://via.placeholder.com/300x400',
                        location: apiAd.location,
                        pay: apiAd.salary,
                        phones: [apiAd.contact],
                        content: apiAd.description,
                        detail_images: apiAd.images || [], // Ensure it's an array
                        advertiser: {
                            nickname: apiAd.businessName,
                            call_number: '',
                            call_mgmt_number: '',
                            phone: apiAd.contact,
                            kakao_id: '', // Add to UserAd if needed
                            telegram_id: '',
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
                    // Fallback to local JSON if not found in API (legacy support)
                    const numId = parseInt(id, 10);
                    const localAd = (scrapedAds as ScrapedAd[]).find(a => a.id === numId || String(a.id) === id);
                    if (localAd) {
                        // Ensure all properties are present for localAd as well
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
                        setError('광고를 찾을 수 없습니다.');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

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

    // Extract data with fallbacks (Keep existing view logic)

    // Extract data with fallbacks
    const advertiser = ad.advertiser || {} as AdvertiserInfo;
    const recruitment = ad.recruitment || {} as RecruitmentInfo;
    const company = ad.company || {} as CompanyInfo;
    const detailImages = ad.detail?.images || ad.detail_images || [];
    const primaryPhone = advertiser?.phone || ad.phones?.[0] || '';

    return (
        <div className="pb-24 md:pb-12">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
                <Link to="/" className="text-white"><ChevronLeft /></Link>
                <span className="font-bold text-white">채용정보</span>
                <div className="flex items-center gap-3">
                    <ReportButton targetType="ad" targetId={String(ad.id)} targetTitle={ad.title} />
                    <button className="text-white"><Share2 size={20} /></button>
                </div>
            </div>

            <div className="container mx-auto px-4 md:py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="md:col-span-2 space-y-6">

                        {/* ===== 최상단: 업체정보 + 채용정보 ===== */}
                        <AdvertiserInfoSection ad={ad} advertiser={advertiser} company={company} primaryPhone={primaryPhone} />
                        <RecruitmentInfoSection recruitment={recruitment} ad={ad} />

                        {/* ===== 상세채용정보 (Detail Content) Section ===== */}
                        <div className="bg-accent rounded-xl border border-white/10 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-3 border-b border-white/10">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MessageSquare size={20} className="text-green-400" />
                                    상세 채용정보
                                </h2>
                            </div>
                            <div className="p-4 md:p-6">
                                {/* Description Text */}
                                {(ad.detail?.description || ad.content) && (
                                    <div className="bg-background/50 p-4 rounded-lg mb-6 text-text-muted leading-relaxed whitespace-pre-line">
                                        {ad.detail?.description || ad.content}
                                    </div>
                                )}

                                {/* Detail Images - 중앙 정렬, 최대 폭 제한 */}
                                {detailImages.length > 0 ? (
                                    <div className="flex flex-col items-center gap-4">
                                        {detailImages.map((img, idx) => (
                                            <div key={idx} className="w-full max-w-[600px] rounded-xl border border-white/10 overflow-hidden bg-black/20">
                                                <img
                                                    src={img}
                                                    alt={`상세 이미지 ${idx + 1}`}
                                                    className="w-full h-auto object-contain max-h-[800px]"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-text-muted py-8">상세 이미지가 없습니다.</p>
                                )}
                            </div>
                        </div>

                        {/* ===== 최하단: 업체정보 + 채용정보 (반복) ===== */}
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-sm text-text-muted text-center mb-4">📋 업체정보 다시보기</p>
                        </div>
                        <AdvertiserInfoSection ad={ad} advertiser={advertiser} company={company} primaryPhone={primaryPhone} isCompact />
                        <RecruitmentInfoSection recruitment={recruitment} ad={ad} />

                        {/* ===== 기업정보 (Company Info) Section ===== */}
                        <CompanyInfoSection company={company} advertiser={advertiser} />

                    </div>

                    {/* Right Column: Sticky Contact (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 space-y-4 p-6 rounded-xl bg-accent border border-white/10">
                            <div className="text-center mb-4">
                                <div className="w-24 h-28 bg-white/10 rounded-xl mx-auto mb-3 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={ad.thumbnail}
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x112?text=Logo';
                                        }}
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white">{advertiser.nickname || ad.title.slice(0, 15)}</h3>
                                <p className="text-sm text-text-muted">{advertiser.work_location || ad.location}</p>
                            </div>

                            {primaryPhone && (
                                <button className="w-full py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                                    <Phone size={20} />
                                    {primaryPhone}
                                </button>
                            )}

                            {advertiser.kakao_id && (
                                <button className="w-full py-3 rounded-lg bg-[#FAE100] text-[#371D1E] font-bold hover:bg-[#FCE840] transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle size={20} />
                                    카카오톡: {advertiser.kakao_id}
                                </button>
                            )}

                            {advertiser.telegram_id && (
                                <button className="w-full py-3 rounded-lg bg-[#0088cc] text-white font-bold hover:bg-[#0099dd] transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle size={20} />
                                    텔레그램: {advertiser.telegram_id}
                                </button>
                            )}

                            <button className="w-full py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                                <Heart size={20} />
                                관심등록
                            </button>

                            <div className="pt-2 border-t border-white/10 mt-2 flex justify-end">
                                <ReportButton targetType="ad" targetId={String(ad.id)} targetTitle={ad.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-white/10 flex gap-2 z-50">
                <button className="flex-1 py-3 rounded-lg bg-primary text-black font-bold flex items-center justify-center gap-2">
                    <Phone size={20} />
                    전화하기
                </button>
                <button className="flex-1 py-3 rounded-lg bg-[#FAE100] text-[#371D1E] font-bold flex items-center justify-center gap-2">
                    <MessageCircle size={20} />
                    카톡문의
                </button>
            </div>
        </div>
    );
};

// Helper component for info rows
const InfoRow: React.FC<{ label: string; value?: string; highlight?: boolean; icon?: string }> = ({ label, value, highlight, icon }) => {
    if (!value) return null;

    return (
        <div className="flex items-start gap-2">
            <span className="text-text-muted w-16 md:w-20 shrink-0 text-xs md:text-sm">{label}</span>
            <span className={`text-sm md:text-base break-all ${highlight ? 'text-primary font-bold' : 'text-white'} ${icon === 'kakao' ? 'text-yellow-400' : icon === 'telegram' ? 'text-blue-400' : ''}`}>
                {value}
            </span>
        </div>
    );
};

export default AdDetail;
