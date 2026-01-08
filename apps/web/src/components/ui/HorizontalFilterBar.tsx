import React, { useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Users, Star, Sparkles } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface HorizontalFilterBarProps {
    onFilterChange?: (filters: {
        region: string;
        industry: string;
        salary: string;
        type: string;
    }) => void;
}

// FilterGroup component moved outside to avoid "Cannot create components during render" error
interface FilterGroupProps {
    title: string;
    category: string;
    options: FilterOption[];
    selected: string;
    onFilterChange: (category: string, value: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
    title,
    category,
    options,
    selected,
    onFilterChange
}) => (
    <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-primary whitespace-nowrap w-12">{title}</span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {options.map((option) => {
                const Icon = option.icon;
                const isSelected = selected === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange(category, option.id)}
                        className={`
                            px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200
                            flex items-center gap-1.5 font-medium border
                            ${isSelected
                                ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                : 'bg-accent/50 text-text-muted border-white/5 hover:border-white/20 hover:text-white hover:bg-white/5'
                            }
                        `}
                    >
                        {Icon && <Icon size={14} className={isSelected ? 'text-black' : 'text-text-muted group-hover:text-white'} />}
                        {option.label}
                    </button>
                );
            })}
        </div>
    </div>
);

const HorizontalFilterBar: React.FC<HorizontalFilterBarProps> = ({ onFilterChange }) => {
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedSalary, setSelectedSalary] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    const handleFilterChange = (category: string, value: string) => {
        const newFilters = {
            region: selectedRegion,
            industry: selectedIndustry,
            salary: selectedSalary,
            type: selectedType
        };

        switch (category) {
            case 'region':
                setSelectedRegion(value);
                newFilters.region = value;
                break;
            case 'industry':
                setSelectedIndustry(value);
                newFilters.industry = value;
                break;
            case 'salary':
                setSelectedSalary(value);
                newFilters.salary = value;
                break;
            case 'type':
                setSelectedType(value);
                newFilters.type = value;
                break;
        }

        onFilterChange?.(newFilters);
    };

    const regions: FilterOption[] = [
        { id: 'all', label: '전체지역', icon: MapPin },
        { id: 'seoul', label: '서울' },
        { id: 'gyeonggi', label: '경기' },
        { id: 'incheon', label: '인천' },
        { id: 'busan', label: '부산' },
        { id: 'daegu', label: '대구' },
        { id: 'gwangju', label: '광주' },
        { id: 'daejeon', label: '대전' },
    ];

    const industries: FilterOption[] = [
        { id: 'all', label: '전체업종', icon: Briefcase },
        { id: 'room-salon', label: '룸살롱' },
        { id: 'club', label: '클럽' },
        { id: 'bar', label: '바(Bar)' },
        { id: 'karaoke', label: '노래방' },
        { id: 'ten-cafe', label: '텐카페' },
        { id: 'massage', label: '마사지' },
        { id: 'other', label: '기타' },
    ];

    const salaryRanges: FilterOption[] = [
        { id: 'all', label: '급여전체', icon: DollarSign },
        { id: '50000', label: '시급 5만원↑' },
        { id: '80000', label: '시급 8만원↑' },
        { id: '100000', label: '시급 10만원↑' },
        { id: '150000', label: '시급 15만원↑' },
    ];

    const types: FilterOption[] = [
        { id: 'all', label: '전체', icon: Star },
        { id: 'urgent', label: '급구', icon: Clock },
        { id: 'beginner', label: '초보환영', icon: Users },
        { id: 'high-pay', label: '고수입', icon: Sparkles },
        { id: 'same-day', label: '당일지급' },
    ];

    return (
        <div className="bg-black/95 border-y border-white/10 py-6 mb-8 sticky top-0 z-20 backdrop-blur-md shadow-xl">
            <div className="container mx-auto px-4">
                <div className="space-y-4">
                    <FilterGroup
                        title="지역"
                        category="region"
                        options={regions}
                        selected={selectedRegion}
                        onFilterChange={handleFilterChange}
                    />
                    <FilterGroup
                        title="업종"
                        category="industry"
                        options={industries}
                        selected={selectedIndustry}
                        onFilterChange={handleFilterChange}
                    />
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        <div className="flex-1">
                            <FilterGroup
                                title="급여"
                                category="salary"
                                options={salaryRanges}
                                selected={selectedSalary}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden lg:block mx-4"></div>
                        <div className="flex-1">
                            <FilterGroup
                                title="조건"
                                category="type"
                                options={types}
                                selected={selectedType}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HorizontalFilterBar;
