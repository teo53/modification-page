import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    icon?: LucideIcon;
    title: string;
    subtitle?: string;
    badge?: string;
    badgeColor?: 'primary' | 'hot' | 'vip' | 'special';
    variant?: 'default' | 'premium' | 'highlighted' | 'minimal';
    showMore?: boolean;
    moreLink?: string;
    moreText?: string;
    pagination?: { current: number; total: number };
    className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    icon: Icon,
    title,
    subtitle,
    badge,
    badgeColor = 'primary',
    variant = 'default',
    showMore = false,
    moreLink,
    moreText = '더보기',
    pagination,
    className = '',
}) => {
    const badgeStyles = {
        primary: 'bg-primary text-white',
        hot: 'bg-red-500 text-white',
        vip: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
        special: 'bg-purple-500 text-white',
    };

    const variantStyles = {
        default: '',
        premium: 'bg-gradient-to-r from-primary/5 via-transparent to-primary/5 border-l-4 border-primary pl-4 -ml-4',
        highlighted: 'bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 border-l-4 border-amber-500 pl-4 -ml-4',
        minimal: '',
    };

    return (
        <div className={`px-4 mb-4 ${variantStyles[variant]} ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className={`p-1.5 rounded-lg ${
                            variant === 'premium' ? 'bg-primary/20' :
                            variant === 'highlighted' ? 'bg-amber-500/20' :
                            'bg-accent'
                        }`}>
                            <Icon size={18} className={`${
                                variant === 'premium' ? 'text-primary' :
                                variant === 'highlighted' ? 'text-amber-500' :
                                'text-primary'
                            }`} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                            {title}
                            {badge && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeStyles[badgeColor]}`}>
                                    {badge}
                                </span>
                            )}
                        </h2>
                        {subtitle && (
                            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {pagination && (
                        <span className="text-xs text-text-muted bg-accent px-2 py-1 rounded">
                            {pagination.current} / {pagination.total}
                        </span>
                    )}
                    {showMore && moreLink && (
                        <Link
                            to={moreLink}
                            className="flex items-center text-sm text-text-muted hover:text-primary transition-colors"
                        >
                            {moreText}
                            <ChevronRight size={16} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectionHeader;
