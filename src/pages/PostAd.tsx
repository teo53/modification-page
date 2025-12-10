import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Building2, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import RichTextEditor from '../components/ui/RichTextEditor';
import type { AdFormState } from '../types/ad';
import { getCurrentUser } from '../utils/auth';
import { createAd } from '../utils/adStorage';

const PostAd = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [isAuthorized, setIsAuthorized] = useState(false);

    // Check if user is advertiser
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
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<AdFormState>({
        businessName: '',
        contactPerson: '',
        contactPhone: '',
        kakaoId: '',
        lineId: '',
        telegramId: '',
        wechatId: '',
        address: {
            zonecode: '',
            roadAddress: '',
            detailAddress: ''
        },
        isLocationVerified: false,
        verificationDocument: null,
        title: '',
        businessLogo: null,
        adLogo: null,
        industry: { level1: '', level2: '' },
        location: { city: '', district: '', town: '' },
        recruitmentType: 'hire',
        workHours: { type: 'day' },
        salary: { type: 'negotiable', amount: '' },
        ageLimit: { start: 20, end: 0, noLimit: false },
        keywords: [],
        customKeywords: '',
        images: Array(5).fill({ file: null, description: '' }),
        description: '',
        themes: []
    });

    // Multi-select products state with period extension (qty = number of periods)
    const [selectedProducts, setSelectedProducts] = useState<Record<string, { qty: number; startDate: string }>>({});
    const today = new Date().toISOString().split('T')[0];


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
            id: 'general',
            name: '일반',
            price: '100,000원',
            priceNum: 100000,
            duration: '3일',
            durationDays: 3,
            color: 'border-gray-400',
            bg: 'bg-gray-400/10',
            bgFill: 'bg-gray-400',
            textColor: 'text-gray-400',
            features: ['텍스트 리스트', '기본 노출'],
            description: '일반 텍스트 리스트에 노출됩니다.'
        },
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
        let productType: 'premium' | 'special' | 'regular' = 'regular';
        if (selectedProducts['diamond'] || selectedProducts['sapphire'] || selectedProducts['ruby'] || selectedProducts['gold'] || selectedProducts['premium']) {
            productType = 'premium';
        } else if (selectedProducts['special']) {
            productType = 'special';
        }

        // Create ad
        const result = createAd({
            title: formData.title,
            businessName: formData.businessName,
            location: formData.address.roadAddress || '서울특별시',
            salary: formData.salary.amount || '협의',
            workHours: formData.workHours.type || '주간',
            description: formData.description || '',
            contact: formData.contactPhone || '',
            productType: productType,
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

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">업소명</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    placeholder="업소명을 입력하세요"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">담당자명</label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    placeholder="담당자 이름을 입력하세요"
                                />
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

                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">공고 제목</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-lg font-bold"
                                placeholder="눈에 띄는 제목을 입력해주세요"
                                maxLength={40}
                            />
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

                            {/* Left: Product Cards (8 cols) */}
                            <div className="lg:col-span-8 space-y-4">
                                {products.map((product) => {
                                    const isSelected = !!selectedProducts[product.id];
                                    const qty = selectedProducts[product.id]?.qty || 0;
                                    const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));

                                    return (
                                        <div
                                            key={product.id}
                                            className={`rounded-xl border-2 transition-all ${isSelected ? product.color + ' ' + product.bg : 'border-white/10 bg-accent/20 hover:border-white/20'}`}
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

                                                    {/* Preview Image */}
                                                    <div className="w-36 shrink-0">
                                                        <div className="text-[10px] text-text-muted mb-1 text-center">노출 예시</div>
                                                        <div className="bg-background rounded-lg border border-white/10 p-2 h-24 flex items-center justify-center">
                                                            {product.id === 'diamond' && (
                                                                <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded border border-cyan-300/50 p-1.5 relative overflow-hidden">
                                                                    <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />
                                                                    <div className="relative z-10">
                                                                        <div className="flex items-center gap-1 mb-1">
                                                                            <div className="text-[6px] bg-gradient-to-r from-white to-cyan-200 text-black px-1 rounded font-bold">DIA</div>
                                                                        </div>
                                                                        <div className="text-[7px] text-white font-bold truncate mb-0.5">{formData.title || '제목'}</div>
                                                                        <div className="text-[6px] text-cyan-200 truncate">{formData.businessName || '업소명'}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {product.id === 'sapphire' && (
                                                                <div className="w-full h-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded border border-blue-400/50 p-1.5 relative">
                                                                    <div className="flex items-center gap-1 mb-1">
                                                                        <div className="text-[6px] bg-gradient-to-r from-blue-400 to-blue-500 text-white px-1 rounded font-bold">SAP</div>
                                                                    </div>
                                                                    <div className="text-[7px] text-white font-bold truncate mb-0.5">{formData.title || '제목'}</div>
                                                                    <div className="text-[6px] text-blue-300 truncate">{formData.businessName || '업소명'}</div>
                                                                </div>
                                                            )}
                                                            {product.id === 'ruby' && (
                                                                <div className="w-full h-full bg-gradient-to-br from-[#1a0a0a] to-[#2a1515] rounded border border-red-400/50 p-1.5 relative">
                                                                    <div className="flex items-center gap-1 mb-1">
                                                                        <div className="text-[6px] bg-gradient-to-r from-red-400 to-rose-500 text-white px-1 rounded font-bold">RUB</div>
                                                                    </div>
                                                                    <div className="text-[7px] text-white font-bold truncate mb-0.5">{formData.title || '제목'}</div>
                                                                    <div className="text-[6px] text-rose-300 truncate">{formData.businessName || '업소명'}</div>
                                                                </div>
                                                            )}
                                                            {product.id === 'gold' && (
                                                                <div className="w-full h-full bg-gradient-to-br from-[#1a1508] to-[#2a2010] rounded border border-yellow-400/50 p-1.5 relative">
                                                                    <div className="flex items-center gap-1 mb-1">
                                                                        <div className="text-[6px] bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-1 rounded font-bold">GLD</div>
                                                                    </div>
                                                                    <div className="text-[7px] text-white font-bold truncate mb-0.5">{formData.title || '제목'}</div>
                                                                    <div className="text-[6px] text-amber-300 truncate">{formData.businessName || '업소명'}</div>
                                                                </div>
                                                            )}
                                                            {product.id === 'premium' && (
                                                                <div className="w-full h-full border border-purple-400/50 rounded bg-purple-400/5 p-1.5">
                                                                    <div className="text-[6px] bg-purple-400 text-black px-1 rounded inline-block mb-1">PREM</div>
                                                                    <div className="text-[7px] text-white font-bold truncate">{formData.title || '제목'}</div>
                                                                </div>
                                                            )}
                                                            {product.id === 'special' && (
                                                                <div className="w-full flex items-center gap-1 p-1 bg-indigo-400/10 border border-indigo-400/30 rounded">
                                                                    <div className="w-6 h-6 bg-indigo-400/20 rounded shrink-0" />
                                                                    <div className="min-w-0">
                                                                        <div className="text-[6px] text-white truncate">{formData.title || '제목'}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {product.id === 'general' && (
                                                                <div className="w-full space-y-1">
                                                                    <div className="h-2 bg-white/10 rounded w-full" />
                                                                    <div className="h-2 bg-white/5 rounded w-3/4" />
                                                                    <div className="h-2 bg-white/5 rounded w-1/2" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Start Date (only when selected) */}
                                                {isSelected && (
                                                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4">
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
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: Sticky Sidebar (4 cols) */}
                            <div className="lg:col-span-4">
                                <div className="lg:sticky lg:top-6 space-y-4">

                                    {/* Order Summary */}
                                    <div className="bg-accent/30 rounded-xl border border-white/10 p-5">
                                        <h4 className="font-bold text-white mb-4 pb-3 border-b border-white/10">주문 내역</h4>

                                        {Object.keys(selectedProducts).length === 0 ? (
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

                                                <div className="border-t border-white/10 pt-3 mt-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-white">총 결제금액</span>
                                                        <span className="text-2xl font-bold text-primary">
                                                            {Object.keys(selectedProducts).reduce((sum, productId) => {
                                                                const product = products.find(p => p.id === productId);
                                                                if (!product) return sum;
                                                                const price = parseInt(product.price.replace(/[^0-9]/g, ''));
                                                                return sum + (price * selectedProducts[productId].qty);
                                                            }, 0).toLocaleString()}원
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
                                                    <span className="text-[6px] text-primary font-bold">QueenAlba</span>
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

                                                    return (
                                                        <div key={tierId} className={`h-6 border-b border-white/5 p-0.5 flex items-center ${selectedProducts[tierId] ? tierBg : 'bg-accent/5'}`}>
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
                                    disabled={loading || Object.keys(selectedProducts).length === 0}
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
