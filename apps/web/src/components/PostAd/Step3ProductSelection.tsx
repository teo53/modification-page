import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, RefreshCw, Palette } from 'lucide-react';
import { PaymentInfo } from '../payment';

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


    // Highlight colors - 8가지 색상 (레퍼런스 이미지 기준)
    const highlightColors = [
        { id: '1', color: 'bg-yellow-400', name: '1번' },
        { id: '2', color: 'bg-green-400', name: '2번' },
        { id: '3', color: 'bg-cyan-400', name: '3번' },
        { id: '4', color: 'bg-blue-400', name: '4번' },
        { id: '5', color: 'bg-pink-400', name: '5번' },
        { id: '6', color: 'bg-purple-400', name: '6번' },
        { id: '7', color: 'bg-orange-400', name: '7번' },
        { id: '8', color: 'bg-rose-400', name: '8번' },
    ];

    // 형광펜 기간 옵션
    const highlightPeriods = [
        { days: 30, price: 30000, label: '30일' },
        { days: 60, price: 55000, label: '60일' },
        { days: 90, price: 70000, label: '90일' },
    ];

    // 형광펜 기간 상태
    const [highlightPeriod, setHighlightPeriod] = useState<number>(30);
    // 형광펜 적용할 텍스트 상태
    const [highlightText, setHighlightText] = useState<string>('');



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

            {/* Main Layout: Products + Preview Sidebar */}
            <div className="grid lg:grid-cols-12 gap-6">
                {/* Right Sidebar: Page Preview Simulation - order-last로 오른쪽 배치 */}
                <div className="lg:col-span-4 lg:order-last">
                    <div className="sticky top-4">
                        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-3">
                            {/* Web View - 실제 레이아웃 구조 반영 */}
                            {(
                                <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg p-3 border border-white/10">
                                    <div className="text-center mb-2">
                                        <span className="text-[9px] text-white/50 font-medium">메인 페이지 광고 위치</span>
                                    </div>

                                    <div className="space-y-2">
                                        {/* Premium Recruitment 헤더 */}
                                        <div className="text-center mb-2">
                                            <div className="text-[8px] text-purple-300 font-bold">Premium Recruitment</div>
                                            <div className="text-[5px] text-white/40">최상위 구인을 위한 프리미엄 광고</div>
                                        </div>

                                        {/* === DIAMOND TIER (2개 - 1행 2열) === */}
                                        <div className={`transition-all ${hoveredProduct === 'diamond' || selectedProducts['diamond'] ? 'ring-1 ring-cyan-400' : ''}`}>
                                            <div className="text-[6px] text-cyan-400 font-bold mb-1 border-b border-cyan-400/30 pb-0.5">DIAMOND TIER</div>
                                            <div className="grid grid-cols-2 gap-1">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="border border-cyan-500/50 bg-black p-1">
                                                        <div className="flex items-center gap-1 mb-0.5">
                                                            <div className="w-4 h-4 bg-gray-800 rounded"></div>
                                                            <div className="flex-1">
                                                                <div className="text-[5px] text-white font-bold truncate">다이아 업체{i}</div>
                                                                <div className="text-[4px] text-white/50">서울 · 협의</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* === SAPPHIRE TIER (4개 - 2행 2열) === */}
                                        <div className={`transition-all ${hoveredProduct === 'sapphire' || selectedProducts['sapphire'] ? 'ring-1 ring-blue-400' : ''}`}>
                                            <div className="text-[6px] text-blue-400 font-bold mb-1 border-b border-blue-400/30 pb-0.5">SAPPHIRE TIER</div>
                                            <div className="grid grid-cols-2 gap-1">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="border border-blue-500/50 bg-black p-1">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-4 h-4 bg-gray-800 rounded"></div>
                                                            <div className="text-[5px] text-white font-bold truncate">사파이어{i}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* === RUBY TIER (6개 - 가로형 카드) === */}
                                        <div className={`transition-all ${hoveredProduct === 'ruby' || selectedProducts['ruby'] ? 'ring-1 ring-red-400' : ''}`}>
                                            <div className="text-[6px] text-red-400 font-bold mb-1 border-b border-red-400/30 pb-0.5">RUBY TIER</div>
                                            <div className="grid grid-cols-2 gap-0.5">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="border border-red-500/30 bg-black/50 p-0.5 flex items-center gap-0.5">
                                                        <span className="text-[4px] text-red-500 bg-red-500/20 px-0.5">VIP</span>
                                                        <span className="text-[4px] text-white truncate">루비{i}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* === GOLD TIER (8개 - 가로형 카드) === */}
                                        <div className={`transition-all ${hoveredProduct === 'gold' || selectedProducts['gold'] ? 'ring-1 ring-yellow-400' : ''}`}>
                                            <div className="text-[6px] text-yellow-400 font-bold mb-1 border-b border-yellow-400/30 pb-0.5">GOLD TIER</div>
                                            <div className="grid grid-cols-2 gap-0.5">
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                                    <div key={i} className="border border-yellow-500/30 bg-black/50 p-0.5 flex items-center gap-0.5">
                                                        <span className="text-[4px] text-yellow-500 bg-yellow-500/20 px-0.5">★</span>
                                                        <span className="text-[4px] text-white truncate">골드{i}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 빠른 메뉴 */}
                                        <div className="p-1 rounded border border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                                            <div className="flex justify-center gap-0.5">
                                                {['🔍', '📍', '🏢', '⚡'].map((icon, i) => (
                                                    <div key={i} className="w-3 h-3 bg-white/10 rounded flex items-center justify-center text-[5px]">{icon}</div>
                                                ))}
                                            </div>
                                            <div className="text-[5px] text-purple-300 text-center">빠른 메뉴</div>
                                        </div>

                                        {/* === VIP 프리미엄 광고 (6개/줄) === */}
                                        <div className={`transition-all ${hoveredProduct === 'premium' || selectedProducts['premium'] ? 'ring-1 ring-purple-400' : ''}`}>
                                            <div className="text-[6px] text-purple-400 font-bold mb-1">VIP 프리미엄 광고</div>
                                            <div className="grid grid-cols-6 gap-0.5">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="border border-yellow-500/50 rounded bg-black p-0.5">
                                                        <div className="bg-gray-800 h-3 rounded mb-0.5"></div>
                                                        <div className="text-[3px] text-white truncate">업체</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* === SPECIAL 스페셜 광고 (6개/줄) === */}
                                        <div className={`transition-all ${hoveredProduct === 'special' || selectedProducts['special'] ? 'ring-1 ring-pink-400' : ''}`}>
                                            <div className="text-[6px] text-pink-400 font-bold mb-1">SPECIAL 스페셜 광고</div>
                                            <div className="grid grid-cols-6 gap-0.5">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="border border-pink-500/30 rounded bg-black p-0.5">
                                                        <div className="bg-gray-800 h-3 rounded mb-0.5"></div>
                                                        <div className="text-[3px] text-white truncate">업체</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 텍스트 광고 - 형광펜 + 일반 */}
                                        <div className="grid grid-cols-2 gap-1">
                                            <div className={`p-1 rounded border transition-all ${hoveredProduct === 'highlight' || selectedProducts['highlight'] ? 'border-yellow-500 bg-yellow-500/10 ring-1 ring-yellow-500' : 'border-white/10 bg-white/5'}`}>
                                                <div className="text-[5px] text-yellow-500 font-medium">✨ 형광펜 효과</div>
                                                <div className="text-[4px] text-white/40 mt-0.5">제목 강조 표시</div>
                                            </div>
                                            <div className={`p-1 rounded border transition-all ${hoveredProduct === 'general' || selectedProducts['general'] ? 'border-gray-400 bg-gray-500/10 ring-1 ring-gray-400' : 'border-white/10 bg-white/5'}`}>
                                                <div className="text-[5px] text-gray-400 font-medium">📝 일반 텍스트</div>
                                                <div className="text-[4px] text-white/40 mt-0.5">기본 광고</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 pt-1.5 border-t border-white/10">
                                        <p className="text-[6px] text-white/40 text-center">• 상품 호버 시 위치 표시 • 상단일수록 노출 ↑</p>
                                    </div>
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

                {/* Main Content: Product List */}
                <div className="lg:col-span-8 space-y-3">
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
                                        <div className="mt-2 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <Clock size={12} className="text-white/50 shrink-0" />
                                                <span className="text-white/50 shrink-0">시작일</span>
                                                <input
                                                    type="date"
                                                    className="flex-1 sm:flex-none bg-black/60 border-2 border-primary/40 rounded-lg px-3 py-2 sm:py-1.5 text-white text-base sm:text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:border-primary/60 transition-colors min-h-[44px] sm:min-h-0"
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
                                            <span className="font-bold text-primary text-sm sm:text-xs">
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
                        {/* Jump Up Add-on - 패키지/직접선택 탭 */}
                        <div className={`rounded-lg border p-4 transition-all ${jumpUpSettings.enabled
                            ? 'bg-green-500/10 border-green-500/50'
                            : 'bg-white/[0.03] border-white/10'
                            }`}>
                            {/* 헤더 */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={18} className={jumpUpSettings.enabled ? 'text-green-400' : 'text-white/50'} />
                                    <span className={`text-sm font-bold ${jumpUpSettings.enabled ? 'text-green-400' : 'text-white'}`}>
                                        자동 상위업
                                    </span>
                                </div>
                                <button
                                    onClick={() => setJumpUpSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${jumpUpSettings.enabled ? 'bg-green-500' : 'bg-white/20'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${jumpUpSettings.enabled ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            {jumpUpSettings.enabled && (
                                <div className="space-y-4 pt-3 border-t border-green-500/30">
                                    {/* 탭 선택 */}
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={() => setJumpUpSettings(prev => ({ ...prev, type: 'package' }))}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${(jumpUpSettings as any).type !== 'custom'
                                                ? 'bg-green-500 text-black border-green-400'
                                                : 'bg-black/50 text-white/70 border-white/20 hover:border-green-400/50'
                                                }`}
                                        >
                                            기간 패키지
                                            <span className="ml-1 text-xs text-red-500 font-bold">20% 할인</span>
                                        </button>
                                        <button
                                            onClick={() => setJumpUpSettings(prev => ({ ...prev, type: 'custom' }))}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${(jumpUpSettings as any).type === 'custom'
                                                ? 'bg-green-500 text-black border-green-400'
                                                : 'bg-black/50 text-white/70 border-white/20 hover:border-green-400/50'
                                                }`}
                                        >
                                            직접 선택
                                        </button>
                                    </div>

                                    {/* 패키지 상품 (20% 할인) */}
                                    {(jumpUpSettings as any).type !== 'custom' && (
                                        <div>
                                            <div className="text-xs text-white/60 font-medium mb-2 flex items-center gap-2">
                                                기간 패키지 상품
                                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold">20% 할인 적용</span>
                                            </div>
                                            <div className="space-y-2">
                                                {[
                                                    { days: 30, count: 300, original: 15000, price: 12000, discount: 20 },
                                                    { days: 60, count: 700, original: 35000, price: 28000, discount: 20 },
                                                    { days: 90, count: 1200, original: 60000, price: 48000, discount: 20 }
                                                ].map(opt => (
                                                    <label key={opt.days} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${jumpUpSettings.count === opt.count
                                                        ? 'border-green-400 bg-green-500/10'
                                                        : 'border-white/10 hover:border-white/30'
                                                        }`}>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="radio"
                                                                name="jumpPackage"
                                                                checked={jumpUpSettings.count === opt.count}
                                                                onChange={() => setJumpUpSettings(prev => ({ ...prev, count: opt.count, interval: 1 }))}
                                                                className="w-4 h-4 accent-green-500"
                                                            />
                                                            <div>
                                                                <span className="text-white font-bold">{opt.days}일</span>
                                                                <span className="text-white/60 text-sm ml-2">({opt.count}회)</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-white/40 text-xs line-through mr-2">{opt.original.toLocaleString()}원</span>
                                                            <span className="text-green-400 font-bold">{opt.price.toLocaleString()}원</span>
                                                            <span className="text-red-400 text-xs ml-1">-{opt.discount}%</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 직접 선택 (정가) */}
                                    {(jumpUpSettings as any).type === 'custom' && (
                                        <div className="space-y-4">
                                            {/* 주기 선택 */}
                                            <div>
                                                <div className="text-xs text-white/60 font-medium mb-2 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    점프 주기 (며칠마다 실행)
                                                </div>
                                                <div className="flex gap-2">
                                                    {[
                                                        { days: 1, label: '1일', desc: '매일' },
                                                        { days: 3, label: '3일', desc: '3일마다' },
                                                        { days: 7, label: '7일', desc: '주 1회' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.days}
                                                            onClick={() => setJumpUpSettings(prev => ({ ...prev, interval: opt.days }))}
                                                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border ${jumpUpSettings.interval === opt.days
                                                                ? 'bg-green-500 text-black border-green-400'
                                                                : 'bg-black/50 text-white border-white/20 hover:border-green-400/50'
                                                                }`}
                                                        >
                                                            <div className="font-bold text-base">{opt.label}</div>
                                                            <div className={`text-[10px] mt-0.5 ${jumpUpSettings.interval === opt.days ? 'text-black/70' : 'text-white/50'}`}>{opt.desc}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 횟수 선택 (레퍼런스 기준) */}
                                            <div>
                                                <div className="text-xs text-white/60 font-medium mb-2">
                                                    점프 횟수 선택 (클릭별)
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        { count: 200, price: 10000 },
                                                        { count: 450, price: 20000 },
                                                        { count: 700, price: 30000 },
                                                        { count: 1200, price: 50000 },
                                                        { count: 2000, price: 80000 }
                                                    ].map(opt => (
                                                        <label key={opt.count} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${jumpUpSettings.count === opt.count
                                                            ? 'border-green-400 bg-green-500/10'
                                                            : 'border-white/10 hover:border-white/30'
                                                            }`}>
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="radio"
                                                                    name="jumpCount"
                                                                    checked={jumpUpSettings.count === opt.count}
                                                                    onChange={() => setJumpUpSettings(prev => ({ ...prev, count: opt.count }))}
                                                                    className="w-4 h-4 accent-green-500"
                                                                />
                                                                <span className="text-white font-bold">{opt.count}회</span>
                                                            </div>
                                                            <span className="text-green-400 font-bold">{opt.price.toLocaleString()}원</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 결과 요약 */}
                                    <div className="bg-black/50 rounded-lg p-4 text-center border border-green-500/30">
                                        {(jumpUpSettings as any).type !== 'custom' ? (
                                            <>
                                                <p className="text-white text-base">
                                                    <span className="text-green-400 font-bold">{jumpUpSettings.count}회</span> 점프 ={' '}
                                                    <span className="text-yellow-400 font-bold text-xl ml-1">
                                                        +{[12000, 28000, 48000][[300, 700, 1200].indexOf(jumpUpSettings.count)]?.toLocaleString() || '12,000'}원
                                                    </span>
                                                    <span className="text-red-400 text-xs ml-2">(20% 할인)</span>
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-green-500/20">
                                                    <p className="text-green-400 font-bold text-lg">
                                                        약 <span className="text-2xl text-white">{[30, 60, 90][[300, 700, 1200].indexOf(jumpUpSettings.count)] || 30}일</span> 간 자동 상위업 유지
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-white text-base">
                                                    <span className="text-green-400 font-bold">{jumpUpSettings.interval}일</span>마다{' '}
                                                    <span className="text-green-400 font-bold">{jumpUpSettings.count}회</span> 점프 ={' '}
                                                    <span className="text-yellow-400 font-bold text-xl ml-1">
                                                        +{[10000, 20000, 30000, 50000, 80000][[200, 450, 700, 1200, 2000].indexOf(jumpUpSettings.count)]?.toLocaleString() || '10,000'}원
                                                    </span>
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-green-500/20">
                                                    <p className="text-green-400 font-bold text-lg">
                                                        약 <span className="text-2xl text-white">{Math.ceil(jumpUpSettings.count * jumpUpSettings.interval / ([200, 450, 700, 1200, 2000].includes(jumpUpSettings.count) ? (jumpUpSettings.count / 30) : 10))}일</span> 간 자동 상위업 유지
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Highlight Add-on - 드래그 선택 방식 */}
                        <div className={`rounded-lg border p-4 transition-all ${highlightSettings.color
                            ? 'bg-pink-500/10 border-pink-500/50'
                            : 'bg-white/[0.03] border-white/10'
                            }`}>
                            {/* 헤더 */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Palette size={18} className="text-pink-400" />
                                    <span className="text-sm font-bold text-white">형광펜 선택</span>
                                </div>
                                <span className="text-white/50 text-xs">사용할 형광펜 색을 설정하세요.</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* 왼쪽: 기간별 가격표 */}
                                <div>
                                    <div className="text-xs text-white/60 font-medium mb-3">형광펜 채용정보</div>
                                    <div className="space-y-2">
                                        {highlightPeriods.map(period => (
                                            <label key={period.days} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${highlightPeriod === period.days
                                                ? 'border-pink-400 bg-pink-500/10'
                                                : 'border-white/10 hover:border-white/30'}`}>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="highlightPeriod"
                                                        checked={highlightPeriod === period.days}
                                                        onChange={() => setHighlightPeriod(period.days)}
                                                        className="w-4 h-4 accent-pink-500"
                                                    />
                                                    <span className="text-white/60 text-sm">기간별</span>
                                                    <span className="text-white font-bold">{period.label}</span>
                                                </div>
                                                <span className="text-green-400 font-bold">{period.price.toLocaleString()}원</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 오른쪽: 색상 선택 */}
                                <div>
                                    <div className="text-xs text-white/60 font-medium mb-3">색상 선택 (8가지)</div>
                                    <div className="grid grid-cols-4 gap-3">
                                        {highlightColors.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    // 드래그로 선택된 텍스트가 있으면 형광펜 적용
                                                    const selection = window.getSelection();
                                                    const selectedText = selection?.toString().trim();
                                                    if (selectedText && _formData.title.includes(selectedText)) {
                                                        setHighlightText(selectedText);
                                                        setHighlightSettings({
                                                            color: item.id,
                                                            text: selectedText
                                                        });
                                                    } else if (highlightText) {
                                                        // 이미 선택된 텍스트가 있으면 색상만 변경
                                                        setHighlightSettings({
                                                            color: item.id,
                                                            text: highlightText
                                                        });
                                                    } else {
                                                        // 선택된 텍스트가 없으면 색상만 설정
                                                        setHighlightSettings({
                                                            color: item.id,
                                                            text: ''
                                                        });
                                                    }
                                                }}
                                                className="flex flex-col items-center gap-1 group"
                                            >
                                                <div className={`w-10 h-10 ${item.color} rounded-lg transition-all flex items-center justify-center ${highlightSettings.color === item.id
                                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                                                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                                                    }`}>
                                                    {highlightSettings.color === item.id && <span className="text-black font-bold text-xs">V</span>}
                                                </div>
                                                <span className={`text-[10px] ${highlightSettings.color === item.id ? 'text-white font-bold' : 'text-white/50'}`}>
                                                    {item.name} 형광펜
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 형광펜 적용 - 제목에서 드래그 선택 방식 */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="text-xs text-white/60 font-medium mb-2">
                                    형광펜 적용 텍스트 (제목에서 강조할 부분 입력)
                                </div>

                                {/* 사용자가 입력한 공고 제목 표시 - 드래그 선택 가능 */}
                                <div
                                    className="w-full p-4 rounded-lg bg-black/50 border border-white/20 text-white text-lg select-text cursor-text"
                                    onMouseUp={() => {
                                        const selection = window.getSelection();
                                        const selectedText = selection?.toString().trim();
                                        if (selectedText && _formData.title.includes(selectedText)) {
                                            setHighlightText(selectedText);
                                        }
                                    }}
                                >
                                    {/* 형광펜이 적용된 제목 미리보기 */}
                                    {_formData.title ? (
                                        highlightText && highlightSettings.color ? (
                                            <span>
                                                {_formData.title.split(highlightText).map((part: string, idx: number, arr: string[]) => (
                                                    <span key={idx}>
                                                        {part}
                                                        {idx < arr.length - 1 && (
                                                            <span className={`${highlightColors.find(c => c.id === highlightSettings.color)?.color} text-black px-1 rounded font-bold`}>
                                                                {highlightText}
                                                            </span>
                                                        )}
                                                    </span>
                                                ))}
                                            </span>
                                        ) : (
                                            <span className="text-white/70">{_formData.title}</span>
                                        )
                                    ) : (
                                        <span className="text-white/40">공고 제목을 먼저 입력해주세요</span>
                                    )}
                                </div>

                                {/* 안내 문구 */}
                                <div className="mt-2 text-xs text-white/50 flex items-center justify-between">
                                    <span>
                                        {highlightText
                                            ? `선택된 텍스트: "${highlightText}"`
                                            : '위 제목에서 강조할 부분을 드래그로 선택하세요'}
                                    </span>
                                    {highlightText && (
                                        <button
                                            onClick={() => {
                                                setHighlightText('');
                                                setHighlightSettings({ color: '', text: '' });
                                            }}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            선택 해제
                                        </button>
                                    )}
                                </div>

                                {/* 가격 표시 */}
                                {highlightSettings.color && highlightText && (
                                    <div className="mt-3 flex justify-end">
                                        <span className="text-pink-400 font-bold text-lg">
                                            +{highlightPeriods.find(p => p.days === highlightPeriod)?.price.toLocaleString()}원
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Order Summary */}
            <div className="mt-8 space-y-6">
                {/* 주문 내역 섹션 */}
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-xl border border-white/10 p-6">
                    <h4 className="font-bold text-white mb-4 pb-3 border-b border-white/10 text-lg">
                        주문 내역
                    </h4>

                    {Object.keys(selectedProducts).length === 0 && !jumpUpSettings.enabled && !highlightSettings.color ? (
                        <p className="text-white/40 text-center py-8">상품을 선택해주세요</p>
                    ) : (
                        <div className="space-y-3">
                            {/* 선택한 상품 목록 */}
                            {Object.keys(selectedProducts).map((productId) => {
                                const product = products.find(p => p.id === productId);
                                if (!product) return null;
                                const qty = selectedProducts[productId].qty;
                                const startDate = selectedProducts[productId].startDate;
                                const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));
                                return (
                                    <div key={productId} className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-white/10">
                                        <div>
                                            <span className="text-white font-bold text-base">{product.name}</span>
                                            <span className="text-primary ml-2 font-bold">x{qty}</span>
                                            <div className="text-white/50 text-xs mt-1">
                                                시작일: <span className="text-white">{startDate || today}</span>
                                            </div>
                                        </div>
                                        <span className="text-white font-bold text-lg">{(priceNum * qty).toLocaleString()}원</span>
                                    </div>
                                );
                            })}

                            {/* 상위업 */}
                            {jumpUpSettings.enabled && (
                                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                                    <div>
                                        <span className="text-green-400 font-bold text-base">자동 상위업</span>
                                        <div className="text-white/50 text-xs mt-1">
                                            {jumpUpSettings.interval}일마다 × {jumpUpSettings.count}회
                                        </div>
                                    </div>
                                    <span className="text-green-400 font-bold text-lg">{jumpUpTotal.toLocaleString()}원</span>
                                </div>
                            )}

                            {/* 형광펜 */}
                            {highlightSettings.color && (
                                <div className="flex justify-between items-center p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
                                    <div>
                                        <span className="text-pink-400 font-bold text-base">형광펜 효과</span>
                                        <div className="text-white/50 text-xs mt-1">
                                            {highlightPeriod}일 / {highlightText || '미설정'}
                                        </div>
                                    </div>
                                    <span className="text-pink-400 font-bold text-lg">{highlightPeriods.find(p => p.days === highlightPeriod)?.price.toLocaleString()}원</span>
                                </div>
                            )}

                            {/* 총 금액 */}
                            <div className="flex justify-between items-center pt-4 border-t border-white/20 mt-4">
                                <span className="text-white font-bold text-xl">총 결제금액</span>
                                <span className="text-3xl font-bold text-primary">{grandTotal.toLocaleString()}원</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 동의 항목 섹션 */}
                <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-xl border border-white/10 p-6">
                    {/* 전체 동의 */}
                    <label className="flex items-center gap-3 cursor-pointer mb-4 pb-4 border-b border-white/10" onClick={() => handleAllAgreedChange(!allAgreed)}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${allAgreed ? 'bg-primary border-primary' : 'border-white/30 bg-transparent hover:border-white/50'}`}>
                            {allAgreed && <span className="text-black text-sm font-bold">✓</span>}
                        </div>
                        <span className="text-white font-bold text-lg">전체 동의</span>
                    </label>

                    {/* 개별 동의 항목 */}
                    <div className="space-y-4">
                        {[
                            '최저임금을 준수하지 않는 경우, 광고 강제 마감 및 행정처분을 받을 수 있습니다.',
                            '모집 채용에서 허위 및 과장으로 작성된 내용이 확인될 경우, 광고 강제 마감 및 행정처분을 받을 수 있습니다.',
                            '모집 채용에서 보이스피싱, 불법 성매매, 구인사기 등으로 추정되는 내용이 확인될 경우, 광고 게재가 불가합니다.',
                            '소정 근로 시간 기준의 급여 외 수당이 발생했을 경우, 광고에 입력한 급여 외 추가 지급되어야 합니다.'
                        ].map((text, idx) => (
                            <label key={idx} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors" onClick={() => {
                                const newAgreements = [...individualAgreements];
                                newAgreements[idx] = !newAgreements[idx];
                                setIndividualAgreements(newAgreements);
                            }}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${individualAgreements[idx] ? 'bg-primary/20 border-primary' : 'border-white/30 bg-transparent group-hover:border-white/50'}`}>
                                    {individualAgreements[idx] && <span className="text-primary text-xs font-bold">✓</span>}
                                </div>
                                <span className="text-sm text-white/70 leading-relaxed group-hover:text-white transition-colors">
                                    {text}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 결제 버튼 */}
                <button
                    onClick={onSubmit}
                    disabled={loading || Object.keys(selectedProducts).length === 0 || !allAgreed}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-black font-bold text-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '등록 중...' : `${grandTotal.toLocaleString()}원 결제 신청하기`}
                </button>

                {/* 결제 안내 섹션 */}
                {grandTotal > 0 && (
                    <PaymentInfo
                        totalAmount={grandTotal}
                        productName={Object.keys(selectedProducts).map(id => {
                            const product = products.find(p => p.id === id);
                            return product ? `${product.name} x${selectedProducts[id].qty}` : '';
                        }).filter(Boolean).join(', ')}
                    />
                )}
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
        </div >
    );
};

export default Step3ProductSelection;
