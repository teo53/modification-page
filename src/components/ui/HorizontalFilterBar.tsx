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

const HorizontalFilterBar: React.FC<HorizontalFilterBarProps> = ({ onFilterChange }) => {
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedSalary, setSelectedSalary] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    const handleFilterChange = (category: string, value: string) => {
        let newFilters = {
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

    const FilterGroup = ({
        title,
        category,
        options,
        selected
    }: {
        title: string;
        category: string;
        options: FilterOption[];
        selected: string;
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
                            onClick={() => handleFilterChange(category, option.id)}
                            className={`
                                px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200
                                flex items-center gap-1.5 font-medium border
                                ${isSelected
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-card text-text-muted border-border hover:border-primary/30 hover:text-text-main hover:bg-surface'
                                }
                            `}
                        >
                            {Icon && <Icon size={14} className={isSelected ? 'text-white' : 'text-text-muted group-hover:text-text-main'} />}
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="bg-card border-y border-border py-6 mb-8 sticky top-0 z-20 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="space-y-4">
                    <FilterGroup
                        title="지역"
                        category="region"
                        options={regions}
                        selected={selectedRegion}
                    />
                    <FilterGroup
                        title="업종"
                        category="industry"
                        options={industries}
                        selected={selectedIndustry}
                    />
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        <div className="flex-1">
                            <FilterGroup
                                title="급여"
                                category="salary"
                                options={salaryRanges}
                                selected={selectedSalary}
                            />
                        </div>
                        <div className="w-px h-8 bg-border hidden lg:block mx-4"></div>
                        <div className="flex-1">
                            <FilterGroup
                                title="조건"
                                category="type"
                                options={types}
                                selected={selectedType}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HorizontalFilterBar;
