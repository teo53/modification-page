import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, RefreshCw, Palette, Smartphone, Monitor } from 'lucide-react';

interface Step3Props {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    selectedProducts: Record<string, { qty: number; startDate: string }>;
    setSelectedProducts: React.Dispatch<React.SetStateAction<Record<string, { qty: number; startDate: string }>>>;
    highlightSettings: { color: string; text: string };
    setHighlightSettings: React.Dispatch<React.SetStateAction<{ color: string; text: string }>>;
    jumpUpSettings: { enabled: boolean; interval: number; count: number };
    setJumpUpSettings: React.Dispatch<React.SetStateAction<{ enabled: boolean; interval: number; count: number }>>;
    allAgreed: boolean;
    setAllAgreed: (v: boolean) => void;
    individualAgreements: boolean[];
    setIndividualAgreements: (v: boolean[]) => void;
    products: any[];
    previewImage: string;
    loading: boolean;
    onSubmit: () => void;
    onPrev: () => void;
}

// Product zone configuration for page preview
const PRODUCT_ZONES = {
    diamond: { top: 0, height: 12, label: '다이아', color: 'from-cyan-400/40 to-cyan-600/40', border: 'border-cyan-400' },
    sapphire: { top: 12, height: 10, label: '사파이어', color: 'from-blue-400/40 to-blue-600/40', border: 'border-blue-400' },
    ruby: { top: 22, height: 10, label: '루비', color: 'from-red-400/40 to-rose-600/40', border: 'border-red-400' },
    gold: { top: 32, height: 10, label: '골드', color: 'from-yellow-400/40 to-amber-600/40', border: 'border-yellow-400' },
    premium: { top: 42, height: 14, label: '프리미엄', color: 'from-purple-400/40 to-purple-600/40', border: 'border-purple-400' },
    special: { top: 56, height: 14, label: '스페셜', color: 'from-indigo-400/40 to-indigo-600/40', border: 'border-indigo-400' },
    highlight: { top: 70, height: 10, label: '형광펜', color: 'from-yellow-500/40 to-orange-500/40', border: 'border-yellow-500' },
    general: { top: 80, height: 20, label: '일반', color: 'from-gray-400/30 to-gray-600/30', border: 'border-gray-500' },
};

const Step3ProductSelection: React.FC<Step3Props> = ({
    formData: _formData,
    selectedProducts,
    setSelectedProducts,
    highlightSettings,
    setHighlightSettings,
    jumpUpSettings,
    setJumpUpSettings,
    allAgreed,
    individualAgreements,
    setIndividualAgreements,
    products,
    previewImage: _previewImage,
    loading,
    onSubmit,
    onPrev
}) => {
    const today = new Date().toISOString().split('T')[0];
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [glowingZone, setGlowingZone] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'mobile' | 'web'>('web');

    // Trigger glow animation when product is added
    const triggerGlow = (productId: string) => {
        setGlowingZone(productId);
        setTimeout(() => setGlowingZone(null), 800);
    };

    // Highlight colors
    const highlightColors = [
        { id: 'yellow', color: 'bg-yellow-500', name: '옐로우' },
        { id: 'pink', color: 'bg-pink-500', name: '핑크' },
        { id: 'green', color: 'bg-green-500', name: '그린' },
        { id: 'cyan', color: 'bg-cyan-400', name: '시안' },
    ];

    // Agreements text
    const agreementTexts = [
        '최저임금을 준수하지 않는 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
        '모집 채용에서 허위 및 과장으로 작성된 내용이 확인될 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
        '모집 채용에서 보이스피싱, 불법 성매매, 구인사기 등으로 추정되는 내용이 확인될 경우, 공고 게재가 불가합니다.',
        '소정 근로 시간 기준의 급여 외 수당이 발생했을 경우, 공고에 입력한 급여 외 추가 지급되어야 합니다.',
    ];

    // Calculate totals
    const productTotal = Object.keys(selectedProducts).reduce((sum, productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return sum;
        const price = parseInt(product.price.replace(/[^0-9]/g, ''));
        return sum + (price * selectedProducts[productId].qty);
    }, 0);

    const premiumAddonsTotal = (highlightSettings.color ? 50000 : 0);
    const jumpUpTotal = jumpUpSettings.enabled ? jumpUpSettings.count * 1000 : 0;
    const grandTotal = productTotal + premiumAddonsTotal + jumpUpTotal;

    const handleAllAgreedChange = (checked: boolean) => {
        setIndividualAgreements(new Array(4).fill(checked));
    };

    // Check if all individual agreements are checked
    useEffect(() => {
        const allChecked = individualAgreements.every(Boolean) && individualAgreements.length === 4;
        if (allChecked !== allAgreed) {
            // This is handled by parent
        }
    }, [individualAgreements]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header - Compact */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <CreditCard className="text-primary" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">광고 상품 선택</h2>
                    <p className="text-xs text-white/50">상품에 마우스를 올리면 노출 위치를 확인할 수 있습니다</p>
                </div>
                <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
                    Step 3 / 3
                </span>
            </div>

            {/* Main Layout: Preview + Products */}
            <div className="grid lg:grid-cols-12 gap-6">
                {/* Left: Page Preview Simulation */}
                <div className="lg:col-span-3">
                    <div className="sticky top-4">
                        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-3">
                            {/* View Mode Tabs */}
                            <div className="flex items-center gap-1 mb-3 p-1 bg-black/30 rounded-lg">
                                <button
                                    onClick={() => setViewMode('web')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'web'
                                            ? 'bg-primary text-black'
                                            : 'text-white/50 hover:text-white/80'
                                        }`}
                                >
                                    <Monitor size={12} />
                                    웹
                                </button>
                                <button
                                    onClick={() => setViewMode('mobile')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'mobile'
                                            ? 'bg-primary text-black'
                                            : 'text-white/50 hover:text-white/80'
                                        }`}
                                >
                                    <Smartphone size={12} />
                                    모바일
                                </button>
                            </div>

                            {/* Web View - Realistic Ad Cards */}
                            {viewMode === 'web' && (
                                <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg p-2 border border-white/10">
                                    <div className="text-center mb-2">
                                        <span className="text-[10px] text-white/40">LUNA ALBA 메인페이지</span>
                                    </div>

                                    {/* Premium Tiers - Actual Card Layout */}
                                    <div className="space-y-1.5">
                                        {/* Diamond */}
                                        <div
                                            className={`relative p-1.5 rounded-lg border-2 transition-all ${hoveredProduct === 'diamond' || selectedProducts['diamond']
                                                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20'
                                                    : 'border-transparent bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <div className="w-4 h-4 bg-cyan-400/30 rounded" />
                                                <div className="flex-1">
                                                    <div className="h-1 bg-cyan-400/50 rounded w-3/4" />
                                                    <div className="h-0.5 bg-white/20 rounded w-1/2 mt-0.5" />
                                                </div>
                                            </div>
                                            <span className="absolute right-1 top-1 text-[7px] text-cyan-400 font-bold">💎 다이아 2슬롯</span>
                                        </div>

                                        {/* Sapphire */}
                                        <div
                                            className={`relative p-1.5 rounded-lg border-2 transition-all ${hoveredProduct === 'sapphire' || selectedProducts['sapphire']
                                                    ? 'border-blue-400 bg-gradient-to-r from-blue-400/20 to-blue-600/20'
                                                    : 'border-transparent bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-blue-400/30 rounded" />
                                                <div className="flex-1">
                                                    <div className="h-0.5 bg-blue-400/50 rounded w-2/3" />
                                                </div>
                                            </div>
                                            <span className="absolute right-1 top-1 text-[6px] text-blue-400 font-bold">💙 사파이어 3슬롯</span>
                                        </div>

                                        {/* Ruby */}
                                        <div
                                            className={`relative p-1.5 rounded-lg border-2 transition-all ${hoveredProduct === 'ruby' || selectedProducts['ruby']
                                                    ? 'border-red-400 bg-gradient-to-r from-red-400/20 to-rose-600/20'
                                                    : 'border-transparent bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-red-400/30 rounded" />
                                                <div className="flex-1">
                                                    <div className="h-0.5 bg-red-400/50 rounded w-2/3" />
                                                </div>
                                            </div>
                                            <span className="absolute right-1 top-1 text-[6px] text-red-400 font-bold">❤️ 루비 4슬롯</span>
                                        </div>

                                        {/* Gold */}
                                        <div
                                            className={`relative p-1.5 rounded-lg border-2 transition-all ${hoveredProduct === 'gold' || selectedProducts['gold']
                                                    ? 'border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-amber-600/20'
                                                    : 'border-transparent bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-yellow-400/30 rounded" />
                                                <div className="flex-1">
                                                    <div className="h-0.5 bg-yellow-400/50 rounded w-1/2" />
                                                </div>
                                            </div>
                                            <span className="absolute right-1 top-1 text-[6px] text-yellow-400 font-bold">🏆 골드 5슬롯</span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-dashed border-white/10 my-1" />

                                        {/* Premium/Special/Text Ads */}
                                        <div className="grid grid-cols-2 gap-1">
                                            <div
                                                className={`p-1 rounded text-center transition-all ${hoveredProduct === 'premium' || selectedProducts['premium']
                                                        ? 'bg-purple-500/30 border border-purple-400'
                                                        : 'bg-white/5'
                                                    }`}
                                            >
                                                <span className="text-[6px] text-purple-400">프리미엄</span>
                                            </div>
                                            <div
                                                className={`p-1 rounded text-center transition-all ${hoveredProduct === 'special' || selectedProducts['special']
                                                        ? 'bg-indigo-500/30 border border-indigo-400'
                                                        : 'bg-white/5'
                                                    }`}
                                            >
                                                <span className="text-[6px] text-indigo-400">스페셜</span>
                                            </div>
                                        </div>

                                        <div
                                            className={`p-1 rounded text-center transition-all ${hoveredProduct === 'highlight' || selectedProducts['highlight']
                                                    ? 'bg-yellow-500/30 border border-yellow-500'
                                                    : 'bg-white/5'
                                                }`}
                                        >
                                            <span className="text-[6px] text-yellow-500">✨ 형광펜 텍스트</span>
                                        </div>
                                        <div
                                            className={`p-1 rounded text-center transition-all ${hoveredProduct === 'general' || selectedProducts['general']
                                                    ? 'bg-gray-500/30 border border-gray-400'
                                                    : 'bg-white/5'
                                                }`}
                                        >
                                            <span className="text-[6px] text-gray-400">일반 텍스트</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile View - Phone Mockup */}
                            {viewMode === 'mobile' && (
                                <div className="relative bg-black rounded-2xl border-2 border-white/20 overflow-hidden" style={{ aspectRatio: '9/16' }}>
                                    {/* Screen content */}
                                    <div className="absolute inset-1 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl overflow-hidden">
                                        {/* Header bar */}
                                        <div className="h-[6%] bg-white/5 flex items-center justify-center">
                                            <span className="text-[8px] text-white/40">LUNA ALBA</span>
                                        </div>

                                        {/* Product Zones */}
                                        {Object.entries(PRODUCT_ZONES).map(([id, zone]) => {
                                            const isHovered = hoveredProduct === id;
                                            const isGlowing = glowingZone === id;
                                            const isSelected = !!selectedProducts[id];

                                            return (
                                                <div
                                                    key={id}
                                                    className={`absolute left-1 right-1 transition-all duration-300 rounded-sm overflow-hidden
                                                        ${isHovered ? `bg-gradient-to-r ${zone.color} border-l-2 ${zone.border}` : ''}
                                                        ${isGlowing ? 'animate-pulse ring-2 ring-white/50' : ''}
                                                        ${isSelected && !isHovered ? `bg-gradient-to-r ${zone.color} opacity-60` : ''}
                                                    `}
                                                    style={{
                                                        top: `${6 + zone.top * 0.94}%`,
                                                        height: `${zone.height * 0.94}%`,
                                                    }}
                                                >
                                                    {/* Zone label */}
                                                    <div className={`h-full flex items-center justify-center transition-opacity duration-300
                                                        ${isHovered || isGlowing || isSelected ? 'opacity-100' : 'opacity-0'}
                                                    `}>
                                                        <span className="text-[8px] font-bold text-white/90 drop-shadow-lg">
                                                            {zone.label}
                                                        </span>
                                                    </div>

                                                    {/* Glow effect overlay */}
                                                    {isGlowing && (
                                                        <div className="absolute inset-0 bg-white/30 animate-ping rounded" />
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Grid lines for reference */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            {[...Array(8)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute left-1 right-1 border-t border-dashed border-white/5"
                                                    style={{ top: `${6 + (i + 1) * 11.75}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Home indicator */}
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                                </div>
                            )}

                            {/* Legend */}
                            <div className="mt-3 text-[10px] text-white/40 space-y-1">
                                <p>• 상품 호버 시 위치 표시</p>
                                <p>• 상단일수록 노출 효과 ↑</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Product List - Compact */}
                <div className="lg:col-span-5 space-y-3">
                    <h3 className="text-sm font-bold text-white/80 flex items-center gap-2">
                        <CreditCard size={14} className="text-primary" />
                        광고 상품
                    </h3>

                    <div className="space-y-2">
                        {products.map((product) => {
                            const isSelected = !!selectedProducts[product.id];
                            const qty = selectedProducts[product.id]?.qty || 0;
                            const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));

                            return (
                                <div
                                    key={product.id}
                                    className={`rounded-lg border p-3 transition-all cursor-pointer ${isSelected
                                        ? `${product.color} ${product.bg}`
                                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                        }`}
                                    onMouseEnter={() => setHoveredProduct(product.id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Product Info - Compact */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-sm font-bold ${product.textColor || 'text-white'}`}>
                                                    {product.name}
                                                </h4>
                                                <span className="text-white/40 text-xs">{product.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-bold text-white">{product.price}</span>
                                                <span className="text-[10px] text-white/40 truncate">
                                                    {product.features[0]}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quantity Controls - Compact */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
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
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${qty > 0 ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/5 text-white/20'
                                                    }`}
                                                disabled={qty === 0}
                                            >
                                                −
                                            </button>
                                            <span className={`w-10 text-center text-xs font-bold ${qty > 0 ? 'text-white' : 'text-white/30'}`}>
                                                {qty > 0 ? `${qty * (product.durationDays || 7)}일` : '-'}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    triggerGlow(product.id);
                                                    setSelectedProducts(prev => {
                                                        if (prev[product.id]) {
                                                            return { ...prev, [product.id]: { ...prev[product.id], qty: prev[product.id].qty + 1 } };
                                                        }
                                                        return { ...prev, [product.id]: { qty: 1, startDate: today } };
                                                    });
                                                }}
                                                className="w-7 h-7 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center text-sm font-bold transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selected: Start Date & Price - Inline */}
                                    {isSelected && (
                                        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-white/50" />
                                                <span className="text-white/50">시작일</span>
                                                <input
                                                    type="date"
                                                    className="bg-black/60 border-2 border-primary/40 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:border-primary/60 transition-colors"
                                                    style={{ colorScheme: 'dark' }}
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
                                            <span className="font-bold text-primary">
                                                {(priceNum * qty).toLocaleString()}원
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Add-ons - Compact */}
                    <div className="space-y-3 pt-4">
                        {/* Auto Jump Up */}
                        <div className={`rounded-lg border p-3 transition-all ${jumpUpSettings.enabled
                            ? 'bg-green-500/10 border-green-500/50'
                            : 'bg-white/[0.03] border-white/10'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={16} className={jumpUpSettings.enabled ? 'text-green-400' : 'text-white/50'} />
                                    <div>
                                        <span className={`text-sm font-bold ${jumpUpSettings.enabled ? 'text-green-400' : 'text-white'}`}>
                                            자동 상위업
                                        </span>
                                        <span className="text-[10px] text-white/40 ml-2">1,000원/회</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setJumpUpSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${jumpUpSettings.enabled ? 'bg-green-500' : 'bg-white/20'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${jumpUpSettings.enabled ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {jumpUpSettings.enabled && (
                                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-green-500/30">
                                    <div className="flex gap-1">
                                        {[1, 3, 7].map(days => (
                                            <button
                                                key={days}
                                                onClick={() => setJumpUpSettings(prev => ({ ...prev, interval: days }))}
                                                className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${jumpUpSettings.interval === days
                                                    ? 'bg-green-500 text-black'
                                                    : 'bg-black/30 text-white/60'
                                                    }`}
                                            >
                                                {days}일
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-1">
                                        {[10, 30, 60].map(cnt => (
                                            <button
                                                key={cnt}
                                                onClick={() => setJumpUpSettings(prev => ({ ...prev, count: cnt }))}
                                                className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${jumpUpSettings.count === cnt
                                                    ? 'bg-green-500 text-black'
                                                    : 'bg-black/30 text-white/60'
                                                    }`}
                                            >
                                                {cnt}회
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Highlight Add-on */}
                        <div className={`rounded-lg border p-3 transition-all ${highlightSettings.color
                            ? 'bg-amber-500/10 border-amber-500/50'
                            : 'bg-white/[0.03] border-white/10'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Palette size={16} className="text-pink-400" />
                                    <span className="text-sm font-bold text-white">형광펜 효과</span>
                                </div>
                                <span className="text-pink-400 text-xs font-bold">+50,000원</span>
                            </div>
                            <div className="flex gap-2">
                                {highlightColors.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setHighlightSettings({
                                            color: highlightSettings.color === item.id ? '' : item.id,
                                            text: ''
                                        })}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <div className={`w-8 h-8 ${item.color} rounded-lg transition-all ${highlightSettings.color === item.id
                                            ? 'ring-2 ring-white scale-110'
                                            : 'opacity-50 hover:opacity-100'
                                            }`} />
                                        <span className="text-[9px] text-white/40">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Summary Sidebar - Compact */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-xl border border-white/10 p-4">
                        <h4 className="font-bold text-white mb-3 pb-2 border-b border-white/10 text-sm">
                            주문 내역
                        </h4>

                        {Object.keys(selectedProducts).length === 0 && !jumpUpSettings.enabled && !highlightSettings.color ? (
                            <p className="text-white/40 text-xs text-center py-4">상품을 선택해주세요</p>
                        ) : (
                            <div className="space-y-2 text-xs">
                                {Object.keys(selectedProducts).map((productId) => {
                                    const product = products.find(p => p.id === productId);
                                    if (!product) return null;
                                    const qty = selectedProducts[productId].qty;
                                    const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));

                                    return (
                                        <div key={productId} className="flex justify-between">
                                            <span className="text-white/70">{product.name} x{qty}</span>
                                            <span className="text-white font-medium">{(priceNum * qty).toLocaleString()}원</span>
                                        </div>
                                    );
                                })}

                                {jumpUpSettings.enabled && (
                                    <div className="flex justify-between">
                                        <span className="text-green-400">상위업 {jumpUpSettings.count}회</span>
                                        <span className="text-white font-medium">{jumpUpTotal.toLocaleString()}원</span>
                                    </div>
                                )}

                                {highlightSettings.color && (
                                    <div className="flex justify-between">
                                        <span className="text-pink-400">형광펜</span>
                                        <span className="text-white font-medium">50,000원</span>
                                    </div>
                                )}

                                <div className="border-t border-white/10 pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-white">총 결제금액</span>
                                        <span className="text-xl font-bold text-primary">{grandTotal.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agreements - Compact */}
                    <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4">
                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded accent-primary"
                                checked={allAgreed}
                                onChange={(e) => handleAllAgreedChange(e.target.checked)}
                            />
                            <span className="text-white font-bold text-sm">전체 동의</span>
                        </label>
                        <div className="space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                            {agreementTexts.map((text, idx) => (
                                <label key={idx} className="flex gap-2 text-[10px] text-white/50 cursor-pointer leading-tight">
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 rounded mt-0.5 accent-primary shrink-0"
                                        checked={individualAgreements[idx] || false}
                                        onChange={(e) => {
                                            const newAgreements = [...individualAgreements];
                                            newAgreements[idx] = e.target.checked;
                                            setIndividualAgreements(newAgreements);
                                        }}
                                    />
                                    <span>{text}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={onSubmit}
                        disabled={loading || Object.keys(selectedProducts).length === 0 || !allAgreed}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '등록 중...' : `${grandTotal.toLocaleString()}원 결제하기`}
                    </button>
                </div>
            </div>

            {/* Navigation - Compact */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                    onClick={onPrev}
                    className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all"
                >
                    ← 이전
                </button>
            </div>
        </div>
    );
};

export default Step3ProductSelection;
