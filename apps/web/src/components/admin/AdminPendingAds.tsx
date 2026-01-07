// =============================================================================
// 📁 src/components/admin/AdminPendingAds.tsx
// 🏷️  관리자 대시보드 승인 대기 광고 목록 컴포넌트
// =============================================================================

import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface PendingAd {
    id: string;
    title: string;
    businessName: string;
    productType: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'premium' | 'special' | 'regular';
    createdAt: string;
}

interface AdminPendingAdsProps {
    ads: PendingAd[];
    isOperationalMode: boolean;
    onApprove: (adId: string) => void;
    onReject: (adId: string) => void;
}

const getProductLabel = (type: string): string => {
    const labels: Record<string, string> = {
        diamond: 'Diamond',
        sapphire: 'Sapphire',
        ruby: 'Ruby',
        gold: 'Gold',
        premium: 'Premium',
        special: 'Special',
        regular: 'Regular'
    };
    return labels[type] || 'Regular';
};

const getTimeAgo = (createdAt: string): string => {
    const timeAgo = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return timeAgo < 60 ? `${timeAgo}분 전` : `${Math.floor(timeAgo / 60)}시간 전`;
};

const AdminPendingAds: React.FC<AdminPendingAdsProps> = ({
    ads,
    onApprove,
    onReject
}) => {
    return (
        <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">승인 대기 목록</h3>
                <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                    {ads.length}건
                </span>
            </div>

            {ads.length === 0 ? (
                <div className="p-8 text-center">
                    <Clock size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                    <p className="text-text-muted text-sm">대기 중인 승인 요청이 없습니다</p>
                    <p className="text-xs text-text-muted/50 mt-1">광고 등록 시 여기에 표시됩니다</p>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-white/5">
                        {ads.slice(0, 5).map((ad) => (
                            <div key={ad.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-white">{ad.title}</span>
                                    <span className="text-xs text-text-muted">{getTimeAgo(ad.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${['diamond', 'sapphire', 'ruby', 'gold'].includes(ad.productType)
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-secondary/20 text-secondary'
                                        }`}>
                                        {getProductLabel(ad.productType)}
                                    </span>
                                    <span className="text-xs text-text-muted">{ad.businessName}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onApprove(ad.id)}
                                        className="flex-1 bg-green-500/20 text-green-500 text-xs py-1.5 rounded hover:bg-green-500/30 flex items-center justify-center gap-1"
                                    >
                                        <CheckCircle size={12} /> 승인
                                    </button>
                                    <button
                                        onClick={() => onReject(ad.id)}
                                        className="flex-1 bg-red-500/20 text-red-500 text-xs py-1.5 rounded hover:bg-red-500/30 flex items-center justify-center gap-1"
                                    >
                                        <XCircle size={12} /> 반려
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {ads.length > 5 && (
                        <div className="p-3 text-center border-t border-white/5">
                            <button className="text-xs text-text-muted hover:text-white">
                                +{ads.length - 5}건 더보기
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPendingAds;
