import React from 'react';

interface ToggleChipProps {
    label: string;
    selected: boolean;
    onClick: () => void;
    className?: string;
}

const ToggleChip: React.FC<ToggleChipProps> = ({ label, selected, onClick, className = '' }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium
                ${selected
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,215,0,0.3)] ring-1 ring-primary/50'
                    : 'border-white/10 bg-background text-text-muted hover:border-white/30 hover:text-white'
                }
                ${className}
            `}
        >
            {label}
        </button>
    );
};

export default ToggleChip;
