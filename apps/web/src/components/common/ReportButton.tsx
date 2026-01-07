// Report Button Component
// 광고/게시글 신고 기능

import React, { useState } from 'react';
import { Flag, X, AlertTriangle, Send } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

interface ReportButtonProps {
    targetType: 'ad' | 'post' | 'comment' | 'user';
    targetId: string;
    targetTitle?: string;
}

const REPORT_REASONS = [
    { id: 'spam', label: '스팸/광고' },
    { id: 'inappropriate', label: '부적절한 콘텐츠' },
    { id: 'fraud', label: '사기/허위 정보' },
    { id: 'harassment', label: '괴롭힘/혐오 표현' },
    { id: 'copyright', label: '저작권 침해' },
    { id: 'illegal', label: '불법 콘텐츠' },
    { id: 'other', label: '기타' },
];

const ReportButton: React.FC<ReportButtonProps> = ({
    targetType,
    targetId,
    targetTitle
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = getCurrentUser();

    const handleReport = async () => {
        if (!selectedReason) {
            alert('신고 사유를 선택해주세요.');
            return;
        }

        if (!user) {
            alert('로그인 후 이용해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 신고 데이터 저장 (localStorage에 임시 저장 - 나중에 API로 교체)
            const reports = JSON.parse(localStorage.getItem('lunaalba_reports') || '[]');
            const newReport = {
                id: Date.now().toString(),
                targetType,
                targetId,
                targetTitle,
                reason: selectedReason,
                reasonLabel: REPORT_REASONS.find(r => r.id === selectedReason)?.label,
                additionalInfo,
                reporterId: user.id,
                reporterEmail: user.email,
                createdAt: new Date().toISOString(),
                status: 'pending', // pending, reviewed, dismissed, actioned
            };
            reports.push(newReport);
            localStorage.setItem('lunaalba_reports', JSON.stringify(reports));

            setIsSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setIsSuccess(false);
                setSelectedReason('');
                setAdditionalInfo('');
            }, 2000);
        } catch (error) {
            console.error('Report submission error:', error);
            alert('신고 접수 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTargetTypeLabel = () => {
        switch (targetType) {
            case 'ad': return '광고';
            case 'post': return '게시글';
            case 'comment': return '댓글';
            case 'user': return '사용자';
            default: return '콘텐츠';
        }
    };

    return (
        <>
            {/* Report Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-red-400 transition-colors"
                title="신고하기"
            >
                <Flag size={14} />
                <span className="hidden sm:inline">신고</span>
            </button>

            {/* Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="relative bg-accent rounded-2xl border border-white/10 w-full max-w-md overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-red-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/20">
                                    <AlertTriangle className="text-red-400" size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {getTargetTypeLabel()} 신고
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X size={20} className="text-text-muted" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-5">
                            {isSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Send className="text-green-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        신고가 접수되었습니다
                                    </h3>
                                    <p className="text-text-muted">
                                        관리자가 검토 후 적절한 조치를 취하겠습니다.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Target Info */}
                                    {targetTitle && (
                                        <div className="bg-background/50 rounded-lg p-3 border border-white/5">
                                            <p className="text-xs text-text-muted mb-1">신고 대상</p>
                                            <p className="text-white text-sm line-clamp-2">{targetTitle}</p>
                                        </div>
                                    )}

                                    {/* Reason Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">
                                            신고 사유 *
                                        </label>
                                        <div className="space-y-2">
                                            {REPORT_REASONS.map((reason) => (
                                                <label
                                                    key={reason.id}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedReason === reason.id
                                                            ? 'bg-red-500/10 border-red-500/50'
                                                            : 'bg-background/30 border-white/5 hover:border-white/20'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        value={reason.id}
                                                        checked={selectedReason === reason.id}
                                                        onChange={(e) => setSelectedReason(e.target.value)}
                                                        className="w-4 h-4 text-red-500 bg-background border-white/20"
                                                    />
                                                    <span className="text-white text-sm">{reason.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">
                                            상세 설명 (선택)
                                        </label>
                                        <textarea
                                            value={additionalInfo}
                                            onChange={(e) => setAdditionalInfo(e.target.value)}
                                            placeholder="추가로 알려주실 내용이 있다면 입력해주세요."
                                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:border-red-500/50 outline-none resize-none h-24"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {!isSuccess && (
                            <div className="p-5 border-t border-white/10 bg-background/30 flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-text-muted hover:bg-white/5 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleReport}
                                    disabled={isSubmitting || !selectedReason}
                                    className="flex-1 py-3 rounded-xl bg-red-500 font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            처리 중...
                                        </>
                                    ) : (
                                        '신고하기'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportButton;

// 신고 목록 조회 함수 (관리자용)
export const getReports = () => {
    return JSON.parse(localStorage.getItem('lunaalba_reports') || '[]');
};

// 신고 상태 업데이트 (관리자용)
export const updateReportStatus = (
    reportId: string,
    status: 'reviewed' | 'dismissed' | 'actioned',
    adminNote?: string
) => {
    const reports = getReports();
    const index = reports.findIndex((r: any) => r.id === reportId);
    if (index !== -1) {
        reports[index].status = status;
        reports[index].adminNote = adminNote;
        reports[index].reviewedAt = new Date().toISOString();
        localStorage.setItem('lunaalba_reports', JSON.stringify(reports));
        return { success: true, message: '신고 상태가 업데이트되었습니다.' };
    }
    return { success: false, message: '신고를 찾을 수 없습니다.' };
};
