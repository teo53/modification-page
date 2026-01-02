import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface Region {
    id: string;
    name: string;
    count: number;
    position: { top: string; left: string };
}

const regions: Region[] = [
    { id: 'seoul', name: '서울', count: 420, position: { top: '35%', left: '35%' } },
    { id: 'incheon', name: '인천', count: 320, position: { top: '40%', left: '20%' } },
    { id: 'gyeonggi', name: '경기', count: 890, position: { top: '30%', left: '50%' } },
    { id: 'daejeon', name: '대전', count: 180, position: { top: '55%', left: '40%' } },
    { id: 'gwangju', name: '광주', count: 150, position: { top: '70%', left: '25%' } },
    { id: 'daegu', name: '대구', count: 210, position: { top: '55%', left: '65%' } },
    { id: 'busan', name: '부산', count: 450, position: { top: '75%', left: '75%' } },
];

const RegionMap: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <MapPin className="text-primary" size={20} />
                지역별 업소 찾기
            </h3>

            {/* Map Container */}
            <div className="relative bg-surface rounded-lg p-8 aspect-square">
                {/* Korea Map Background - using dark styled map */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg viewBox="0 0 200 250" className="w-full h-full">
                        {/* Simplified Korea map shape */}
                        <path
                            d="M100,20 L120,30 L130,50 L140,80 L145,110 L150,140 L145,170 L135,200 L120,220 L100,230 L80,220 L65,200 L55,170 L50,140 L55,110 L60,80 L70,50 L80,30 Z"
                            fill="currentColor"
                            className="text-primary/20"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                </div>

                {/* Region Markers */}
                {regions.map((region) => {
                    const isSelected = selectedRegion === region.id;
                    return (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region.id === selectedRegion ? null : region.id)}
                            className={`
                                absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                                ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}
                            `}
                            style={{
                                top: region.position.top,
                                left: region.position.left,
                            }}
                        >
                            <div className="relative group">
                                {/* Marker Dot */}
                                <div className={`
                                    w-3 h-3 rounded-full 
                                    ${isSelected ? 'bg-primary animate-pulse' : 'bg-yellow-400'}
                                    shadow-lg shadow-yellow-400/50
                                `} />

                                {/* Label */}
                                <div className={`
                                    absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap
                                    px-3 py-1.5 rounded-lg text-xs font-bold
                                    ${isSelected
                                        ? 'bg-primary text-white scale-110'
                                        : 'bg-white text-text-main shadow-md border border-border group-hover:bg-primary/10 group-hover:text-primary'
                                    }
                                    transition-all duration-300
                                `}>
                                    <div className="text-center">
                                        <div>{region.name}</div>
                                        <div className="text-[10px] text-primary">{region.count}개</div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Region List */}
            <div className="mt-4 space-y-2">
                {regions.map((region) => {
                    const isSelected = selectedRegion === region.id;
                    return (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region.id === selectedRegion ? null : region.id)}
                            className={`
                                w-full flex items-center justify-between px-4 py-2 rounded-lg
                                transition-all duration-300
                                ${isSelected
                                    ? 'bg-primary text-white font-bold'
                                    : 'bg-surface text-text-main hover:bg-border'
                                }
                            `}
                        >
                            <span>{region.name}</span>
                            <span className={isSelected ? 'text-white' : 'text-primary'}>
                                {region.count}개
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RegionMap;
