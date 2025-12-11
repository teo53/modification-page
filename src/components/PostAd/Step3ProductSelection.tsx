import React from 'react';
import { CreditCard, Zap, Clock, RefreshCw, Palette } from 'lucide-react';
import AdCard from '../ad/AdCard';

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
    formData,
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
    previewImage,
    loading,
    onSubmit,
    onPrev
}) => {
    const today = new Date().toISOString().split('T')[0];

    // Highlight colors
    const highlightColors = [
        { id: 'yellow', color: 'bg-yellow-500', name: '옐로우' },
        { id: 'pink', color: 'bg-pink-500', name: '핑크' },
        { id: 'green', color: 'bg-green-500', name: '그린' },
        { id: 'cyan', color: 'bg-cyan-400', name: '시안' },
        { id: 'blue', color: 'bg-blue-500', name: '블루' },
        { id: 'purple', color: 'bg-purple-500', name: '퍼플' },
        { id: 'orange', color: 'bg-orange-500', name: '오렌지' },
        { id: 'magenta', color: 'bg-fuchsia-500', name: '마젠타' },
    ];

    // Agreements text
    const agreementTexts = [
        '최저임금을 준수하지 않는 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
        '모집 채용에서 허위 및 과장으로 작성된 내용이 확인될 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
        '모집 채용에서 보이스피싱, 불법 성매매, 구인사기 등으로 추정되는 내용이 확인될 경우, 공고 게재가 불가합니다.',
        '소정 근로 시간 기준의 급여 외 수당이 발생했을 경우, 공고에 입력한 급여 외 추가 지급되어야 합니다.',
        '채용절차 공정화법상 금지되는 개인정보를 요구하는 경우, 공고 강제 마감 및 행정처분을 받을 수 있습니다.',
        '확인문서에 첨부한 문서의 책임은 본인에게 있습니다. 위 변조 및 도용일 경우 민 형사상의 책임이 따릅니다.'
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
        setIndividualAgreements(new Array(6).fill(checked));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <CreditCard className="text-primary" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">광고 상품 선택</h2>
                    <p className="text-sm text-white/50 mt-1">원하시는 광고 상품과 옵션을 선택해주세요</p>
                </div>
                <div className="ml-auto">
                    <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-primary/20 text-primary">
                        Step 3 / 3
                    </span>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Product Selection (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ad Products */}
                    <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard className="text-primary" size={20} />
                            광고 상품
                        </h3>

                        <div className="space-y-4">
                            {products.map((product) => {
                                const isSelected = !!selectedProducts[product.id];
                                const qty = selectedProducts[product.id]?.qty || 0;
                                const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));

                                return (
                                    <div
                                        key={product.id}
                                        className={`rounded-xl border-2 p-5 transition-all ${isSelected
                                            ? `${product.color} ${product.bg}`
                                            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className={`text-lg font-bold ${product.textColor || 'text-white'}`}>
                                                        {product.name}
                                                    </h4>
                                                    <span className="text-white/60 text-sm">
                                                        {product.duration}
                                                    </span>
                                                </div>
                                                <p className="text-xl font-bold text-white">{product.price}</p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {product.features.slice(0, 3).map((f: string, i: number) => (
                                                        <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/60">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Preview */}
                                            {['diamond', 'sapphire', 'ruby', 'gold'].includes(product.id) && (
                                                <div className="w-32 shrink-0 hidden md:block">
                                                    <AdCard
                                                        id="preview"
                                                        variant={product.id as any}
                                                        productType={product.id as any}
                                                        title={formData.title || '광고 제목'}
                                                        location={formData.location?.city || '서울'}
                                                        pay={formData.salary?.amount || '일급 300,000원'}
                                                        image={previewImage}
                                                        badges={[]}
                                                        isNew={true}
                                                        price={product.price}
                                                        duration={product.duration}
                                                    />
                                                </div>
                                            )}

                                            {/* Quantity Controls */}
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
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${qty > 0 ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/5 text-white/30'
                                                        }`}
                                                    disabled={qty === 0}
                                                >
                                                    −
                                                </button>
                                                <span className={`w-14 text-center font-bold ${qty > 0 ? 'text-white' : 'text-white/30'}`}>
                                                    {qty > 0 ? `${qty * (product.durationDays || 7)}일` : '0일'}
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
                                                    className="w-10 h-10 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center text-lg font-bold transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Selected: Start Date */}
                                        {isSelected && (
                                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={14} className="text-white/60" />
                                                    <span className="text-sm text-white/60">시작일</span>
                                                    <input
                                                        type="date"
                                                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-primary outline-none"
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
                                                <div className="text-lg font-bold text-primary">
                                                    {(priceNum * qty).toLocaleString()}원
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Auto Jump Up */}
                    <div className={`rounded-2xl border-2 p-6 transition-all ${jumpUpSettings.enabled
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-white/[0.03] border-white/10'
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <RefreshCw size={24} className={jumpUpSettings.enabled ? 'text-green-400' : 'text-white/60'} />
                                <div>
                                    <h3 className={`font-bold text-lg ${jumpUpSettings.enabled ? 'text-green-400' : 'text-white'}`}>
                                        자동 상위업
                                    </h3>
                                    <p className="text-xs text-white/60">지정한 주기로 광고를 최상단으로 끌어올립니다 (1,000원/회)</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setJumpUpSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                                className={`relative w-14 h-7 rounded-full transition-colors ${jumpUpSettings.enabled ? 'bg-green-500' : 'bg-white/20'
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${jumpUpSettings.enabled ? 'translate-x-7' : ''
                                    }`} />
                            </button>
                        </div>

                        {jumpUpSettings.enabled && (
                            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-green-500/30">
                                <div>
                                    <label className="text-xs text-white/60 mb-2 block">주기</label>
                                    <div className="flex gap-2">
                                        {[1, 3, 7].map(days => (
                                            <button
                                                key={days}
                                                onClick={() => setJumpUpSettings(prev => ({ ...prev, interval: days }))}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${jumpUpSettings.interval === days
                                                    ? 'bg-green-500 text-black'
                                                    : 'bg-black/30 text-white/60 hover:bg-black/40'
                                                    }`}
                                            >
                                                {days}일마다
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-white/60 mb-2 block">횟수</label>
                                    <div className="flex gap-2">
                                        {[10, 30, 60].map(cnt => (
                                            <button
                                                key={cnt}
                                                onClick={() => setJumpUpSettings(prev => ({ ...prev, count: cnt }))}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${jumpUpSettings.count === cnt
                                                    ? 'bg-green-500 text-black'
                                                    : 'bg-black/30 text-white/60 hover:bg-black/40'
                                                    }`}
                                            >
                                                {cnt}회
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Premium Add-ons */}
                    <div className="bg-gradient-to-br from-amber-900/20 to-rose-900/20 rounded-2xl border-2 border-amber-500/30 p-6">
                        <h3 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-2">
                            <Zap className="text-amber-400" size={20} />
                            프리미엄 애드온 옵션
                        </h3>


                        {/* Highlight Add-on - Only premium option */}
                        <div className="bg-black/30 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Palette size={18} className="text-pink-400" />
                                    <span className="font-bold text-white">형광펜 효과</span>
                                </div>
                                <span className="text-pink-400 font-bold">+50,000원</span>
                            </div>
                            <div className="grid grid-cols-8 gap-2">
                                {highlightColors.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setHighlightSettings({
                                            color: highlightSettings.color === item.id ? '' : item.id,
                                            text: ''
                                        })}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <div className={`w-full aspect-square ${item.color} rounded-lg transition-all ${highlightSettings.color === item.id
                                            ? 'ring-2 ring-white scale-110'
                                            : 'opacity-60 hover:opacity-100'
                                            }`} />
                                        <span className="text-[10px] text-white/50">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        {/* Order Summary */}
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-6">
                            <h4 className="font-bold text-white mb-4 pb-3 border-b border-white/10">
                                주문 내역
                            </h4>

                            {Object.keys(selectedProducts).length === 0 && !jumpUpSettings.enabled && !highlightSettings.color ? (
                                <p className="text-white/50 text-sm text-center py-6">상품을 선택해주세요</p>
                            ) : (
                                <div className="space-y-3">
                                    {/* Products */}
                                    {Object.keys(selectedProducts).map((productId) => {
                                        const product = products.find(p => p.id === productId);
                                        if (!product) return null;
                                        const qty = selectedProducts[productId].qty;
                                        const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));

                                        return (
                                            <div key={productId} className="flex justify-between text-sm">
                                                <span className="text-white/80">{product.name}</span>
                                                <span className="text-white font-medium">{(priceNum * qty).toLocaleString()}원</span>
                                            </div>
                                        );
                                    })}

                                    {/* Jump Up */}
                                    {jumpUpSettings.enabled && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-400">자동 상위업 ({jumpUpSettings.count}회)</span>
                                            <span className="text-white font-medium">{jumpUpTotal.toLocaleString()}원</span>
                                        </div>
                                    )}

                                    {/* Add-ons */}
                                    {highlightSettings.color && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-pink-400">형광펜 효과</span>
                                            <span className="text-white font-medium">50,000원</span>
                                        </div>
                                    )}

                                    <div className="border-t border-white/10 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-white">총 결제금액</span>
                                            <span className="text-2xl font-bold text-primary">{grandTotal.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Agreements */}
                        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5">
                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded accent-primary"
                                    checked={allAgreed}
                                    onChange={(e) => handleAllAgreedChange(e.target.checked)}
                                />
                                <span className="text-white font-bold">전체 동의</span>
                            </label>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {agreementTexts.map((text, idx) => (
                                    <label key={idx} className="flex gap-2 text-xs text-white/60 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-3.5 h-3.5 rounded mt-0.5 accent-primary shrink-0"
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
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <button
                    onClick={onPrev}
                    className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                >
                    ← 이전 단계
                </button>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm text-white/60">총 결제금액</div>
                        <div className="text-xl font-bold text-primary">{grandTotal.toLocaleString()}원</div>
                    </div>
                    <button
                        onClick={onSubmit}
                        disabled={loading || Object.keys(selectedProducts).length === 0 || !allAgreed}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '등록 중...' : '결제 및 등록'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step3ProductSelection;
