import React from 'react';
import ToggleChip from './ToggleChip';

interface Option {
    label: string;
    value: string | number;
}

interface SelectionGroupProps {
    options: Option[];
    value: string | number | (string | number)[];
    onChange: (value: any) => void;
    multiSelect?: boolean;
    className?: string;
    gridCols?: number;
}

const GRID_COLS_MAP: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    8: 'grid-cols-8',
    10: 'grid-cols-10',
    12: 'grid-cols-12',
};

const SelectionGroup: React.FC<SelectionGroupProps> = ({
    options,
    value,
    onChange,
    multiSelect = false,
    className = '',
    gridCols
}) => {
    const handleSelect = (optionValue: string | number) => {
        if (multiSelect) {
            const currentValues = Array.isArray(value) ? value : [];
            const isSelected = currentValues.includes(optionValue);

            if (isSelected) {
                onChange(currentValues.filter(v => v !== optionValue));
            } else {
                onChange([...currentValues, optionValue]);
            }
        } else {
            onChange(optionValue);
        }
    };

    const isSelected = (optionValue: string | number) => {
        if (multiSelect) {
            return Array.isArray(value) && value.includes(optionValue);
        }
        return value === optionValue;
    };

    const gridClass = gridCols ? `grid ${GRID_COLS_MAP[gridCols] || 'grid-cols-1'}` : '';

    return (
        <div className={`flex flex-wrap gap-2 ${gridClass} ${className}`}>
            {options.map((option) => (
                <ToggleChip
                    key={option.value}
                    label={option.label}
                    selected={isSelected(option.value)}
                    onClick={() => handleSelect(option.value)}
                    className={gridCols ? 'w-full justify-center' : ''}
                />
            ))}
        </div>
    );
};

export default SelectionGroup;
