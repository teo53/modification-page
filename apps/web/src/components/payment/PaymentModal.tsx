// Payment Modal Component
// 계좌이체 결제 정보 표시 및 복사 기능

import React, { useState } from 'react';
import { X, Copy, Check, CreditCard, Clock } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    amount: number;
    onPaymentComplete: (depositorName: string) => void;
}

// 계좌 정보 설정 (환경변수에서 읽어옴)
// .env 파일에 다음 변수 설정 필요:
// VITE_PAYMENT_BANK_NAME=카카오뱅크
// VITE_PAYMENT_ACCOUNT_NUMBER=3333-00-1234567
// VITE_PAYMENT_ACCOUNT_HOLDER=달빛알바
const BANK_INFO = {
    bankName: import.meta.env.VITE_PAYMENT_BANK_NAME || '(설정 필요)',
    accountNumber: import.meta.env.VITE_PAYMENT_ACCOUNT_NUMBER || '(설정 필요)',
    accountHolder: import.meta.env.VITE_PAYMENT_ACCOUNT_HOLDER || '(설정 필요)',
};

// 계좌정보 설정 확인
const isBankInfoConfigured = (): boolean => {
    return Boolean(
        import.meta.env.VITE_PAYMENT_BANK_NAME &&
        import.meta.env.VITE_PAYMENT_ACCOUNT_NUMBER &&
        import.meta.env.VITE_PAYMENT_ACCOUNT_HOLDER
    );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    productName,
    amount,
    onPaymentComplete
}) => {
    const [depositorName, setDepositorName] = useState('');
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const formatAmount = (num: number) => {
        return num.toLocaleString('ko-KR');
    };

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const handleSubmit = async () => {
        if (!depositorName.trim()) {
            alert('입금자명을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onPaymentComplete(depositorName);
            onClose();
        } catch (error) {
            console.error('Payment submission error:', error);
            alert('결제 요청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const CopyButton: React.FC<{ text: string; fieldName: string }> = ({ text, fieldName }) => (
        <button
            onClick={() => copyToClipboard(text, fieldName)}
            className="ml-2 p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
            title="복사하기"
        >
            {copiedField === fieldName ? (
                <Check size={16} className="text-green-400" />
            ) : (
                <Copy size={16} className="text-primary" />
            )}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-accent rounded-2xl border border-white/10 w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-primary/20 to-secondary/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                            <CreditCard className="text-primary" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">결제하기</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-text-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-6">
                    {/* Product Info */}
                    <div className="bg-background/50 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-text-muted mb-1">결제 상품</p>
                        <p className="text-lg font-bold text-white">{productName}</p>
                    </div>

                    {/* Amount */}
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
                        <p className="text-sm text-text-muted mb-1">결제 금액</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-primary">
                                {formatAmount(amount)}
                                <span className="text-lg ml-1">원</span>
                            </p>
                            <CopyButton text={String(amount)} fieldName="amount" />
                        </div>
                    </div>

                    {/* Bank Info */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-text-muted flex items-center gap-2">
                            <span>💳</span> 입금 계좌 정보
                        </h3>

                        {/* 계좌정보 미설정 경고 */}
                        {!isBankInfoConfigured() && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                                ⚠️ 결제 계좌 정보가 설정되지 않았습니다. 관리자에게 문의해주세요.
                            </div>
                        )}

                        {/* Bank Name */}
                        <div className="flex items-center justify-between bg-background/50 rounded-lg p-3 border border-white/5">
                            <div>
                                <p className="text-xs text-text-muted">은행</p>
                                <p className="text-white font-medium">{BANK_INFO.bankName}</p>
                            </div>
                            <CopyButton text={BANK_INFO.bankName} fieldName="bank" />
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between bg-background/50 rounded-lg p-3 border border-white/5">
                            <div>
                                <p className="text-xs text-text-muted">계좌번호</p>
                                <p className="text-white font-bold text-lg tracking-wide">{BANK_INFO.accountNumber}</p>
                            </div>
                            <CopyButton text={BANK_INFO.accountNumber.replace(/-/g, '')} fieldName="account" />
                        </div>

                        {/* Account Holder */}
                        <div className="flex items-center justify-between bg-background/50 rounded-lg p-3 border border-white/5">
                            <div>
                                <p className="text-xs text-text-muted">예금주</p>
                                <p className="text-white font-medium">{BANK_INFO.accountHolder}</p>
                            </div>
                            <CopyButton text={BANK_INFO.accountHolder} fieldName="holder" />
                        </div>

                        {/* Copy All */}
                        <button
                            onClick={() => copyToClipboard(
                                `${BANK_INFO.bankName} ${BANK_INFO.accountNumber} ${BANK_INFO.accountHolder}`,
                                'all'
                            )}
                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-muted text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            {copiedField === 'all' ? (
                                <>
                                    <Check size={16} className="text-green-400" />
                                    <span className="text-green-400">복사됨!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>계좌정보 전체 복사</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Depositor Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted flex items-center gap-2">
                            <span>👤</span> 입금자명
                        </label>
                        <input
                            type="text"
                            value={depositorName}
                            onChange={(e) => setDepositorName(e.target.value)}
                            placeholder="입금하실 분의 성함을 입력하세요"
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:border-primary outline-none"
                        />
                    </div>

                    {/* Notice */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <Clock size={18} className="text-yellow-400 mt-0.5 shrink-0" />
                            <div className="text-sm">
                                <p className="text-yellow-400 font-medium">입금 확인 안내</p>
                                <p className="text-yellow-400/70 mt-1">
                                    입금 후 "입금 완료" 버튼을 눌러주세요.<br />
                                    관리자 확인 후 광고가 게시됩니다. (평균 30분 이내)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-background/30">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !depositorName.trim()}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary font-bold text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                처리 중...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                입금 완료
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
