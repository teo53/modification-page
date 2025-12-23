// =============================================================================
// 📁 src/components/payment/PaymentInfo.tsx
// 🏷️  결제 안내 컴포넌트 (무통장입금)
// =============================================================================

import React, { useState } from 'react';
import { CreditCard, Copy, CheckCircle, Clock, Phone, MessageCircle, AlertCircle } from 'lucide-react';
import PAYMENT_CONFIG from '../../config/payment';

interface PaymentInfoProps {
    totalAmount: number;
    productName?: string;
    onPaymentConfirm?: () => void;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
    totalAmount,
    productName,
    onPaymentConfirm
}) => {
    const [copied, setCopied] = useState<'account' | 'amount' | null>(null);
    const [depositorName, setDepositorName] = useState('');
    const [depositConfirmed, setDepositConfirmed] = useState(false);

    const copyToClipboard = (text: string, type: 'account' | 'amount') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('ko-KR') + '원';
    };

    const handleDepositConfirm = () => {
        if (!depositorName.trim()) {
            alert('입금자명을 입력해주세요.');
            return;
        }
        setDepositConfirmed(true);
        onPaymentConfirm?.();
    };

    return (
        <div className="bg-gradient-to-br from-primary/10 to-amber-500/5 rounded-xl border border-primary/30 overflow-hidden">
            {/* Header */}
            <div className="bg-primary/20 px-6 py-4 border-b border-primary/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                        <CreditCard className="text-primary" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">결제 안내</h3>
                        <p className="text-sm text-text-muted">무통장입금</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* 결제 금액 */}
                <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-text-muted">결제 금액</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                                {formatAmount(totalAmount)}
                            </span>
                            <button
                                onClick={() => copyToClipboard(totalAmount.toString(), 'amount')}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title="금액 복사"
                            >
                                {copied === 'amount' ? (
                                    <CheckCircle size={16} className="text-green-400" />
                                ) : (
                                    <Copy size={16} className="text-text-muted" />
                                )}
                            </button>
                        </div>
                    </div>
                    {productName && (
                        <p className="text-sm text-text-muted mt-1">선택 상품: {productName}</p>
                    )}
                </div>

                {/* 입금 계좌 */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 bg-primary/30 rounded-full flex items-center justify-center text-xs text-primary">1</span>
                        입금 계좌
                    </h4>
                    <div className="bg-background rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold text-white">
                                    {PAYMENT_CONFIG.bankName} {PAYMENT_CONFIG.accountNumber}
                                </p>
                                <p className="text-sm text-text-muted">{PAYMENT_CONFIG.accountHolder}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(PAYMENT_CONFIG.accountNumber, 'account')}
                                className="px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors flex items-center gap-2 text-primary text-sm font-medium"
                            >
                                {copied === 'account' ? (
                                    <>
                                        <CheckCircle size={16} />
                                        복사됨
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        계좌 복사
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 입금자명 입력 */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 bg-primary/30 rounded-full flex items-center justify-center text-xs text-primary">2</span>
                        입금자명 입력
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={depositorName}
                            onChange={(e) => setDepositorName(e.target.value)}
                            placeholder="업소명 또는 연락처 끝 4자리"
                            className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <p className="text-xs text-text-muted">
                        * 입금 시 입금자명을 위와 동일하게 입력해주세요.
                    </p>
                </div>

                {/* 안내사항 */}
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-400" />
                        안내사항
                    </h4>
                    <ul className="space-y-1.5 text-sm text-text-muted">
                        {PAYMENT_CONFIG.depositGuide.map((guide, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-primary shrink-0">•</span>
                                <span>{guide}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 영업시간 & 문의 */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center gap-2 text-text-muted mb-2">
                            <Clock size={16} />
                            <span className="text-sm">영업시간</span>
                        </div>
                        <p className="text-sm text-white">평일: {PAYMENT_CONFIG.businessHours.weekday}</p>
                        <p className="text-sm text-text-muted">주말: {PAYMENT_CONFIG.businessHours.weekend}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center gap-2 text-text-muted mb-2">
                            <Phone size={16} />
                            <span className="text-sm">문의</span>
                        </div>
                        <p className="text-sm text-white">{PAYMENT_CONFIG.contact.phone}</p>
                        <p className="text-sm text-text-muted flex items-center gap-1">
                            <MessageCircle size={12} />
                            카카오톡: {PAYMENT_CONFIG.contact.kakao}
                        </p>
                    </div>
                </div>

                {/* 입금 완료 버튼 */}
                <button
                    onClick={handleDepositConfirm}
                    disabled={depositConfirmed}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${depositConfirmed
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-primary text-black hover:bg-primary/90'
                        }`}
                >
                    {depositConfirmed ? (
                        <span className="flex items-center justify-center gap-2">
                            <CheckCircle size={20} />
                            입금 완료 신청됨
                        </span>
                    ) : (
                        '입금 완료 신청하기'
                    )}
                </button>

                {depositConfirmed && (
                    <p className="text-center text-sm text-green-400">
                        입금 확인 후 광고가 게시됩니다. (영업시간 내 1~2시간 이내)
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentInfo;
