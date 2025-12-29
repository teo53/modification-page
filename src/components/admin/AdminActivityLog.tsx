// =============================================================================
// 📁 src/components/admin/AdminActivityLog.tsx
// 🏷️  관리자 대시보드 실시간 활동 로그 컴포넌트
// =============================================================================

import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityLog {
    type: 'join' | 'ad' | 'report' | 'payment';
    text: string;
    time: string;
}

interface AdminActivityLogProps {
    isOperationalMode: boolean;
}

const sampleLogs: ActivityLog[] = [
    { type: 'join', text: '신규 회원 가입 (user123)', time: '방금 전' },
    { type: 'ad', text: '새로운 광고 등록 요청', time: '5분 전' },
    { type: 'report', text: '게시글 신고 접수', time: '12분 전' },
    { type: 'payment', text: 'VIP 상품 결제 완료', time: '25분 전' },
];

const getLogColor = (type: string): string => {
    const colors: Record<string, string> = {
        join: 'bg-blue-500',
        ad: 'bg-yellow-500',
        report: 'bg-red-500',
        payment: 'bg-green-500'
    };
    return colors[type] || 'bg-gray-500';
};

const AdminActivityLog: React.FC<AdminActivityLogProps> = ({ isOperationalMode }) => {
    return (
        <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white">실시간 활동 로그</h3>
            </div>

            {isOperationalMode ? (
                <div className="p-8 text-center">
                    <Activity size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                    <p className="text-text-muted text-sm">활동 로그가 없습니다</p>
                    <p className="text-xs text-text-muted/50 mt-1">실시간 로깅 시스템 연동 후 표시됩니다</p>
                </div>
            ) : (
                <div className="p-4 space-y-4">
                    {sampleLogs.map((log, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full ${getLogColor(log.type)}`} />
                            <div>
                                <p className="text-sm text-white">{log.text}</p>
                                <span className="text-xs text-text-muted">{log.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminActivityLog;
