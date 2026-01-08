// =============================================================================
// DataSourceBadge Component - Shows data source indicator (Advertiser/Scraper)
// =============================================================================

import React from 'react';
import { Building2, Globe } from 'lucide-react';

type DataSource = 'ADVERTISER' | 'SCRAPER';

interface DataSourceBadgeProps {
    source?: DataSource;
    showLabel?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
    source,
    showLabel = true,
    size = 'sm',
    className = '',
}) => {
    if (!source) return null;

    const isAdvertiser = source === 'ADVERTISER';

    const sizeClasses = {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-1',
    };

    const iconSize = size === 'sm' ? 10 : 12;

    return (
        <span
            className={`
                inline-flex items-center gap-1 rounded font-medium
                ${sizeClasses[size]}
                ${isAdvertiser
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }
                ${className}
            `}
            title={isAdvertiser
                ? '광고주가 직접 등록한 공고입니다'
                : '외부 사이트에서 수집된 공고입니다'
            }
            aria-label={isAdvertiser ? '광고주 직접 등록' : '외부 수집 데이터'}
        >
            {isAdvertiser ? (
                <Building2 size={iconSize} aria-hidden="true" />
            ) : (
                <Globe size={iconSize} aria-hidden="true" />
            )}
            {showLabel && (
                <span>{isAdvertiser ? '직접등록' : '수집'}</span>
            )}
        </span>
    );
};

export default DataSourceBadge;
