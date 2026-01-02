import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Building2, FileText, AlertCircle, CheckCircle, Palette, RefreshCw, Clock, Zap } from 'lucide-react';
import RichTextEditor from '../components/ui/RichTextEditor';
import AdCard from '../components/ad/AdCard';
import type { AdFormState } from '../types/ad';
import { getCurrentUser } from '../utils/auth';
import { createAd } from '../utils/adStorage';

// Helper for districts
const getDistrictsForCity = (city: string) => {
    const districts: Record<string, string[]> = {
        '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
        '경기': ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
        '인천': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
        '부산': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
        // Add minimal generic lists for others to prevent crashes, or just empty
    };
    return districts[city] || ['전체'];
};

const PostAd = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [isAuthorized, setIsAuthorized] = useState(false);

    // Multi-select products state with period extension (qty = number of periods)
    const [selectedProducts, setSelectedProducts] = useState<Record<string, { qty: number; startDate: string }>>({});
    const [highlightSettings, setHighlightSettings] = useState<{ color: 'yellow' | 'pink' | 'green' | 'cyan'; text: string }>({ color: 'yellow', text: '' });
    const [jumpUpSettings, setJumpUpSettings] = useState<{ enabled: boolean; interval: number; count: number }>({ enabled: false, interval: 1, count: 10 });
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [adIcon, setAdIcon] = useState<string | null>(null);
    const [allAgreed, setAllAgreed] = useState(false);
    const [individualAgreements, setIndividualAgreements] = useState(Array(6).fill(false));

    const handleAllAgreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setAllAgreed(isChecked);
        setIndividualAgreements(Array(6).fill(isChecked));
    };

    const handleIndividualAgreementChange = (index: number, isChecked: boolean) => {
        const newIndividualAgreements = [...individualAgreements];
        newIndividualAgreements[index] = isChecked;
        setIndividualAgreements(newIndividualAgreements);

        if (!isChecked) {
            setAllAgreed(false);
        } else {
            if (newIndividualAgreements.every(Boolean)) {
                setAllAgreed(true);
            }
        }
    };



    const today = new Date().toISOString().split('T')[0];
    const cities = ['서울', '경기', '인천', '부산'];

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<AdFormState>({
        businessName: '',
        managerName: '',
        managerPhone: '',
        messengers: { kakao: '', line: '', telegram: '' },
        address: {
            zonecode: '',
            roadAddress: '',
            detailAddress: ''
        },
        isLocationVerified: false,
        businessLicense: null,
        title: '',
        businessLogo: null,
        adLogo: null,
        industry: { level1: 'entertainment', level2: '' },
        location: { city: '', district: '', town: '' },
        recruitmentType: 'hire',
        workHours: { type: 'night' as const, start: '', end: '' },
        salary: { type: 'negotiable' as const, amount: '' },
        ageLimit: { start: 20, end: 0, noLimit: false },
        gender: 'female',
        experience: 'novice',
        daysOff: 'negotiable',

        // Detailed Recruitment Outline
        recruitNumber: '',
        deadline: { date: '', always: false },
        workDays: [],
        welfare: [],
        preferredConditions: [],
        receptionMethods: [],
        requiredDocuments: [],

        keywords: [],
        customKeywords: '',
        images: Array(5).fill({ file: null, description: '', preview: null }),
        description: '',
        themes: []
    });

    const previewImage = useMemo(() => {
        if (formData.images?.[0]?.file) {
            return URL.createObjectURL(formData.images[0].file);
        }
        return '';
    }, [formData.images]);

    // Auth Check Effect
    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        if (user.type !== 'advertiser') {
            setLoading(false); // Stop loading if it was true
            return; // Stay on page but show access denied view (handled in render)
        }

        setIsAuthorized(true);
    }, [navigate]);

    if (!isAuthorized && getCurrentUser()) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl border border-border shadow-lg p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-text-main">접근 권한이 없습니다</h2>
                    <p className="text-text-muted">광고주 계정만 광고를 등록할 수 있습니다.<br />광고주로 회원가입 후 이용해주세요.</p>
                    <div className="flex gap-2 justify-center pt-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-surface hover:bg-accent text-text-main rounded-lg transition-colors border border-border"
                        >
                            홈으로
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            광고주 가입
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthorized) return null; // Prevent flash while redirecting




    const products = [
        {
            id: 'diamond',
            name: '다이아몬드',
            price: '5,000,000원',
            priceNum: 5000000,
            duration: '30일',
            durationDays: 30,
            color: 'border-cyan-300',
            bg: 'bg-gradient-to-br from-cyan-400/10 via-white/5 to-cyan-400/10',
            bgFill: 'bg-gradient-to-r from-white to-cyan-200',
            textColor: 'text-cyan-200',
            features: ['최상단 2슬롯', '다이아몬드 보더', '연기 효과', '최대 노출'],
            description: '최상위 프리미엄 광고. 보라색 벨벳 배경 위 최상단에 2개만 노출됩니다.'
        },
        {
            id: 'sapphire',
            name: '사파이어',
            price: '3,000,000원',
            priceNum: 3000000,
            duration: '30일',
            durationDays: 30,
            color: 'border-blue-400',
            bg: 'bg-blue-500/10',
            bgFill: 'bg-gradient-to-r from-blue-400 to-blue-500',
            textColor: 'text-blue-400',
            features: ['상단 3슬롯', '사파이어 보더', '프리미엄 배치'],
            description: '다이아몬드 바로 아래, 3개 슬롯에 노출됩니다.'
        },
        {
            id: 'ruby',
            name: '루비',
            price: '2,000,000원',
            priceNum: 2000000,
            duration: '30일',
            durationDays: 30,
            color: 'border-red-400',
            bg: 'bg-red-500/10',
            bgFill: 'bg-gradient-to-r from-red-400 to-rose-500',
            textColor: 'text-rose-400',
            features: ['중상단 4슬롯', '루비 보더', '우선 배치'],
            description: '사파이어 아래, 4개 슬롯에 노출됩니다.'
        },
        {
            id: 'gold',
            name: '골드',
            price: '1,000,000원',
            priceNum: 1000000,
            duration: '30일',
            durationDays: 30,
            color: 'border-yellow-400',
            bg: 'bg-yellow-400/10',
            bgFill: 'bg-gradient-to-r from-yellow-400 to-amber-500',
            textColor: 'text-amber-400',
            features: ['중단 5슬롯', '골드 보더', '형광펜 강조'],
            description: '루비 아래, 5개 슬롯에 노출됩니다.'
        },
        {
            id: 'premium',
            name: '프리미엄',
            price: '500,000원',
            priceNum: 500000,
            duration: '15일',
            durationDays: 15,
            color: 'border-purple-400',
            bg: 'bg-purple-400/10',
            bgFill: 'bg-purple-400',
            textColor: 'text-purple-400',
            features: ['프리미엄 섹션', '일반 카드 형태'],
            description: '프리미엄 섹션에 카드 형태로 노출됩니다.'
        },
        {
            id: 'special',
            name: '스페셜',
            price: '300,000원',
            priceNum: 300000,
            duration: '7일',
            durationDays: 7,
            color: 'border-indigo-400',
            bg: 'bg-indigo-400/10',
            bgFill: 'bg-indigo-400',
            textColor: 'text-indigo-400',
            features: ['스페셜 섹션', '리스트 형태'],
            description: '스페셜 섹션에 리스트 형태로 노출됩니다.'
        },
        {
            id: 'highlight',
            name: '형광펜 텍스트',
            price: '300,000원',
            priceNum: 300000,
            duration: '30일',
            durationDays: 30,
            color: 'border-yellow-500',
            bg: 'bg-yellow-500/10',
            bgFill: 'bg-yellow-500',
            textColor: 'text-yellow-500',
            features: ['형광펜 효과 적용', '상단 섹션 우선 노출', '주목도 상승'],
            description: '일반 텍스트 상단에 형광펜 효과로 강조되어 노출됩니다.'
        },
        {
            id: 'general', // Keeping ID as general but renaming UI for standard text
            name: '일반 텍스트',
            price: '150,000원',
            priceNum: 150000,
            duration: '30일',
            durationDays: 30,
            color: 'border-white/20',
            bg: 'bg-white/5',
            bgFill: 'bg-gray-500',
            textColor: 'text-gray-400',
            features: ['기본 텍스트 리스트', '저렴한 비용'],
            description: '일반 텍스트 리스트에 노출됩니다.'
        }
    ];

    const handleInputChange = (field: keyof AdFormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (!formData.businessName || !formData.title) {
            setError('업소명과 공고 제목은 필수입니다.');
            setLoading(false);
            return;
        }

        if (Object.keys(selectedProducts).length === 0) {
            setError('최소 1개의 광고 상품을 선택해주세요.');
            setLoading(false);
            return;
        }

        // Determine product type based on selection
        let productType: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'premium' | 'special' | 'regular' | 'highlight' | 'jumpup' = 'regular';

        if (selectedProducts['diamond']) {
            productType = 'diamond';
        } else if (selectedProducts['sapphire']) {
            productType = 'sapphire';
        } else if (selectedProducts['ruby']) {
            productType = 'ruby';
        } else if (selectedProducts['gold']) {
            productType = 'gold';
        } else if (selectedProducts['premium']) {
            productType = 'premium';
        } else if (selectedProducts['special']) {
            productType = 'special';
        } else if (selectedProducts['highlight']) {
            productType = 'highlight';
        }

        // Create ad
        const result = createAd({
            title: formData.title,
            businessName: formData.businessName,
            location: (formData.location.city && formData.location.district)
                ? `${formData.location.city} ${formData.location.district}`
                : (formData.address.roadAddress || '서울특별시'),
            salary: formData.salary.amount || '협의',
            workHours: formData.workHours.type || '주간',
            description: formData.description || '',
            contact: formData.managerPhone || '',
            productType: productType,
            highlightConfig: selectedProducts['highlight'] ? {
                color: highlightSettings.color,
                text: highlightSettings.text
            } : undefined,
            jumpUpConfig: jumpUpSettings.enabled ? {
                enabled: true,
                intervalDays: jumpUpSettings.interval,
                totalCount: jumpUpSettings.count,
                remainingCount: jumpUpSettings.count
            } : undefined
        });

        if (result.success) {
            setSuccess(result.message + ' 대시보드로 이동합니다...');
            setTimeout(() => {
                navigate('/advertiser/dashboard');
            }, 1500);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-text-main p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-text-main">광고 등록</h1>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                        {!getCurrentUser() && (
                            <button onClick={() => navigate('/login')} className="ml-auto text-sm underline">
                                로그인하기
                            </button>
                        )}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
                        <CheckCircle size={20} />
                        <span>{success}</span>
                    </div>
                )}

                {/* Progress Steps */}
                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10" />
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex flex-col items-center gap-2 bg-background px-4 ${step >= s ? 'text-primary' : 'text-text-muted'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s ? 'border-primary bg-primary/20' : 'border-border bg-white'}`}>
                                {step > s ? <Check size={20} /> : s}
                            </div>
                            <span className="text-sm font-medium">
                                {s === 1 ? '업소 정보' : s === 2 ? '모집 내용' : '상품 선택'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Business Info */}
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                            <Building2 className="text-primary" /> 1. 업소 정보 입력
                        </h2>

                        {/* Business Name & Manager */}
                        <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Building2 size={16} className="text-primary" /> 업소 기본 정보
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">업소명 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
                                        placeholder="업소명을 입력하세요"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">담당자명 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.managerName}
                                        onChange={(e) => handleInputChange('managerName', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
                                        placeholder="담당자 이름을 입력하세요"
                                    />
                                </div>
                            </div>

                            {/* Contact Numbers */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">핸드폰 번호 <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        value={formData.managerPhone}
                                        onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">전화번호</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
                                        placeholder="02-000-0000 (선택)"
                                    />
                                </div>
                            </div>

                            {/* Messenger IDs */}
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">메신저 ID</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-white/10">
                                        <span className="text-yellow-400 font-bold text-xs uppercase w-14 shrink-0">카카오톡</span>
                                        <input
                                            type="text"
                                            value={formData.messengers.kakao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, messengers: { ...prev.messengers, kakao: e.target.value } }))}
                                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/30"
                                            placeholder="ID 입력"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-white/10">
                                        <span className="text-green-500 font-bold text-xs uppercase w-14 shrink-0">라인</span>
                                        <input
                                            type="text"
                                            value={formData.messengers.line}
                                            onChange={(e) => setFormData(prev => ({ ...prev, messengers: { ...prev.messengers, line: e.target.value } }))}
                                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/30"
                                            placeholder="ID 입력"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-white/10">
                                        <span className="text-blue-400 font-bold text-xs uppercase w-14 shrink-0">텔레그램</span>
                                        <input
                                            type="text"
                                            value={formData.messengers.telegram}
                                            onChange={(e) => setFormData(prev => ({ ...prev, messengers: { ...prev.messengers, telegram: e.target.value } }))}
                                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/30"
                                            placeholder="ID 입력"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Business Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">업소 로고</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-background border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-text-muted hover:border-primary/50 transition-colors cursor-pointer">
                                        {formData.businessLogo ? (
                                            <img src={URL.createObjectURL(formData.businessLogo)} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <span className="text-2xl">+</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        <p>권장 크기: 200x200px</p>
                                        <p>지원 형식: JPG, PNG</p>
                                        <label className="inline-block mt-2 px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-white">
                                            파일 선택
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        handleInputChange('businessLogo', e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Selection */}
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">지역 (시/도)</label>
                                <select
                                    value={formData.location.city}
                                    onChange={(e) => {
                                        const newCity = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            location: { ...prev.location, city: newCity, district: '' }
                                        }));
                                    }}
                                    className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                >
                                    <option value="">시/도 선택</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">지역 (구/군)</label>
                                <select
                                    value={formData.location.district}
                                    onChange={(e) => handleInputChange('location', { ...formData.location, district: e.target.value })}
                                    className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    disabled={!formData.location.city}
                                >
                                    <option value="">구/군 선택</option>
                                    {formData.location.city && getDistrictsForCity(formData.location.city).map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-8 border-t border-white/10">
                            <button
                                onClick={() => setStep(2)}
                                className="bg-primary text-black font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                다음 단계
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Recruitment Info */}
                {step === 2 && (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                            <FileText className="text-primary" /> 2. 모집 내용 입력
                        </h2>

                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">공고 제목 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-lg font-bold"
                                placeholder="눈에 띄는 제목을 입력해주세요"
                                maxLength={40}
                            />
                        </div>

                        {/* Enterprise & Contact Info */}
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
                            <h3 className="text-white font-bold text-sm mb-4">📢 담당자 연락처 정보</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-muted block mb-1">담당자명</label>
                                    <input
                                        type="text"
                                        value={formData.managerName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white placeholder-white/30"
                                        placeholder="담당자 이름"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted block mb-1">연락처</label>
                                    <input
                                        type="tel"
                                        value={formData.managerPhone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, managerPhone: e.target.value }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white placeholder-white/30"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                                    <span className="text-yellow-400 font-bold text-xs uppercase w-12">Kakao</span>
                                    <input
                                        type="text"
                                        value={formData.messengers.kakao}
                                        onChange={(e) => setFormData(prev => ({ ...prev, messengers: { ...prev.messengers, kakao: e.target.value } }))}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/20"
                                        placeholder="ID 입력"
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                                    <span className="text-green-500 font-bold text-xs uppercase w-12">Line</span>
                                    <input
                                        type="text"
                                        value={formData.messengers.line}
                                        onChange={(e) => setFormData(prev => ({ ...prev, messengers: { ...prev.messengers, line: e.target.value } }))}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/20"
                                        placeholder="ID 입력"
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                                    <span className="text-blue-400 font-bold text-xs uppercase w-12">Tele</span>
                                    <input
                                        type="text"
                                        value={formData.messengers.telegram}
                                        onChange={(e) => setFormData(prev => ({ ...prev, messengers: { ...prev.messengers, telegram: e.target.value } }))}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/20"
                                        placeholder="ID 입력"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Job Info - Button Style Redesign */}

                        {/* 1. Industry Selection (Buttons) */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-text-muted">업직종 선택</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'bar', label: 'Bar / 호프' },
                                    { id: 'room', label: '룸살롱 / 텐프로' },
                                    { id: 'club', label: '클럽 / 나이트' },
                                    { id: 'karaoke', label: '노래방 / 7080' },
                                    { id: 'massage', label: '마사지 / 스파' },
                                    { id: 'casino', label: '카지노 / 홀덤' },
                                    { id: 'model', label: '모델 / 피팅' },
                                    { id: 'etc', label: '기타 알바' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setFormData(prev => ({ ...prev, industry: { ...prev.industry, level2: item.id } }))}
                                        className={`p-3 rounded-lg border transition-all ${formData.industry.level2 === item.id
                                            ? 'bg-primary text-black border-primary font-bold shadow-lg shadow-primary/20'
                                            : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Salary (Buttons + Input) */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-text-muted">급여 조건</label>
                            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'hourly', label: '시급' },
                                        { id: 'daily', label: '일급' },
                                        { id: 'monthly', label: '월급' },
                                        { id: 'negotiable', label: '협의' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setFormData(prev => ({ ...prev, salary: { ...prev.salary, type: type.id as any } }))}
                                            className={`px-4 py-2 rounded-lg text-sm border transition-all ${formData.salary.type === type.id
                                                ? 'bg-white text-black border-white font-bold'
                                                : 'bg-black/20 border-white/10 text-text-muted hover:bg-white/5'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.salary.amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, salary: { ...prev.salary, amount: e.target.value } }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-4 focus:border-primary outline-none text-white font-medium"
                                        placeholder={formData.salary.type === 'negotiable' ? '협의 내용 입력 (선택사항)' : '금액을 입력해주세요 (단위: 원)'}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                                        {formData.salary.type === 'hourly' && '원 / 시간'}
                                        {formData.salary.type === 'daily' && '원 / 일'}
                                        {formData.salary.type === 'monthly' && '원 / 월'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Region Selection (Button Grid) & Detailed Address */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-text-muted">근무 지역 <span className="text-red-500">*</span></label>
                            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
                                {/* City Grid */}
                                <div className="space-y-2">
                                    <div className="text-xs text-text-muted">시/도 선택</div>
                                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                        {['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '경남', '경북', '전남', '전북', '충남', '충북', '제주'].map((city) => (
                                            <button
                                                key={city}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    location: { ...prev.location, city, district: '' } // Reset district when city changes
                                                }))}
                                                className={`py-2 rounded text-xs border transition-all ${formData.location.city === city
                                                    ? 'bg-primary text-black border-primary font-bold'
                                                    : 'bg-black/20 border-white/10 text-text-muted hover:border-white/30'
                                                    }`}
                                            >
                                                {city}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* District Grid (Conditional) */}
                                {formData.location.city && (
                                    <div className="space-y-2 border-t border-white/5 pt-4 animate-fade-in">
                                        <div className="text-xs text-text-muted">시/구/군 선택 ({formData.location.city})</div>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                                            {/* Simplified logic for example - would map real districts based on city */}
                                            {getDistrictsForCity(formData.location.city).map((district) => (
                                                <button
                                                    key={district}
                                                    onClick={() => setFormData(prev => ({ ...prev, location: { ...prev.location, district } }))}
                                                    className={`py-2 rounded text-xs border transition-all ${formData.location.district === district
                                                        ? 'bg-white text-black border-white font-bold'
                                                        : 'bg-black/40 border-white/10 leading-none text-text-muted hover:bg-white/5'
                                                        }`}
                                                >
                                                    {district}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Detailed Address Input */}
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <label className="text-xs text-text-muted">상세 주소 입력</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={formData.address.roadAddress}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, roadAddress: e.target.value } }))}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                            placeholder="도로명 주소 / 지번 주소"
                                        />
                                        <input
                                            type="text"
                                            value={formData.address.detailAddress}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, detailAddress: e.target.value } }))}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                            placeholder="상세 위치 (건물명, 층수 등)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Work Hours & Conditions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-muted">근무 시간</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'day', label: '주간 (Day)' },
                                        { id: 'night', label: '야간 (Night)' },
                                        { id: 'full', label: '상주 (Full)' },
                                        { id: 'negotiable', label: '시간협의' }
                                    ].map((time) => (
                                        <button
                                            key={time.id}
                                            onClick={() => setFormData(prev => ({ ...prev, workHours: { ...prev.workHours, type: time.id as any } }))}
                                            className={`p-3 rounded-lg border text-sm transition-all ${formData.workHours.type === time.id
                                                ? 'bg-primary/20 border-primary text-primary font-bold'
                                                : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                                                }`}
                                        >
                                            {time.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Age Limit & Themes & Detailed Conditions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-muted">상세 모집 요강</label>
                                <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
                                    {/* Age */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-text-muted w-16">나이</label>
                                        <div className="flex items-center gap-2 flex-1">
                                            <input type="number" value={formData.ageLimit.start} onChange={(e) => setFormData(p => ({ ...p, ageLimit: { ...p.ageLimit, start: +e.target.value } }))} className="w-14 bg-black/40 border border-white/10 rounded p-1.5 text-center text-sm text-white" />
                                            <span className="text-text-muted text-xs">~</span>
                                            <input type="number" value={formData.ageLimit.end || ''} onChange={(e) => setFormData(p => ({ ...p, ageLimit: { ...p.ageLimit, end: +e.target.value } }))} className="w-14 bg-black/40 border border-white/10 rounded p-1.5 text-center text-sm text-white" disabled={formData.ageLimit.noLimit} />
                                            <label className="flex items-center gap-1 cursor-pointer ml-auto">
                                                <input type="checkbox" checked={formData.ageLimit.noLimit} onChange={(e) => setFormData(p => ({ ...p, ageLimit: { ...p.ageLimit, noLimit: e.target.checked } }))} className="rounded border-white/10 bg-black/40" />
                                                <span className="text-xs text-white">무관</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-text-muted w-16">성별</label>
                                        <div className="flex gap-1 flex-1">
                                            {[{ id: 'female', label: '여성' }, { id: 'male', label: '남성' }, { id: 'any', label: '무관' }].map(g => (
                                                <button key={g.id} onClick={() => setFormData(p => ({ ...p, gender: g.id as any }))} className={`flex-1 py-1 text-xs rounded border ${formData.gender === g.id ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/50'}`}>{g.label}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-text-muted w-16">경력</label>
                                        <div className="flex gap-1 flex-1">
                                            {[{ id: 'novice', label: '초보' }, { id: 'experienced', label: '경력' }, { id: 'any', label: '무관' }].map(e => (
                                                <button key={e.id} onClick={() => setFormData(p => ({ ...p, experience: e.id as any }))} className={`flex-1 py-1 text-xs rounded border ${formData.experience === e.id ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/50'}`}>{e.label}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recruit Number */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-text-muted w-16">인원</label>
                                        <input type="text" value={formData.recruitNumber} onChange={(e) => setFormData(p => ({ ...p, recruitNumber: e.target.value }))} className="flex-1 bg-black/40 border border-white/10 rounded p-1.5 text-sm text-white" placeholder="00명" />
                                    </div>

                                    {/* Deadline */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-text-muted w-16">마감</label>
                                        <div className="flex items-center gap-2 flex-1">
                                            <input type="date" value={formData.deadline.date} onChange={(e) => setFormData(p => ({ ...p, deadline: { ...p.deadline, date: e.target.value } }))} className="flex-1 bg-black/40 border border-white/10 rounded p-1.5 text-sm text-white" disabled={formData.deadline.always} />
                                            <label className="flex items-center gap-1 cursor-pointer">
                                                <input type="checkbox" checked={formData.deadline.always} onChange={(e) => setFormData(p => ({ ...p, deadline: { ...p.deadline, always: e.target.checked } }))} className="rounded border-white/10 bg-black/40" />
                                                <span className="text-xs text-white whitespace-nowrap">상시</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Work Days (Checkbox Grid) */}
                                    <div className="border-t border-white/5 pt-3">
                                        <label className="text-xs text-text-muted block mb-2">근무 요일</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['월', '화', '수', '목', '금', '토', '일', '협의'].map(day => (
                                                <button key={day} onClick={() => {
                                                    const current = formData.workDays;
                                                    setFormData(p => ({ ...p, workDays: current.includes(day) ? current.filter(d => d !== day) : [...current, day] }))
                                                }} className={`py-1 text-xs rounded border ${formData.workDays.includes(day) ? 'bg-primary/20 text-primary border-primary' : 'bg-black/20 border-white/10 text-white/50'}`}>{day}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Keywords & Detailed Checkboxes */}
                            <div className="space-y-6">
                                {/* Welfare (Convenience) - Matched to Image 1 */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-text-muted">편의사항 (복리후생)</label>
                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-wrap gap-2">
                                        {[
                                            '선불가능', '순번확실', '원룸제공', '만근비지원', '성형지원',
                                            '출퇴근지원', '식사제공', '팁별도', '인센티브', '홀복지원',
                                            '갯수보장', '지명우대', '초이스없음', '해외여행지원', '뒷방없음',
                                            '따당가능', '푸쉬가능', '밀방없음', '칼퇴보장', '텃세없음', '숙식제공'
                                        ].map((item) => (
                                            <button key={item} onClick={() => {
                                                const current = formData.welfare;
                                                setFormData(p => ({ ...p, welfare: current.includes(item) ? current.filter(i => i !== item) : [...current, item] }))
                                            }} className={`px-3 py-1.5 rounded text-xs border ${formData.welfare.includes(item) ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Keywords - Matched to Image 1 */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-text-muted">키워드</label>
                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-wrap gap-2">
                                        {[
                                            '신규업소', '초보가능', '경력우대', '주말알바', '투잡알바',
                                            '당일지급', '생리휴무', '룸싸롱', '주점', '바',
                                            '요정', '다방', '마사지', '아가씨', '초미씨',
                                            '미씨', 'TC', '44사이즈우대', '박스환영', '장기근무',
                                            '타지역우대', '에이스우대', '업소', '기타'
                                        ].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    const current = formData.keywords || [];
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        keywords: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
                                                    }));
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${(formData.keywords || []).includes(tag)
                                                    ? 'bg-primary text-black border-primary'
                                                    : 'bg-black/20 border-white/10 text-white/50 hover:border-white/30'
                                                    }`}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reception & Documents (Full Width) */}
                        <div className="grid md:grid-cols-2 gap-6 bg-white/5 rounded-xl border border-white/10 p-4">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-white">접수방법</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['전화', '문자', '카톡', '친구요청', '이메일', '온라인', '방문', '기타'].map((item) => (
                                        <button key={item} onClick={() => {
                                            const current = formData.receptionMethods;
                                            setFormData(p => ({ ...p, receptionMethods: current.includes(item) ? current.filter(i => i !== item) : [...current, item] }))
                                        }} className={`py-2 rounded text-xs border ${formData.receptionMethods.includes(item) ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-black/20 border-white/10 text-text-muted'}`}>{item}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-white">제출서류</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['이력서', '자기소개서', '주민등록등본', '통장사본', '관련자격증', '포트폴리오'].map((item) => (
                                        <button key={item} onClick={() => {
                                            const current = formData.requiredDocuments;
                                            setFormData(p => ({ ...p, requiredDocuments: current.includes(item) ? current.filter(i => i !== item) : [...current, item] }))
                                        }} className={`py-2 rounded text-xs border ${formData.requiredDocuments.includes(item) ? 'bg-orange-500/20 text-orange-400 border-orange-500' : 'bg-black/20 border-white/10 text-text-muted'}`}>{item}</button>
                                    ))}
                                </div>
                                <div className="border-t border-white/5 pt-3 mt-3">
                                    <label className="text-xs text-text-muted mb-2 block">사업자등록증 (선택)</label>
                                    <div className="flex items-center gap-3">
                                        <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded text-xs text-white">
                                            파일 선택
                                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, businessLicense: e.target.files?.[0] || null }))} />
                                        </label>
                                        <span className="text-xs text-white/30 truncate flex-1">
                                            {formData.businessLicense ? formData.businessLicense.name : '선택된 파일 없음'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">상세 이미지</label>
                            <div className="grid grid-cols-5 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="aspect-square relative group">
                                        <div className={`w-full h-full rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden ${img.file ? 'border-primary bg-background' : 'border-white/10 bg-white/5 hover:border-primary/50'}`}>
                                            {img.file ? (
                                                <img
                                                    src={URL.createObjectURL(img.file)}
                                                    alt={`Upload ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center p-2">
                                                    <div className="text-xs text-text-muted mb-1">이미지 {idx + 1}</div>
                                                    <div className="text-[10px] text-text-muted/50">+ 추가</div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const newImages = [...formData.images];
                                                        newImages[idx] = { ...newImages[idx], file };
                                                        setFormData(prev => ({ ...prev, images: newImages }));
                                                    }
                                                }}
                                            />
                                            {img.file && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const newImages = [...formData.images];
                                                        newImages[idx] = { ...newImages[idx], file: null };
                                                        setFormData(prev => ({ ...prev, images: newImages }));
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className='sr-only'>Remove</span>
                                                    x
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rich Text Description */}
                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">상세내용 <span className="text-red-500">*</span></label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(val) => handleInputChange('description', val)}
                                placeholder="업소 소개, 근무 시스템, 급여, 우대사항 등을 상세히 작성해주세요..."
                            />
                        </div>

                        {/* Premium Options (Icons & Highlights) */}
                        <div className="space-y-6 pt-8 border-t border-white/10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Zap className="text-yellow-400" /> 프리미엄 옵션 (선택)
                            </h3>

                            {/* Icon Selection */}
                            <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-white">아이콘 추가</h4>
                                    <span className="text-xs text-text-muted">제목 앞에 아이콘이 표시됩니다.</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { id: 'novice', label: '초보환영', icon: '💖' },
                                        { id: 'dorm', label: '원룸제공', icon: '💋' },
                                        { id: 'highpay', label: '최고급시설', icon: '⭐' },
                                        { id: 'black', label: '블랙관리', icon: '⬛' },
                                        { id: 'wage', label: '꽁비지급', icon: '💰' },
                                        { id: 'no_size', label: '사이즈X', icon: '❌' },
                                        { id: 'set', label: '셋트환영', icon: '💠' },
                                        { id: 'pickup', label: '픽업가능', icon: '🚗' },
                                        { id: 'member', label: '회원제운영', icon: '⭕' },
                                        { id: 'urgent', label: '급전가능', icon: '✨' },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white/5 border border-transparent hover:border-white/10">
                                            <input
                                                type="radio"
                                                name="adIcon"
                                                className="accent-primary"
                                                checked={adIcon === item.id}
                                                onChange={() => setAdIcon(item.id)}
                                            />
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="text-sm text-text-muted">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Highlight Selection */}
                            <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-white">형광펜 효과</h4>
                                    <span className="text-xs text-text-muted">제목 배경에 형광펜 효과를 적용합니다.</span>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                    {[
                                        { id: 'blue', color: 'bg-blue-500' },
                                        { id: 'green', color: 'bg-green-500' },
                                        { id: 'cyan', color: 'bg-cyan-400' },
                                        { id: 'purple', color: 'bg-purple-500' },
                                        { id: 'orange', color: 'bg-orange-500' },
                                        { id: 'indigo', color: 'bg-indigo-600' },
                                        { id: 'pink', color: 'bg-pink-500' },
                                        { id: 'magenta', color: 'bg-fuchsia-500' },
                                    ].map(item => (
                                        <label key={item.id} className="cursor-pointer group">
                                            <div className="flex flex-col items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="highlight"
                                                    className="accent-white mb-2"
                                                    checked={highlightSettings.color === item.id}
                                                    // @ts-ignore
                                                    onChange={() => setHighlightSettings({ color: item.id, text: '' })}
                                                />
                                                <div className={`w-full h-8 ${item.color} rounded opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                                <span className="text-xs text-text-muted">{item.id}번</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-8 border-t border-white/10">
                            <button
                                onClick={() => setStep(1)}
                                className="bg-white/10 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                이전 단계
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="bg-primary text-black font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                다음 단계
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Product Selection */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white">3. 광고 상품 선택</h2>
                            <div className="text-sm text-text-muted">
                                선택된 상품: <span className="text-primary font-bold">{Object.keys(selectedProducts).length}개</span>
                            </div>
                        </div>

                        {/* Main Layout: Products + Sidebar */}
                        <div className="grid lg:grid-cols-12 gap-6">

                            {/* Left: Product Cards (7 cols) */}
                            <div className="lg:col-span-7 space-y-4">
                                {products.map((product) => {
                                    const isSelected = !!selectedProducts[product.id];
                                    const qty = selectedProducts[product.id]?.qty || 0;
                                    const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));

                                    return (
                                        <div
                                            key={product.id}
                                            className={`rounded-xl border-2 transition-all ${isSelected ? product.color + ' ' + product.bg : 'border-white/10 bg-accent/20 hover:border-white/20'}`}
                                            onMouseEnter={() => setHoveredProduct(product.id)}
                                            onMouseLeave={() => setHoveredProduct(null)}
                                        >
                                            <div className="p-5">
                                                {/* Top Row: Info + Preview Image */}
                                                <div className="flex gap-4">
                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className={`text-lg font-bold ${product.textColor || 'text-white'}`}>{product.name}</h3>
                                                                <p className="text-white font-bold">{product.price} <span className="text-text-muted font-normal">/ {product.duration}</span></p>
                                                            </div>

                                                            {/* Quantity (Duration) Selector */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        if (qty > 0) {
                                                                            setSelectedProducts(prev => {
                                                                                const newQty = prev[product.id].qty - 1;
                                                                                if (newQty <= 0) {
                                                                                    const newProducts = { ...prev };
                                                                                    delete newProducts[product.id];
                                                                                    return newProducts;
                                                                                }
                                                                                return { ...prev, [product.id]: { ...prev[product.id], qty: newQty } };
                                                                            });
                                                                        }
                                                                    }}
                                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${qty > 0 ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                                                                    disabled={qty === 0}
                                                                >
                                                                    −
                                                                </button>
                                                                <span className={`w-12 text-center font-bold text-sm ${qty > 0 ? 'text-white' : 'text-white/30'}`}>
                                                                    {qty > 0 ? (qty * (product as any).durationDays) + '일' : '0일'}
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedProducts(prev => {
                                                                            if (prev[product.id]) {
                                                                                return { ...prev, [product.id]: { ...prev[product.id], qty: prev[product.id].qty + 1 } };
                                                                            }
                                                                            return { ...prev, [product.id]: { qty: 1, startDate: today } };
                                                                        });
                                                                    }}
                                                                    className="w-8 h-8 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center text-lg font-bold transition-colors"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Features */}
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {product.features.map((feature, idx) => (
                                                                <span key={idx} className="text-xs px-2 py-1 bg-white/10 rounded text-text-muted">
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-text-muted/70">{(product as any).description}</p>
                                                    </div>

                                                    {/* Preview Section */}
                                                    <div className="w-48 shrink-0 flex flex-col items-center">
                                                        <div className="text-xs text-text-muted mb-2 font-medium">노출 미리보기</div>
                                                        <div className="w-full origin-top transform scale-90">
                                                            {['diamond', 'sapphire', 'ruby', 'gold', 'premium', 'vip', 'special'].includes(product.id) ? (
                                                                <AdCard
                                                                    id="preview"
                                                                    variant={product.id as any}
                                                                    productType={product.id as any}
                                                                    title={formData.title || '강남 퍼블릭 일반'}
                                                                    location={formData.address.roadAddress ? `${formData.address.roadAddress.slice(0, 10)}...` : '서울 강남구 청담동'}
                                                                    pay={formData.salary.amount || '일급 300,000원'}
                                                                    image={previewImage}
                                                                    badges={product.features.slice(0, 2)}
                                                                    isNew={true}
                                                                    price={product.price}
                                                                    duration={product.duration}
                                                                />
                                                            ) : product.id === 'highlight' ? (
                                                                <div className="bg-accent rounded-lg border border-white/10 p-4">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-[10px] text-text-muted">서울 강남구</span>
                                                                    </div>
                                                                    <h3 className="truncate text-base">
                                                                        <span className="bg-yellow-500/30 text-yellow-100 px-1 py-0.5 rounded shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                                                            {formData.title || '형광펜 강조 광고 제목 예시'}
                                                                        </span>
                                                                    </h3>
                                                                </div>
                                                            ) : product.id === 'general' ? (
                                                                <div className="bg-accent rounded-lg border border-white/10 p-4 opacity-70">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-[10px] text-text-muted">서울 강남구</span>
                                                                    </div>
                                                                    <h3 className="truncate text-base text-white">
                                                                        {formData.title || '일반 텍스트 광고 제목 예시'}
                                                                    </h3>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-center">
                                                                    <div className="text-green-500 font-bold text-xl mb-1">JUMP UP</div>
                                                                    <p className="text-xs text-green-400">즉시 상단 도약</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Start Date (only when selected) */}
                                                {isSelected && (
                                                    <div className="mt-4 space-y-4 pt-4 border-t border-white/10">
                                                        {/* Highlight Settings */}
                                                        {product.id === 'highlight' && (
                                                            <div className="bg-white/5 rounded-lg p-4 space-y-3">
                                                                <div className="flex items-center gap-2 text-sm text-yellow-500 font-bold mb-2">
                                                                    <Palette size={16} /> 형광펜 설정
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="text-xs text-text-muted block mb-1.5">색상 선택</label>
                                                                        <div className="flex gap-2">
                                                                            {[
                                                                                { value: 'yellow', class: 'bg-yellow-500' },
                                                                                { value: 'pink', class: 'bg-pink-500' },
                                                                                { value: 'green', class: 'bg-green-500' },
                                                                                { value: 'cyan', class: 'bg-cyan-400' }
                                                                            ].map((c) => (
                                                                                <button
                                                                                    key={c.value}
                                                                                    onClick={() => setHighlightSettings(prev => ({ ...prev, color: c.value as any }))}
                                                                                    className={`w-8 h-8 rounded-full ${c.class} transition-transform hover:scale-110 ${highlightSettings.color === c.value ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs text-text-muted block mb-1.5">강조할 문구 (제목을 드래그하여 선택)</label>
                                                                        <div
                                                                            className="bg-black/30 border border-white/10 rounded px-3 py-3 text-sm text-white select-text cursor-text relative group hover:border-yellow-500/50 transition-colors"
                                                                            onMouseUp={() => {
                                                                                const selection = window.getSelection();
                                                                                if (selection && !selection.isCollapsed) {
                                                                                    const text = selection.toString().trim();
                                                                                    if (text) setHighlightSettings(prev => ({ ...prev, text }));
                                                                                }
                                                                            }}
                                                                        >
                                                                            {formData.title || "제목 전체가 강조됩니다 (제목을 입력 후 드래그하세요)"}
                                                                            <div className="absolute top-1 right-2 text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                                드래그하여 선택
                                                                            </div>
                                                                        </div>
                                                                        {highlightSettings.text && (
                                                                            <div className="mt-2 text-xs text-yellow-500 font-bold flex justify-between items-center animate-fade-in">
                                                                                <span className="bg-yellow-500/10 px-2 py-1 rounded">선택됨: "{highlightSettings.text}"</span>
                                                                                <button onClick={() => setHighlightSettings(prev => ({ ...prev, text: '' }))} className="text-[10px] underline text-text-muted hover:text-white">초기화</button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <label className="text-sm text-text-muted">시작일</label>
                                                                <input
                                                                    type="date"
                                                                    className="bg-background border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-primary outline-none"
                                                                    min={today}
                                                                    value={selectedProducts[product.id]?.startDate || today}
                                                                    onChange={(e) => {
                                                                        setSelectedProducts(prev => ({
                                                                            ...prev,
                                                                            [product.id]: { ...prev[product.id], startDate: e.target.value }
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="text-sm text-text-muted">
                                                                총 {(product as any).durationDays * qty}일 노출
                                                            </div>
                                                            <div className="ml-auto text-right">
                                                                <span className="text-sm text-text-muted">소계: </span>
                                                                <span className="text-lg font-bold text-primary">{(priceNum * qty).toLocaleString()}원</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Auto Jump Up Settings */}
                                <div className={`rounded-xl border p-5 transition-all ${jumpUpSettings.enabled ? 'bg-green-500/10 border-green-500/50' : 'bg-background border-white/10 opacity-70 hover:opacity-100'}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${jumpUpSettings.enabled ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-text-muted'}`}>
                                                <RefreshCw size={20} className={jumpUpSettings.enabled ? 'animate-spin-slow' : ''} />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-lg ${jumpUpSettings.enabled ? 'text-green-400' : 'text-white'}`}>자동 상위업 (Auto Jump-Up)</h3>
                                                <p className="text-xs text-text-muted mt-1">지정한 주기로 광고를 최상단으로 끌어올립니다. (회당 1,000원)</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setJumpUpSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${jumpUpSettings.enabled ? 'bg-green-500' : 'bg-white/10'}`}
                                        >
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${jumpUpSettings.enabled ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>

                                    {jumpUpSettings.enabled && (
                                        <div className="space-y-4 pl-14 animate-in fade-in slide-in-from-top-2">
                                            <div>
                                                <label className="text-xs text-text-muted block mb-2 font-medium flex items-center gap-1"><Clock size={12} /> 점프 주기 설정</label>
                                                <div className="flex gap-2">
                                                    {[1, 3, 7].map(days => (
                                                        <button
                                                            key={days}
                                                            type="button"
                                                            onClick={() => setJumpUpSettings(prev => ({ ...prev, interval: days }))}
                                                            className={`px-3 py-1.5 rounded text-sm transition-colors ${jumpUpSettings.interval === days ? 'bg-green-500 text-black font-bold' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                                                        >
                                                            {days}일 마다
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted block mb-2 font-medium flex items-center gap-1"><Zap size={12} /> 횟수 / 선불 결제</label>
                                                <div className="flex gap-2 mb-2">
                                                    {[10, 30, 60].map(cnt => (
                                                        <button
                                                            key={cnt}
                                                            type="button"
                                                            onClick={() => setJumpUpSettings(prev => ({ ...prev, count: cnt }))}
                                                            className={`px-3 py-1.5 rounded text-sm transition-colors ${jumpUpSettings.count === cnt ? 'bg-green-500 text-black font-bold' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                                                        >
                                                            {cnt}회
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-green-400 font-medium">
                                                    예상 비용: <span className="text-white font-bold text-lg">{(jumpUpSettings.count * 1000).toLocaleString()}원</span> (1,000원 x {jumpUpSettings.count}회)
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Sticky Sidebar (5 cols) */}
                            <div className="lg:col-span-5">
                                <div className="lg:sticky lg:top-6 space-y-4">

                                    {/* Order Summary */}
                                    <div className="bg-accent/30 rounded-xl border border-white/10 p-5">
                                        <h4 className="font-bold text-white mb-4 pb-3 border-b border-white/10">주문 내역</h4>

                                        {Object.keys(selectedProducts).length === 0 && !jumpUpSettings.enabled ? (
                                            <p className="text-text-muted text-sm py-4 text-center">상품을 선택해주세요</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {Object.keys(selectedProducts).map((productId) => {
                                                    const product = products.find(p => p.id === productId);
                                                    if (!product) return null;
                                                    const qty = selectedProducts[productId].qty;
                                                    const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));
                                                    const startDate = selectedProducts[productId].startDate;

                                                    return (
                                                        <div key={productId} className="text-sm">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <span className="text-white font-medium">{product.name}</span>
                                                                    <span className="text-text-muted ml-2">{(product as any).durationDays * qty}일</span>
                                                                </div>
                                                                <span className="text-white font-medium">{(priceNum * qty).toLocaleString()}원</span>
                                                            </div>
                                                            <div className="text-xs text-text-muted mt-0.5">
                                                                {startDate} 시작 · {(product as any).durationDays * qty}일 ({product.duration} × {qty}회)
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {jumpUpSettings.enabled && (
                                                    <div className="text-sm">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <span className="text-white font-medium">자동 상위업</span>
                                                                <span className="text-green-400 text-xs ml-2">({jumpUpSettings.interval}일 주기)</span>
                                                            </div>
                                                            <span className="text-white font-medium">{(jumpUpSettings.count * 1000).toLocaleString()}원</span>
                                                        </div>
                                                        <div className="text-xs text-text-muted mt-0.5">
                                                            {jumpUpSettings.count}회 × 1,000원
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="border-t border-white/10 pt-3 mt-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-white">총 결제금액</span>
                                                        <span className="text-2xl font-bold text-primary">
                                                            {(Object.keys(selectedProducts).reduce((sum, productId) => {
                                                                const product = products.find(p => p.id === productId);
                                                                if (!product) return sum;
                                                                const price = parseInt(product.price.replace(/[^0-9]/g, ''));
                                                                return sum + (price * selectedProducts[productId].qty);
                                                            }, 0) + (jumpUpSettings.enabled ? jumpUpSettings.count * 1000 : 0)).toLocaleString()}원
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Position Preview */}
                                    <div className="bg-accent/30 rounded-xl border border-white/10 p-5">
                                        <h4 className="font-bold text-white mb-3">메인페이지 노출 위치</h4>
                                        <div className="bg-background rounded-lg border border-white/10 overflow-hidden">
                                            <div className="relative">
                                                {/* Mini Header */}
                                                <div className="h-4 bg-accent/50 border-b border-white/5 flex items-center px-1.5">
                                                    <span className="text-[6px] text-primary font-bold">LunaAlba</span>
                                                </div>

                                                {/* Hero Tiers */}
                                                {['diamond', 'sapphire', 'ruby', 'gold'].map((tierId) => {
                                                    const tierColor = {
                                                        diamond: 'bg-cyan-200',
                                                        sapphire: 'bg-blue-400',
                                                        ruby: 'bg-red-400',
                                                        gold: 'bg-amber-400'
                                                    }[tierId];
                                                    const tierBg = {
                                                        diamond: 'bg-cyan-900/30',
                                                        sapphire: 'bg-blue-900/30',
                                                        ruby: 'bg-red-900/30',
                                                        gold: 'bg-amber-900/30'
                                                    }[tierId];
                                                    const tierSlots = { diamond: 2, sapphire: 3, ruby: 4, gold: 5 }[tierId] || 1;

                                                    const isHovered = hoveredProduct === tierId;
                                                    return (
                                                        <div key={tierId} className={`h-6 border-b border-white/5 p-0.5 flex items-center transition-all duration-300 ${isHovered ? 'ring-2 ring-primary/50 bg-primary/10 z-10 scale-105 rounded' : ''} ${selectedProducts[tierId] ? tierBg : 'bg-accent/5'}`}>
                                                            <div className="flex-1 flex gap-0.5 px-0.5">
                                                                {Array.from({ length: tierSlots }).map((_, i) => (
                                                                    <div key={i} className={`flex-1 h-4 rounded-sm ${selectedProducts[tierId] ? `${tierColor} shadow-[0_0_5px_currentColor]` : 'bg-white/5'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Premium */}
                                                <div className={`h-8 border-b border-white/5 p-0.5 flex items-center ${selectedProducts['premium'] ? 'bg-purple-400/20' : 'bg-accent/10'}`}>
                                                    <div className="flex-1 flex gap-0.5 px-0.5">
                                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                                            <div key={i} className={`flex-1 h-2 rounded-sm ${selectedProducts['premium'] ? 'bg-purple-400/60 ring-1 ring-purple-400' : 'bg-white/5'}`} />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Special */}
                                                <div className={`h-6 border-b border-white/5 p-0.5 flex items-center ${selectedProducts['special'] ? 'bg-indigo-400/20' : 'bg-accent/10'}`}>
                                                    <div className="flex-1 space-y-0.5 px-0.5">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className={`h-1 rounded-sm ${selectedProducts['special'] ? 'bg-indigo-400/60' : 'bg-white/5'}`} />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Text Ads */}
                                                <div className={`h-8 border-b border-white/5 p-0.5 ${(selectedProducts['general']) ? 'bg-gray-400/20' : 'bg-accent/10'}`}>
                                                    <div className="space-y-0.5 px-0.5">
                                                        {[1, 2, 3, 4].map(i => {
                                                            return (
                                                                <div key={i} className={`h-1.5 rounded-sm ${selectedProducts['general'] ? 'bg-white/40' : 'bg-white/5'}`} />
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Community */}
                                                <div className="h-5 border-b border-white/5 bg-accent/10" />

                                                {/* Footer */}
                                                <div className="h-3 bg-accent/30" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-text-muted mt-2">강조 표시: 내 광고 노출 위치</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Agreements Section */}
                        <div className="bg-accent/30 rounded-xl border border-white/10 p-5 mt-6">
                            <h4 className="font-bold text-white mb-4">이용약관 및 유의사항</h4>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 checked:bg-primary accent-primary"
                                        checked={allAgreed}
                                        onChange={handleAllAgreedChange}
                                    />
                                    <span className="text-white font-bold text-lg">전체 동의</span>
                                </label>

                                <div className="bg-black/20 rounded-lg p-6 space-y-3 text-sm text-text-muted border border-white/5">
                                    {[
                                        '최저임금을 준수하지 않는 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
                                        '모집 채용에서 허위 및 과장으로 작성된 내용이 확인될 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
                                        '모집 채용에서 보이스피싱, 불법 성매매, 구인사기, 채용과 관련없는 모집 등으로 추정되는 내용이 확인될 경우, 공고 게재가 불가하여 임의 마감 및 삭제될 수 있습니다.',
                                        '소정 근로 시간 기준의 급여 외 수당이 발생했을 경우, 공고에 입력한 급여 외 추가 지급되어야 할 수 있습니다.',
                                        '채용절차 공정화법상 금지되는 개인정보를 요구하는 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
                                        '확인문서에 첨부한 문서의 책임은 본인에게 있습니다. 위 변조 및 도용일 경우 민 형사상의 책임이 따를 수 있습니다.'
                                    ].map((text, idx) => (
                                        <div key={idx} className="flex gap-3 items-start">
                                            <input
                                                type="checkbox"
                                                className="mt-1 w-4 h-4 rounded border-white/10 bg-black/40 accent-primary shrink-0"
                                                checked={individualAgreements[idx]}
                                                onChange={(e) => handleIndividualAgreementChange(idx, e.target.checked)}
                                            />
                                            <span>{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="flex justify-between items-center pt-6 border-t border-white/10">
                            <button
                                onClick={() => setStep(2)}
                                className="bg-white/10 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                이전 단계
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-sm text-text-muted">총 결제금액</div>
                                    <div className="text-xl font-bold text-primary">
                                        {Object.keys(selectedProducts).reduce((sum, productId) => {
                                            const product = products.find(p => p.id === productId);
                                            if (!product) return sum;
                                            const price = parseInt(product.price.replace(/[^0-9]/g, ''));
                                            return sum + (price * selectedProducts[productId].qty);
                                        }, 0).toLocaleString()}원
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || Object.keys(selectedProducts).length === 0 || !allAgreed}
                                    className="bg-primary text-black font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '등록 중...' : '결제 및 등록'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostAd;
