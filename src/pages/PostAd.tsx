import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check, Building2, FileText, Upload, Search } from 'lucide-react';
import SelectionGroup from '../components/ui/SelectionGroup';
import RichTextEditor from '../components/ui/RichTextEditor';
import type { AdFormState } from '../types/ad';
import { INDUSTRY_OPTIONS, LOCATION_OPTIONS, SALARY_TYPES, WORK_HOURS_TYPES, RECRUITMENT_TYPES, THEME_OPTIONS } from '../types/ad';

const PostAd = () => {
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

    // Extra locations state
    const [location2, setLocation2] = useState({ city: '', district: '' });
    const [location3, setLocation3] = useState({ city: '', district: '' });

    // Multi-select products state
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

    // Ad scheduling state
    const [adScheduling, setAdScheduling] = useState<{
        startDate: Date;
        isImmediate: boolean;
    }>({
        startDate: new Date(),
        isImmediate: true
    });

    const products = [
        {
            id: 'vip',
            name: 'VIP 프리미엄',
            price: '300,000원',
            duration: '30일',
            color: 'border-yellow-400',
            bg: 'bg-yellow-400/10',
            bgFill: 'bg-yellow-400',
            features: ['메인 상단 노출', '형광펜 강조', '로고 이미지', '최우선 배치']
        },
        {
            id: 'special',
            name: '스페셜',
            price: '150,000원',
            duration: '15일',
            color: 'border-blue-400',
            bg: 'bg-blue-400/10',
            bgFill: 'bg-blue-400',
            features: ['스페셜 섹션 노출', '형광펜 강조', '우선 배치']
        },
        {
            id: 'premium',
            name: '프리미엄',
            price: '100,000원',
            duration: '7일',
            color: 'border-purple-400',
            bg: 'bg-purple-400/10',
            bgFill: 'bg-purple-400',
            features: ['일반 섹션 상단', '형광펜 강조']
        },
        {
            id: 'general-highlight',
            name: '일반 (형광펜)',
            price: '50,000원',
            duration: '5일',
            color: 'border-green-400',
            bg: 'bg-green-400/10',
            bgFill: 'bg-green-400',
            features: ['텍스트 리스트', '형광펜 강조']
        },
        {
            id: 'general',
            name: '일반 (텍스트)',
            price: '30,000원',
            duration: '3일',
            color: 'border-gray-400',
            bg: 'bg-gray-400/10',
            bgFill: 'bg-gray-400',
            features: ['텍스트 리스트', '기본 노출']
        },
    ];

    const handleInputChange = (field: keyof AdFormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: keyof AdFormState, child: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...(prev[parent] as any), [child]: value }
        }));
    };

    const getDistricts = (city: string) => {
        return (LOCATION_OPTIONS as any)[city] || [];
    };

    const getSubIndustries = (level1: string) => {
        return (INDUSTRY_OPTIONS as any)[level1] || [];
    };

    return (
        <div className="min-h-screen bg-background text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">광고 등록</h1>

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
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">3. 광고 상품 선택</h2>

                        <div className="grid gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`p-6 rounded-xl border ${selectedProducts[product.id] ? product.color : 'border-white/10'} ${selectedProducts[product.id] ? product.bg : 'bg-accent/30'} cursor-pointer hover:border-primary/50 transition-all`}
                                    onClick={() => {
                                        setSelectedProducts(prev => {
                                            const newProducts = { ...prev };
                                            if (newProducts[product.id]) {
                                                delete newProducts[product.id];
                                            } else {
                                                newProducts[product.id] = 1;
                                            }
                                            return newProducts;
                                        });
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                                            <p className="text-primary text-lg mb-2">{product.price} / {product.duration}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.features.map((feature, idx) => (
                                                    <span key={idx} className="text-xs px-2 py-1 bg-white/10 rounded">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {selectedProducts[product.id] && (
                                            <div className="text-primary">
                                                <Check size={32} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-8 border-t border-white/10">
                            <button
                                onClick={() => setStep(2)}
                                className="bg-white/10 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                이전 단계
                            </button>
                            <button
                                className="bg-primary text-black font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                등록 완료
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostAd;
