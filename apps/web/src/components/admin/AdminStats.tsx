// =============================================================================
// 📁 src/components/admin/AdminStats.tsx
// 🏷️  관리자 대시보드 통계 카드 컴포넌트
// =============================================================================

import React from 'react';
import { Users, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface AdminStatsProps {
    isOperationalMode: boolean;
    userCount: number;
    pendingAdsCount: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({
    isOperationalMode,
    userCount,
    pendingAdsCount
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* 총 회원수 */}
            <div className="bg-accent p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-muted">총 회원수</span>
                    <Users className="text-blue-500" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">
                    {isOperationalMode ? userCount.toLocaleString() : '5,432'}
                </p>
                <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                    {isOperationalMode ? '실제 데이터' : '+125명 (오늘)'}
                </span>
            </div>

            {/* 월 매출 */}
            <div className="bg-accent p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-muted">월 매출</span>
                    <DollarSign className="text-primary" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">
                    {isOperationalMode ? '₩0' : '₩45.2M'}
                </p>
                <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                    {isOperationalMode ? '결제 시스템 연동 필요' : '+12.5% (전월 대비)'}
                </span>
            </div>

            {/* 승인 대기 광고 */}
            <div className="bg-accent p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-muted">승인 대기 광고</span>
                    <Clock className="text-yellow-500" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">
                    {isOperationalMode ? pendingAdsCount.toString() : '12'}
                </p>
                <span className="text-xs text-text-muted mt-2">
                    {isOperationalMode ? '광고 시스템 연동 필요' : '평균 처리 시간: 1.2시간'}
                </span>
            </div>

            {/* 신고 접수 */}
            <div className="bg-accent p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-muted">신고 접수</span>
                    <AlertTriangle className="text-red-500" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">
                    {isOperationalMode ? '0' : '3'}
                </p>
                <span className="text-xs text-red-500 mt-2">
                    {isOperationalMode ? '신고 시스템 연동 필요' : '미처리 건수'}
                </span>
            </div>
        </div>
    );
};

export default AdminStats;
