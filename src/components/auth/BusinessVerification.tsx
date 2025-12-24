import React, { useState } from 'react';
import { Building2, Upload, CheckCircle, AlertCircle, Loader2, FileText, X } from 'lucide-react';

interface BusinessVerificationProps {
    businessNumber: string;
    businessName: string;
    onBusinessNumberChange: (value: string) => void;
    onBusinessNameChange: (value: string) => void;
    onVerified: (verified: boolean) => void;
    onCertificateChange: (file: File | null) => void;
    isVerified: boolean;
}

const BusinessVerification: React.FC<BusinessVerificationProps> = ({
    businessNumber,
    businessName,
    onBusinessNumberChange,
    onBusinessNameChange,
    onVerified,
    onCertificateChange,
    isVerified
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationResult, setVerificationResult] = useState<{
        valid: boolean;
        status: string;
        taxType: string;
    } | null>(null);
    const [certificate, setCertificate] = useState<File | null>(null);
    const [certificatePreview, setCertificatePreview] = useState<string | null>(null);

    // Format business number (000-00-00000)
    const formatBusinessNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
    };

    const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatBusinessNumber(e.target.value);
        onBusinessNumberChange(formatted);
        // Reset verification when number changes
        if (isVerified) {
            onVerified(false);
            setVerificationResult(null);
        }
    };

    // Validate business number format (10 digits)
    const isValidFormat = (num: string) => {
        const digits = num.replace(/\D/g, '');
        return digits.length === 10;
    };

    // Verify business number via API
    const verifyBusinessNumber = async () => {
        if (!isValidFormat(businessNumber)) {
            setError('사업자등록번호 10자리를 입력해주세요.');
            return;
        }

        if (!businessName.trim()) {
            setError('상호명을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const cleanNumber = businessNumber.replace(/\D/g, '');
            const apiUrl = import.meta.env.VITE_API_URL;

            // 백엔드 API가 설정된 경우 API 호출
            if (apiUrl) {
                try {
                    const response = await fetch(`${apiUrl}/business/validate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ businessNumber: cleanNumber }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        setVerificationResult({
                            valid: true,
                            status: data.data.status,
                            taxType: data.data.taxType
                        });
                        onVerified(true);
                    } else {
                        setVerificationResult({
                            valid: false,
                            status: '확인불가',
                            taxType: '-'
                        });
                        setError(data.message || '유효하지 않은 사업자등록번호입니다.');
                        onVerified(false);
                    }
                    return;
                } catch (err) {
                    console.log('API 호출 실패, 로컬 검증으로 대체:', err);
                    // API 실패 시 로컬 검증으로 폴백
                }
            }

            // 로컬 검증 (API 없거나 실패 시)
            await new Promise(resolve => setTimeout(resolve, 500));
            const isValidChecksum = validateBusinessNumberChecksum(cleanNumber);

            if (isValidChecksum) {
                setVerificationResult({
                    valid: true,
                    status: '형식 검증 완료',
                    taxType: '확인 필요'
                });
                onVerified(true);
            } else {
                setVerificationResult({
                    valid: false,
                    status: '확인불가',
                    taxType: '-'
                });
                setError('유효하지 않은 사업자등록번호입니다.');
                onVerified(false);
            }
        } catch (err) {
            setError('사업자 확인 중 오류가 발생했습니다.');
            onVerified(false);
        } finally {
            setLoading(false);
        }
    };

    // Business number checksum validation (한국 사업자번호 검증 알고리즘)
    const validateBusinessNumberChecksum = (num: string): boolean => {
        if (num.length !== 10) return false;

        const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += parseInt(num[i]) * weights[i];
        }

        sum += Math.floor((parseInt(num[8]) * 5) / 10);
        const checkDigit = (10 - (sum % 10)) % 10;

        return checkDigit === parseInt(num[9]);
    };

    // Handle certificate file upload
    const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setError('JPG, PNG, GIF 또는 PDF 파일만 업로드 가능합니다.');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('파일 크기는 10MB 이하만 가능합니다.');
            return;
        }

        setCertificate(file);
        onCertificateChange(file);
        setError('');

        // Generate preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCertificatePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setCertificatePreview(null);
        }
    };

    // Remove uploaded certificate
    const removeCertificate = () => {
        setCertificate(null);
        setCertificatePreview(null);
        onCertificateChange(null);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 size={16} className="text-primary" /> 사업자 정보
            </h3>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Business Number Input */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted">
                    사업자등록번호 <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={businessNumber}
                        onChange={handleBusinessNumberChange}
                        className={`flex-1 bg-background border rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-colors ${isVerified ? 'border-green-500/50' : 'border-white/10'
                            }`}
                        placeholder="000-00-00000"
                        maxLength={12}
                        disabled={isVerified}
                    />
                    {!isVerified ? (
                        <button
                            type="button"
                            onClick={verifyBusinessNumber}
                            disabled={loading || !isValidFormat(businessNumber)}
                            className="px-4 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                '확인'
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                onVerified(false);
                                setVerificationResult(null);
                            }}
                            className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                        >
                            재입력
                        </button>
                    )}
                </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
                <div className={`p-4 rounded-lg border ${verificationResult.valid
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex items-center gap-3">
                        {verificationResult.valid ? (
                            <CheckCircle className="text-green-400" size={20} />
                        ) : (
                            <AlertCircle className="text-red-400" size={20} />
                        )}
                        <div>
                            <div className={`font-medium ${verificationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                                {verificationResult.valid ? '사업자 확인 완료' : '확인 실패'}
                            </div>
                            <div className="text-xs text-text-muted mt-1">
                                사업 상태: {verificationResult.status} | 과세 유형: {verificationResult.taxType}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Business Name Input */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted">
                    상호명 <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => onBusinessNameChange(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-colors"
                    placeholder="사업자등록증에 기재된 상호명"
                />
            </div>

            {/* Business Certificate Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted">
                    사업자등록증 사본 <span className="text-red-400">*</span>
                </label>

                {!certificate ? (
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                            <Upload className="mx-auto text-text-muted mb-3" size={32} />
                            <p className="text-sm text-white mb-1">사업자등록증을 업로드하세요</p>
                            <p className="text-xs text-text-muted">JPG, PNG, GIF, PDF (최대 10MB)</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleCertificateUpload}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                        <button
                            type="button"
                            onClick={removeCertificate}
                            className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                        >
                            <X size={16} />
                        </button>

                        {certificatePreview ? (
                            <div className="flex items-start gap-4">
                                <img
                                    src={certificatePreview}
                                    alt="사업자등록증"
                                    className="w-24 h-32 object-cover rounded-lg border border-white/10"
                                />
                                <div className="flex-1">
                                    <p className="text-white font-medium text-sm truncate">{certificate.name}</p>
                                    <p className="text-xs text-text-muted mt-1">
                                        {(certificate.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 text-green-400 text-xs">
                                        <CheckCircle size={14} />
                                        업로드 완료
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <FileText className="text-primary" size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium text-sm truncate">{certificate.name}</p>
                                    <p className="text-xs text-text-muted mt-1">
                                        PDF 파일 • {(certificate.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-green-400 text-xs">
                                    <CheckCircle size={14} />
                                    업로드 완료
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <p className="text-xs text-text-muted">
                    * 사업자등록증은 광고 승인 심사에 사용되며, 안전하게 보관됩니다.
                </p>
            </div>
        </div>
    );
};

export default BusinessVerification;
