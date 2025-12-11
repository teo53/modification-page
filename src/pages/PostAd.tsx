import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { Step2RecruitmentInfo, Step3ProductSelection } from '../components/PostAd';
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
    const [highlightSettings, setHighlightSettings] = useState<{ color: string; text: string }>({ color: '', text: '' });
    const [jumpUpSettings, setJumpUpSettings] = useState<{ enabled: boolean; interval: number; count: number }>({ enabled: false, interval: 1, count: 10 });
    const [allAgreed, setAllAgreed] = useState(false);
    const [individualAgreements, setIndividualAgreements] = useState(Array(6).fill(false));

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
                <div className="max-w-md w-full bg-accent rounded-xl border border-white/10 p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">접근 권한이 없습니다</h2>
                    <p className="text-text-muted">광고주 계정만 광고를 등록할 수 있습니다.<br />광고주로 회원가입 후 이용해주세요.</p>
                    <div className="flex gap-2 justify-center pt-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            홈으로
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
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
                color: highlightSettings.color as 'yellow' | 'pink' | 'green' | 'cyan',
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
        <div className="min-h-screen bg-background text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">광고 등록</h1>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
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
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                        <CheckCircle size={20} />
                        <span>{success}</span>
                    </div>
                )}

                {/* Progress Steps */}
                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10" />
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex flex-col items-center gap-2 bg-background px-4 ${step >= s ? 'text-primary' : 'text-text-muted'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s ? 'border-primary bg-primary/20' : 'border-white/10 bg-background'}`}>
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

                {/* Step 2: Recruitment Info - Using New Component */}
                {step === 2 && (
                    <Step2RecruitmentInfo
                        formData={formData}
                        setFormData={setFormData}
                        onNext={() => setStep(3)}
                        onPrev={() => setStep(1)}
                        getDistrictsForCity={getDistrictsForCity}
                    />
                )}

                {/* Step 3: Product Selection - Using New Component */}
                {step === 3 && (
                    <Step3ProductSelection
                        formData={formData}
                        setFormData={setFormData}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        highlightSettings={highlightSettings}
                        setHighlightSettings={setHighlightSettings}
                        jumpUpSettings={jumpUpSettings}
                        setJumpUpSettings={setJumpUpSettings}
                        allAgreed={allAgreed}
                        setAllAgreed={setAllAgreed}
                        individualAgreements={individualAgreements}
                        setIndividualAgreements={setIndividualAgreements}
                        products={products}
                        previewImage={previewImage}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onPrev={() => setStep(2)}
                    />
                )}
            </div>
        </div>
    );
};


export default PostAd;
