// Admin CRM 컴포넌트 - 재사용 가능한 통계 카드

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    iconColor = 'text-blue-500',
    trend
}) => {
    return (
        <div className="bg-accent p-6 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
                <span className="text-text-muted">{title}</span>
                <Icon className={iconColor} size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend && (
                <span className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 mt-2`}>
                    {trend.value}
                </span>
            )}
        </div>
    );
};

interface SecurityStatusCardProps {
    label: string;
    value: string;
    status: 'active' | 'warning' | 'inactive';
}

export const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({
    label,
    value,
    status
}) => {
    const statusColors = {
        active: 'bg-green-500',
        warning: 'bg-yellow-500',
        inactive: 'bg-red-500'
    };

    const valueColors = {
        active: 'text-green-400',
        warning: 'text-yellow-400',
        inactive: 'text-red-400'
    };

    return (
        <div className="bg-black/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`} />
                <span className="text-xs text-text-muted">{label}</span>
            </div>
            <p className={`text-sm font-bold ${valueColors[status]}`}>{value}</p>
        </div>
    );
};
