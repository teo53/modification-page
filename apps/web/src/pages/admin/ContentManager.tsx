/**
 * 관리자 콘텐츠 관리 도구
 * 아임웹 스타일의 노코드 사이트 관리 인터페이스
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings, Globe, Phone, Building2, CreditCard, Menu, Layout,
    Palette, Search, Save, RotateCcw, Download, Upload, Eye,
    ChevronRight, CheckCircle, AlertCircle, X, Image, Type,
    DollarSign, Users, MessageSquare, Shield
} from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getSiteConfig, saveSiteConfig, resetSiteConfig, exportSiteConfig, importSiteConfig } from '../../utils/siteSettings';
import type { SiteConfig } from '../../config/siteConfig';
import VisualSectionEditor from '../../components/admin/VisualSectionEditor';

// 메뉴 아이템 타입
interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
}

const menuItems: MenuItem[] = [
    { id: 'basic', label: '기본 설정', icon: <Globe size={20} />, description: '사이트명, 로고, 슬로건' },
    { id: 'contact', label: '연락처', icon: <Phone size={20} />, description: '고객센터, 카카오톡, 이메일' },
    { id: 'company', label: '회사 정보', icon: <Building2 size={20} />, description: '사업자 정보, 법적 고지' },
    { id: 'payment', label: '결제 설정', icon: <CreditCard size={20} />, description: '계좌 정보, 영업시간' },
    { id: 'pricing', label: '광고 가격표', icon: <DollarSign size={20} />, description: '상품별 가격, 기간, 혜택' },
    { id: 'navigation', label: '네비게이션', icon: <Menu size={20} />, description: '메뉴 구성, 빠른 메뉴' },
    { id: 'sections', label: '홈 섹션', icon: <Layout size={20} />, description: '섹션 순서, 표시 설정' },
    { id: 'theme', label: '테마', icon: <Palette size={20} />, description: '색상, 스타일 설정' },
    { id: 'seo', label: 'SEO', icon: <Search size={20} />, description: '검색 최적화, 메타 태그' },
];

const ContentManager: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('basic');
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [showPreview, setShowPreview] = useState(false);

    // 권한 체크 - role 필드 기반 (이메일 하드코딩 제거)
    useEffect(() => {
        const user = getCurrentUser();
        if (user && user.role === 'admin') {
            setIsAuthorized(true);
            setConfig(getSiteConfig());
        } else {
            setIsAuthorized(false);
        }
        setIsLoading(false);
    }, []);

    // 설정 변경 감지
    const handleConfigChange = <K extends keyof SiteConfig>(
        section: K,
        field: keyof SiteConfig[K],
        value: unknown
    ) => {
        if (!config) return;

        const sectionData = config[section];

        // 배열 타입인 경우 직접 할당, 객체 타입인 경우 스프레드
        const updatedSection = Array.isArray(sectionData)
            ? sectionData
            : { ...sectionData as object, [field]: value };

        const newConfig = {
            ...config,
            [section]: updatedSection,
        };
        setConfig(newConfig as SiteConfig);
        setHasChanges(true);
    };

    // 저장
    const handleSave = async () => {
        if (!config) return;
        setSaveStatus('saving');

        const result = saveSiteConfig(config);
        if (result.success) {
            setSaveStatus('saved');
            setHasChanges(false);
            setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // 초기화
    const handleReset = () => {
        if (window.confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
            resetSiteConfig();
            setConfig(getSiteConfig());
            setHasChanges(false);
        }
    };

    // 내보내기
    const handleExport = () => {
        exportSiteConfig();
    };

    // 가져오기
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await importSiteConfig(file);
        if (result.success) {
            setConfig(getSiteConfig());
            alert('설정을 성공적으로 불러왔습니다.');
        } else {
            alert(result.message);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

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

    if (!config) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* 상단 툴바 */}
            <div className="sticky top-0 z-50 bg-accent border-b border-white/10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Settings className="text-primary" size={24} />
                            <h1 className="text-xl font-bold text-white">사이트 관리</h1>
                        </div>
                        {hasChanges && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                저장되지 않은 변경사항
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 미리보기 */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors"
                        >
                            <Eye size={16} />
                            미리보기
                        </button>

                        {/* 내보내기 */}
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors"
                        >
                            <Download size={16} />
                        </button>

                        {/* 가져오기 */}
                        <label className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors cursor-pointer">
                            <Upload size={16} />
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>

                        {/* 초기화 */}
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-sm transition-colors"
                        >
                            <RotateCcw size={16} />
                        </button>

                        {/* 저장 */}
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saveStatus === 'saving'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${hasChanges
                                ? 'bg-primary text-black hover:bg-primary/90'
                                : 'bg-white/10 text-white/50 cursor-not-allowed'
                                }`}
                        >
                            {saveStatus === 'saving' ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : saveStatus === 'saved' ? (
                                <CheckCircle size={16} />
                            ) : saveStatus === 'error' ? (
                                <AlertCircle size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {saveStatus === 'saved' ? '저장됨' : saveStatus === 'error' ? '오류' : '저장'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* 사이드바 메뉴 */}
                <aside className="w-64 min-h-[calc(100vh-4rem)] bg-accent/50 border-r border-white/5">
                    <nav className="p-4 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === item.id
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.icon}
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{item.label}</div>
                                    <div className="text-xs opacity-60">{item.description}</div>
                                </div>
                                <ChevronRight size={16} className="opacity-50" />
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 메인 콘텐츠 영역 */}
                <main className="flex-1 p-8">
                    <div className="max-w-4xl">
                        {/* 기본 설정 */}
                        {activeSection === 'basic' && (
                            <BasicSettingsEditor
                                config={config}
                                onChange={(field, value) => handleConfigChange('basic', field, value)}
                            />
                        )}

                        {/* 연락처 */}
                        {activeSection === 'contact' && (
                            <ContactSettingsEditor
                                config={config}
                                onChange={(field, value) => handleConfigChange('contact', field, value)}
                            />
                        )}

                        {/* 회사 정보 */}
                        {activeSection === 'company' && (
                            <CompanySettingsEditor
                                config={config}
                                onChange={(field, value) => handleConfigChange('company', field, value)}
                            />
                        )}

                        {/* 결제 설정 */}
                        {activeSection === 'payment' && (
                            <PaymentSettingsEditor
                                config={config}
                                onChange={(field, value) => handleConfigChange('payment', field, value)}
                            />
                        )}

                        {/* 가격표 */}
                        {activeSection === 'pricing' && (
                            <PricingEditor config={config} setConfig={setConfig} setHasChanges={setHasChanges} />
                        )}

                        {/* 네비게이션 */}
                        {activeSection === 'navigation' && (
                            <NavigationEditor config={config} setConfig={setConfig} setHasChanges={setHasChanges} />
                        )}

                        {/* 홈 섹션 - 비주얼 에디터 */}
                        {activeSection === 'sections' && (
                            <VisualSectionEditor config={config} setConfig={setConfig} setHasChanges={setHasChanges} />
                        )}

                        {/* 테마 */}
                        {activeSection === 'theme' && (
                            <ThemeEditor
                                config={config}
                                onChange={(field, value) => handleConfigChange('theme', field, value)}
                                setHasChanges={setHasChanges}
                            />
                        )}

                        {/* SEO */}
                        {activeSection === 'seo' && (
                            <SeoEditor
                                config={config}
                                onChange={(field, value) => handleConfigChange('seo', field, value)}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* 미리보기 패널 */}
            {showPreview && (
                <PreviewPanel config={config} onClose={() => setShowPreview(false)} />
            )}
        </div>
    );
};

// ==================== 에디터 컴포넌트들 ====================

// 입력 필드 컴포넌트
const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'tel' | 'email' | 'url';
    helpText?: string;
    icon?: React.ReactNode;
}> = ({ label, value, onChange, placeholder, type = 'text', helpText, icon }) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-white">
            {icon}
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
        />
        {helpText && <p className="text-xs text-text-muted">{helpText}</p>}
    </div>
);

// 기본 설정 에디터
const BasicSettingsEditor: React.FC<{
    config: SiteConfig;
    onChange: (field: keyof SiteConfig['basic'], value: string) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">기본 설정</h2>
            <p className="text-text-muted">사이트의 기본 정보를 설정합니다.</p>
        </div>

        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-6">
            <InputField
                label="사이트명"
                value={config.basic.siteName}
                onChange={(v) => onChange('siteName', v)}
                placeholder="달빛알바"
                icon={<Type size={16} />}
            />
            <InputField
                label="슬로건"
                value={config.basic.siteSlogan}
                onChange={(v) => onChange('siteSlogan', v)}
                placeholder="대한민국 No.1 유흥알바 채용 플랫폼"
                helpText="헤더와 푸터에 표시됩니다."
            />
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <Image size={16} />
                    로고 이미지
                </label>
                <div className="flex gap-4 items-center">
                    <div className="w-32 h-16 bg-background rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                        {config.basic.logoUrl ? (
                            <img src={config.basic.logoUrl} alt="로고" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="text-text-muted text-xs">미리보기</span>
                        )}
                    </div>
                    <InputField
                        label=""
                        value={config.basic.logoUrl}
                        onChange={(v) => onChange('logoUrl', v)}
                        placeholder="/logo.png"
                        helpText="이미지 URL 또는 경로를 입력하세요."
                    />
                </div>
            </div>
        </div>
    </div>
);

// 연락처 설정 에디터
const ContactSettingsEditor: React.FC<{
    config: SiteConfig;
    onChange: (field: keyof SiteConfig['contact'], value: string) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">연락처</h2>
            <p className="text-text-muted">고객 문의를 위한 연락처 정보입니다.</p>
        </div>

        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-6">
            <InputField
                label="고객센터 전화번호"
                value={config.contact.customerServicePhone}
                onChange={(v) => onChange('customerServicePhone', v)}
                placeholder="1577-0000"
                type="tel"
                icon={<Phone size={16} />}
            />
            <InputField
                label="카카오톡 ID"
                value={config.contact.kakaoId}
                onChange={(v) => onChange('kakaoId', v)}
                placeholder="dalbitAlba"
                icon={<MessageSquare size={16} />}
            />
            <InputField
                label="카카오 오픈채팅 URL"
                value={config.contact.kakaoOpenChatUrl}
                onChange={(v) => onChange('kakaoOpenChatUrl', v)}
                placeholder="https://open.kakao.com/o/..."
                type="url"
            />
            <InputField
                label="이메일"
                value={config.contact.email}
                onChange={(v) => onChange('email', v)}
                placeholder="contact@example.com"
                type="email"
            />
            <InputField
                label="주소"
                value={config.contact.address}
                onChange={(v) => onChange('address', v)}
                placeholder="서울특별시 강남구..."
            />
        </div>
    </div>
);

// 회사 정보 에디터
const CompanySettingsEditor: React.FC<{
    config: SiteConfig;
    onChange: (field: keyof SiteConfig['company'], value: string) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">회사 정보</h2>
            <p className="text-text-muted">법적으로 필요한 사업자 정보입니다.</p>
        </div>

        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-6">
            <InputField
                label="상호명"
                value={config.company.companyName}
                onChange={(v) => onChange('companyName', v)}
                placeholder="(주)달빛알바"
                icon={<Building2 size={16} />}
            />
            <InputField
                label="대표자명"
                value={config.company.representative}
                onChange={(v) => onChange('representative', v)}
                placeholder="홍길동"
                icon={<Users size={16} />}
            />
            <InputField
                label="사업자등록번호"
                value={config.company.businessNumber}
                onChange={(v) => onChange('businessNumber', v)}
                placeholder="123-45-67890"
            />
            <InputField
                label="통신판매업 신고번호"
                value={config.company.salesReportNumber}
                onChange={(v) => onChange('salesReportNumber', v)}
                placeholder="2025-서울강남-00000"
            />
            <InputField
                label="직업정보제공사업 신고번호"
                value={config.company.jobInfoNumber}
                onChange={(v) => onChange('jobInfoNumber', v)}
                placeholder="J1234567890123"
            />
            <InputField
                label="청소년보호책임자"
                value={config.company.youthProtectionOfficer}
                onChange={(v) => onChange('youthProtectionOfficer', v)}
                placeholder="홍길동"
                icon={<Shield size={16} />}
            />
        </div>
    </div>
);

// 결제 설정 에디터
const PaymentSettingsEditor: React.FC<{
    config: SiteConfig;
    onChange: (field: keyof SiteConfig['payment'], value: unknown) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">결제 설정</h2>
            <p className="text-text-muted">무통장입금 계좌 정보 및 영업시간입니다.</p>
        </div>

        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-6">
            <InputField
                label="은행명"
                value={config.payment.bankName}
                onChange={(v) => onChange('bankName', v)}
                placeholder="국민은행"
                icon={<CreditCard size={16} />}
            />
            <InputField
                label="계좌번호"
                value={config.payment.accountNumber}
                onChange={(v) => onChange('accountNumber', v)}
                placeholder="123-456-789012"
            />
            <InputField
                label="예금주"
                value={config.payment.accountHolder}
                onChange={(v) => onChange('accountHolder', v)}
                placeholder="(주)달빛알바"
            />
            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="평일 영업시간"
                    value={config.payment.businessHours.weekday}
                    onChange={(v) => onChange('businessHours', { ...config.payment.businessHours, weekday: v })}
                    placeholder="09:00 ~ 18:00"
                />
                <InputField
                    label="주말 영업시간"
                    value={config.payment.businessHours.weekend}
                    onChange={(v) => onChange('businessHours', { ...config.payment.businessHours, weekend: v })}
                    placeholder="휴무"
                />
            </div>
        </div>
    </div>
);

// 가격표 에디터
const PricingEditor: React.FC<{
    config: SiteConfig;
    setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ config, setConfig, setHasChanges }) => {
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

    const updatePricing = (id: string, field: string, value: unknown) => {
        const newPricing = config.pricing.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setConfig({ ...config, pricing: newPricing });
        setHasChanges(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">광고 가격표</h2>
                <p className="text-text-muted">상품별 가격, 혜택, 이미지 규격을 설정합니다.</p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
                💡 <strong>팁:</strong> 상품을 클릭하면 이미지 규격 등 상세 설정을 볼 수 있습니다.
            </div>

            <div className="space-y-3">
                {config.pricing
                    .sort((a, b) => a.order - b.order)
                    .map((product) => (
                        <div
                            key={product.id}
                            className={`bg-accent/30 rounded-xl border transition-all ${expandedProduct === product.id
                                ? 'border-primary/50'
                                : 'border-white/5 hover:border-white/10'
                                }`}
                        >
                            {/* 헤더 (클릭 가능) */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpandedProduct(
                                    expandedProduct === product.id ? null : product.id
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: product.color }}
                                        />
                                        <h3 className={`text-lg font-bold ${product.isActive ? 'text-white' : 'text-white/40'}`}>
                                            {product.displayName}
                                        </h3>
                                        <span className="text-xs text-text-muted">({product.name})</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${product.isActive
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {product.isActive ? '활성' : '비활성'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-primary font-bold">
                                            {product.price.toLocaleString()}원 / {product.duration}일
                                        </span>
                                        <span className="text-text-muted">
                                            {expandedProduct === product.id ? '▼' : '▶'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 확장 영역 */}
                            {expandedProduct === product.id && (
                                <div className="border-t border-white/5 p-6 space-y-6">
                                    {/* 활성화 토글 */}
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={product.isActive}
                                            onChange={(e) => updatePricing(product.id, 'isActive', e.target.checked)}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="text-white">상품 활성화</span>
                                    </label>

                                    {/* 기본 정보 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-text-muted">가격 (원)</label>
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) => updatePricing(product.id, 'price', parseInt(e.target.value))}
                                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-text-muted">기간 (일)</label>
                                            <input
                                                type="number"
                                                value={product.duration}
                                                onChange={(e) => updatePricing(product.id, 'duration', parseInt(e.target.value))}
                                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-text-muted">테마 색상</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={product.color}
                                                    onChange={(e) => updatePricing(product.id, 'color', e.target.value)}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border border-white/10"
                                                />
                                                <input
                                                    type="text"
                                                    value={product.color}
                                                    onChange={(e) => updatePricing(product.id, 'color', e.target.value)}
                                                    className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 혜택 */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-muted">혜택 (줄바꿈으로 구분)</label>
                                        <textarea
                                            value={product.benefits.join('\n')}
                                            onChange={(e) => updatePricing(product.id, 'benefits', e.target.value.split('\n'))}
                                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white h-20 resize-none"
                                        />
                                    </div>

                                    {/* 이미지 규격 설정 */}
                                    <div className="pt-4 border-t border-white/5">
                                        <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                            📐 이미지 규격 설정
                                            <span className="text-xs text-text-muted font-normal">
                                                (광고주가 업로드하는 이미지의 권장 크기)
                                            </span>
                                        </h4>

                                        <div className="grid grid-cols-2 gap-6">
                                            {/* 썸네일 */}
                                            <div className="bg-background/50 rounded-lg p-4 border border-white/5">
                                                <h5 className="text-xs font-medium text-primary mb-3">썸네일 이미지</h5>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-text-muted">너비 (px)</label>
                                                        <input
                                                            type="number"
                                                            value={product.thumbnailSize?.width || 200}
                                                            onChange={(e) => updatePricing(product.id, 'thumbnailSize', {
                                                                width: parseInt(e.target.value),
                                                                height: product.thumbnailSize?.height || 260
                                                            })}
                                                            className="w-full bg-background border border-white/10 rounded px-3 py-2 text-white text-center text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-text-muted">높이 (px)</label>
                                                        <input
                                                            type="number"
                                                            value={product.thumbnailSize?.height || 260}
                                                            onChange={(e) => updatePricing(product.id, 'thumbnailSize', {
                                                                width: product.thumbnailSize?.width || 200,
                                                                height: parseInt(e.target.value)
                                                            })}
                                                            className="w-full bg-background border border-white/10 rounded px-3 py-2 text-white text-center text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-text-muted">
                                                    비율: {((product.thumbnailSize?.width || 200) / (product.thumbnailSize?.height || 260)).toFixed(2)}
                                                </div>
                                            </div>

                                            {/* 상세 이미지 */}
                                            <div className="bg-background/50 rounded-lg p-4 border border-white/5">
                                                <h5 className="text-xs font-medium text-secondary mb-3">상세 이미지</h5>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-text-muted">너비 (px)</label>
                                                        <input
                                                            type="number"
                                                            value={product.detailImageSize?.width || 600}
                                                            onChange={(e) => updatePricing(product.id, 'detailImageSize', {
                                                                width: parseInt(e.target.value),
                                                                height: product.detailImageSize?.height || 450
                                                            })}
                                                            className="w-full bg-background border border-white/10 rounded px-3 py-2 text-white text-center text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-text-muted">높이 (px)</label>
                                                        <input
                                                            type="number"
                                                            value={product.detailImageSize?.height || 450}
                                                            onChange={(e) => updatePricing(product.id, 'detailImageSize', {
                                                                width: product.detailImageSize?.width || 600,
                                                                height: parseInt(e.target.value)
                                                            })}
                                                            className="w-full bg-background border border-white/10 rounded px-3 py-2 text-white text-center text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-text-muted">
                                                    비율: {((product.detailImageSize?.width || 600) / (product.detailImageSize?.height || 450)).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

// 네비게이션 에디터
const NavigationEditor: React.FC<{
    config: SiteConfig;
    setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ config, setConfig, setHasChanges }) => {
    const updateNavItem = (id: string, field: string, value: unknown) => {
        const newNav = config.navigation.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setConfig({ ...config, navigation: newNav });
        setHasChanges(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">네비게이션</h2>
                <p className="text-text-muted">상단 메뉴와 빠른 메뉴를 설정합니다.</p>
            </div>

            <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">상단 메뉴</h3>
                <div className="space-y-3">
                    {config.navigation
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                            <div key={item.id} className="flex items-center gap-4 bg-background/50 rounded-lg p-3">
                                <input
                                    type="checkbox"
                                    checked={item.isActive}
                                    onChange={(e) => updateNavItem(item.id, 'isActive', e.target.checked)}
                                    className="rounded"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateNavItem(item.id, 'name', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={item.path}
                                    onChange={(e) => updateNavItem(item.id, 'path', e.target.value)}
                                    className="w-32 bg-background border border-white/10 rounded px-2 py-1 text-sm text-text-muted"
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

// 테마 에디터 - 저장 전까지 변경 사항 확정 안함
const ThemeEditor: React.FC<{
    config: SiteConfig;
    onChange: (field: keyof SiteConfig['theme'], value: string) => void;
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ config, onChange, setHasChanges }) => {
    // 로컬 상태로 색상 임시 저장
    const [localColors, setLocalColors] = useState(config.theme);
    const [pendingChanges, setPendingChanges] = useState<{ [key: string]: boolean }>({});

    // config이 바뀌면 로컬 상태 동기화
    useEffect(() => {
        setLocalColors(config.theme);
        setPendingChanges({});
    }, [config.theme]);

    const handleColorChange = (key: keyof typeof localColors, value: string) => {
        setLocalColors(prev => ({ ...prev, [key]: value }));
        setPendingChanges(prev => ({ ...prev, [key]: true }));
    };

    const applyColor = (key: keyof typeof localColors) => {
        onChange(key, localColors[key]);
        setPendingChanges(prev => ({ ...prev, [key]: false }));
        setHasChanges(true);
    };

    const applyAllColors = () => {
        Object.keys(localColors).forEach(key => {
            onChange(key as keyof typeof localColors, localColors[key as keyof typeof localColors]);
        });
        setPendingChanges({});
        setHasChanges(true);
    };

    const resetColor = (key: keyof typeof localColors) => {
        setLocalColors(prev => ({ ...prev, [key]: config.theme[key] }));
        setPendingChanges(prev => ({ ...prev, [key]: false }));
    };

    const hasPending = Object.values(pendingChanges).some(v => v);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">테마 설정</h2>
                <p className="text-text-muted">사이트의 색상을 커스터마이즈합니다.</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-300">
                💡 <strong>안내:</strong> 색상을 선택한 후 "적용" 버튼을 눌러야 변경이 확정됩니다.
                상단의 "저장" 버튼으로 최종 저장하세요.
            </div>

            <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { key: 'primaryColor' as const, label: '주 색상 (Primary)', desc: '버튼, 강조 텍스트 등' },
                        { key: 'secondaryColor' as const, label: '보조 색상 (Secondary)', desc: '보조 버튼, 배지 등' },
                        { key: 'accentColor' as const, label: '강조 색상 (Accent)', desc: '카드 배경, 패널 등' },
                        { key: 'backgroundColor' as const, label: '배경 색상', desc: '페이지 전체 배경' },
                        { key: 'textColor' as const, label: '텍스트 색상', desc: '기본 텍스트' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className={`p-4 rounded-lg border transition-all ${pendingChanges[key]
                            ? 'border-yellow-500/50 bg-yellow-500/5'
                            : 'border-white/5 bg-background/30'
                            }`}>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <label className="text-sm font-medium text-white">{label}</label>
                                    <p className="text-xs text-text-muted">{desc}</p>
                                </div>
                                {pendingChanges[key] && (
                                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                        미적용
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={localColors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        className="w-14 h-14 rounded-lg cursor-pointer border-2 border-white/10"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={localColors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                                        placeholder="#FFFFFF"
                                    />
                                    {pendingChanges[key] && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => applyColor(key)}
                                                className="flex-1 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium rounded-lg transition-colors"
                                            >
                                                ✓ 적용
                                            </button>
                                            <button
                                                onClick={() => resetColor(key)}
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-text-muted text-xs rounded-lg transition-colors"
                                            >
                                                취소
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 현재 적용된 값 */}
                            {pendingChanges[key] && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                                    <span>현재 적용값:</span>
                                    <div
                                        className="w-4 h-4 rounded border border-white/20"
                                        style={{ backgroundColor: config.theme[key] }}
                                    />
                                    <span className="font-mono">{config.theme[key]}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 전체 적용 버튼 */}
                {hasPending && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button
                            onClick={() => {
                                setLocalColors(config.theme);
                                setPendingChanges({});
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
                        >
                            모두 취소
                        </button>
                        <button
                            onClick={applyAllColors}
                            className="px-6 py-2 bg-primary text-black font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            모든 색상 적용
                        </button>
                    </div>
                )}
            </div>

            {/* 프리뷰 */}
            <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">미리보기</h3>
                <div
                    className="rounded-lg p-6 space-y-4"
                    style={{ backgroundColor: localColors.backgroundColor }}
                >
                    <div className="flex gap-4">
                        <button
                            className="px-4 py-2 rounded-lg font-bold"
                            style={{ backgroundColor: localColors.primaryColor, color: '#000' }}
                        >
                            주 버튼
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg font-bold"
                            style={{ backgroundColor: localColors.secondaryColor, color: '#fff' }}
                        >
                            보조 버튼
                        </button>
                    </div>
                    <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: localColors.accentColor }}
                    >
                        <p style={{ color: localColors.textColor }}>
                            이것은 텍스트 미리보기입니다.
                            <span style={{ color: localColors.primaryColor }}> 강조 텍스트</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SEO 에디터
const SeoEditor: React.FC<{
    config: SiteConfig;
    onChange: (field: keyof SiteConfig['seo'], value: unknown) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">SEO 설정</h2>
            <p className="text-text-muted">검색 엔진 최적화를 위한 메타 정보입니다.</p>
        </div>

        <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-6">
            <InputField
                label="페이지 제목 (Title)"
                value={config.seo.metaTitle}
                onChange={(v) => onChange('metaTitle', v)}
                placeholder="달빛알바 - 대한민국 No.1 유흥알바 채용 플랫폼"
                helpText="브라우저 탭과 검색 결과에 표시됩니다."
            />
            <div className="space-y-2">
                <label className="text-sm font-medium text-white">메타 설명</label>
                <textarea
                    value={config.seo.metaDescription}
                    onChange={(e) => onChange('metaDescription', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white h-24 resize-none"
                    placeholder="검색 결과에 표시되는 설명..."
                />
                <p className="text-xs text-text-muted">검색 결과에 표시되는 설명입니다. 150자 이내 권장.</p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-white">키워드 (쉼표로 구분)</label>
                <input
                    type="text"
                    value={config.seo.metaKeywords.join(', ')}
                    onChange={(e) => onChange('metaKeywords', e.target.value.split(',').map((k) => k.trim()))}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="유흥알바, 룸알바, 클럽알바..."
                />
            </div>
        </div>
    </div>
);

// 미리보기 패널
const PreviewPanel: React.FC<{
    config: SiteConfig;
    onClose: () => void;
}> = ({ config, onClose }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
        <div className="bg-accent rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">미리보기</h3>
                <button onClick={onClose} className="text-text-muted hover:text-white">
                    <X size={24} />
                </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-60px)]">
                <div className="bg-background rounded-xl p-6 space-y-6">
                    {/* 헤더 미리보기 */}
                    <div className="border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={config.basic.logoUrl}
                                    alt="로고"
                                    className="h-8 object-contain"
                                />
                                <span className="text-sm text-text-muted">고객센터: {config.contact.customerServicePhone}</span>
                            </div>
                            <div className="flex gap-4 text-sm text-text-muted">
                                {config.navigation.filter(n => n.isActive).map(n => (
                                    <span key={n.id}>{n.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 푸터 미리보기 */}
                    <div className="border border-white/10 rounded-lg p-4 text-sm">
                        <p className="text-white font-bold mb-2">{config.company.companyName}</p>
                        <p className="text-text-muted">대표: {config.company.representative} | 사업자번호: {config.company.businessNumber}</p>
                        <p className="text-text-muted mt-2">{config.contact.address}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ContentManager;
