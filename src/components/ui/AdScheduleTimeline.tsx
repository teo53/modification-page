import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface ScheduleItem {
    productId: string;
    productName: string;
    round: number;
    totalRounds: number;
    startDate: Date;
    endDate: Date;
    durationDays: number;
    color: string;
}

interface AdScheduleTimelineProps {
    schedule: ScheduleItem[];
    startDate: Date;
}

const AdScheduleTimeline: React.FC<AdScheduleTimelineProps> = ({ schedule }) => {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '-').replace('.', '');
    };

    // Group by product
    const groupedSchedule = schedule.reduce((acc, item) => {
        if (!acc[item.productId]) {
            acc[item.productId] = [];
        }
        acc[item.productId].push(item);
        return acc;
    }, {} as Record<string, ScheduleItem[]>);

    if (schedule.length === 0) {
        return (
            <div className="bg-accent/30 border border-white/10 rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto mb-2 text-text-muted" size={32} />
                <p className="text-text-muted text-sm">
                    광고 상품을 선택하면 일정이 표시됩니다
                </p>
            </div>
        );
    }

    return (
        <div className="bg-accent/50 border border-white/10 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-primary" size={20} />
                <h3 className="font-bold text-white">광고 노출 일정</h3>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedSchedule).map(([productId, items]) => (
                    <div key={productId} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${items[0].color}`} />
                            <h4 className="font-bold text-white">
                                {items[0].productName}
                                {items.length > 1 && (
                                    <span className="text-sm text-text-muted ml-2">
                                        (총 {items.length}회)
                                    </span>
                                )}
                            </h4>
                        </div>

                        <div className="pl-5 space-y-2">
                            {items.map((item) => (
                                <div
                                    key={`${item.productId}-${item.round}`}
                                    className="bg-background/50 rounded-lg p-3 border border-white/5"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-white">
                                            {item.round}회차
                                        </span>
                                        <span className="text-xs text-text-muted">
                                            {item.durationDays}일간
                                        </span>
                                    </div>
                                    <div className="text-sm text-text-muted">
                                        {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-white/10">
                <div className="flex items-start gap-2 text-xs text-text-muted">
                    <AlertCircle className="shrink-0 mt-0.5" size={14} />
                    <p>
                        • 동일 상품을 여러 개 구매하신 경우, 순차적으로 연속 노출됩니다<br />
                        • 실제 노출 시작일은 관리자 승인 후 결정됩니다
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdScheduleTimeline;
