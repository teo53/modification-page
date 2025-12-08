import React, { useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Users, Star } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const HorizontalFilterBar: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedSalary, setSelectedSalary] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

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
        { id: 'high-pay', label: '고수입' },
        { id: 'same-day', label: '당일지급' },
    ];

    const FilterGroup = ({
        title,
        options,
        selected,
        onChange
    }: {
        title: string;
        options: FilterOption[];
        selected: string;
        onChange: (value: string) => void;
    }) => (
        <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted whitespace-nowrap">{title}:</span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selected === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => onChange(option.id)}
                            className={`
                                px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all
                                ${isSelected
                                    ? 'bg-primary text-black font-bold'
                                    : 'bg-accent border border-white/10 text-white hover:border-primary'
                                }
                                flex items-center gap-1.5
                            `}
                        >
                            {Icon && <Icon size={14} />}
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="bg-accent/50 border-y border-white/5 py-4 mb-6 sticky top-0 z-10 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="space-y-3">
                    <FilterGroup
                        title="지역"
                        options={regions}
                        selected={selectedRegion}
                        onChange={setSelectedRegion}
                    />
                    <FilterGroup
                        title="업종"
                        options={industries}
                        selected={selectedIndustry}
                        onChange={setSelectedIndustry}
                    />
                    <div className="flex flex-wrap gap-3">
                        <FilterGroup
                            title="급여"
                            options={salaryRanges}
                            selected={selectedSalary}
                            onChange={setSelectedSalary}
                        />
                        <FilterGroup
                            title="조건"
                            options={types}
                            selected={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HorizontalFilterBar;
