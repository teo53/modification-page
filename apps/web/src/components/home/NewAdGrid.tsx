// =============================================================================
// 📁 src/components/home/NewAdGrid.tsx
// 🏷️  최신 등록 광고 - 6열 그리드, NEW 뱃지 스타일
// 📐 레퍼런스 이미지 3 기반
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, DollarSign } from 'lucide-react';
import { useDataMode } from '../../contexts/DataModeContext';

// 광고 타입
interface NewAd {
    id: string;
    image: string;
    location: string;
    district: string;
    businessName: string;
    salary: string;
    salaryType: string;
    isNew?: boolean;
    isRecruiting?: boolean;
}

// 샘플 데이터 (6열 x 2행 = 12개)
const newAdsData: NewAd[] = [
    { id: 'n1', image: 'https://picsum.photos/seed/n1/200/150', location: '서울', district: '송파구', businessName: '[샘플] 샘플업소 A', salary: '일 10~15만원', salaryType: '일급', isNew: true, isRecruiting: true },
    { id: 'n2', image: 'https://picsum.photos/seed/n2/200/150', location: '경기', district: '고양시', businessName: '[샘플] 샘플업소 B', salary: '시급 15,000원', salaryType: '시급', isNew: true, isRecruiting: true },
    { id: 'n3', image: 'https://picsum.photos/seed/n3/200/150', location: '대전', district: '유성구', businessName: '[샘플] 샘플업소 C', salary: '협의', salaryType: '협의', isNew: false, isRecruiting: true },
    { id: 'n4', image: 'https://picsum.photos/seed/n4/200/150', location: '경기', district: '서구', businessName: '[샘플] 샘플업소 D', salary: '일 10~15만원', salaryType: '일급', isNew: false, isRecruiting: true },
    { id: 'n5', image: 'https://picsum.photos/seed/n5/200/150', location: '서울', district: '송파구', businessName: '[샘플] 샘플클럽 E', salary: '시급 15,000원', salaryType: '시급', isNew: true, isRecruiting: true },
    { id: 'n6', image: 'https://picsum.photos/seed/n6/200/150', location: '경기', district: '고양시', businessName: '[샘플] 샘플라운지 F', salary: '협의', salaryType: '협의', isNew: false, isRecruiting: true },

    { id: 'n7', image: 'https://picsum.photos/seed/n7/200/150', location: '대전', district: '유성구', businessName: '[샘플] 샘플바 G', salary: '일 10~15만원', salaryType: '일급', isNew: false, isRecruiting: true },
    { id: 'n8', image: 'https://picsum.photos/seed/n8/200/150', location: '경기', district: '서구', businessName: '[샘플] 샘플숍 H', salary: '시급 15,000원', salaryType: '시급', isNew: false, isRecruiting: true },
    { id: 'n9', image: 'https://picsum.photos/seed/n9/200/150', location: '서울', district: '송파구', businessName: '[샘플] 샘플업소 A', salary: '협의', salaryType: '협의', isNew: false, isRecruiting: true },
    { id: 'n10', image: 'https://picsum.photos/seed/n10/200/150', location: '경기', district: '고양시', businessName: '[샘플] 샘플업소 B', salary: '일 10~15만원', salaryType: '일급', isNew: false, isRecruiting: true },
    { id: 'n11', image: 'https://picsum.photos/seed/n11/200/150', location: '대전', district: '유성구', businessName: '[샘플] 샘플업소 C', salary: '시급 15,000원', salaryType: '시급', isNew: false, isRecruiting: true },
    { id: 'n12', image: 'https://picsum.photos/seed/n12/200/150', location: '경기', district: '서구', businessName: '[샘플] 샘플업소 D', salary: '협의', salaryType: '협의', isNew: false, isRecruiting: true },
];

// 카드 컴포넌트 - 이미지 3 스타일
const NewAdCard: React.FC<{ ad: NewAd }> = ({ ad }) => {
    return (
        <Link
            to={`/ad/${ad.id}`}
            className="block group"
        >
            <div className="bg-accent rounded-lg overflow-hidden hover:bg-accent/70 transition-all">
                {/* 이미지 영역 */}
                <div className="relative aspect-[4/3] bg-background overflow-hidden">
                    <img
                        src={ad.image}
                        alt={ad.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />

                    {/* 상단 뱃지 영역 */}
                    <div className="absolute top-2 left-2 flex gap-1">
                        {ad.isNew && (
                            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                                NEW
                            </span>
                        )}
                        {ad.isRecruiting && (
                            <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded">
                                채용중
                            </span>
                        )}
                    </div>

                    {/* 찜 버튼 */}
                    <button
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-primary/80 transition-colors"
                        onClick={(e) => { e.preventDefault(); }}
                    >
                        <Heart size={14} className="text-white" />
                    </button>
                </div>

                {/* 정보 영역 */}
                <div className="p-3">
                    {/* 업체명 */}
                    <div className="text-sm font-bold text-white mb-1 truncate">
                        {ad.businessName}
                    </div>

                    {/* 위치 */}
                    <div className="flex items-center gap-1 text-text-muted text-xs mb-2">
                        <MapPin size={11} />
                        <span>{ad.location} · {ad.district}</span>
                    </div>

                    {/* 급여 */}
                    <div className="flex items-center gap-1 text-primary">
                        <DollarSign size={13} className="text-primary" />
                        <span className="text-sm font-bold">{ad.salary}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// 메인 컴포넌트
const NewAdGrid: React.FC = () => {
    const { useSampleData } = useDataMode();

    return (
        <section className="py-6 bg-background">
            <div className="container mx-auto px-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-primary">최신 등록 광고</h2>
                        {useSampleData && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                샘플
                            </span>
                        )}
                    </div>
                    <Link to="/search" className="text-xs text-text-muted hover:text-primary transition-colors">
                        더보기 +
                    </Link>
                </div>

                {/* 6열 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {newAdsData.map((ad) => (
                        <NewAdCard key={ad.id} ad={ad} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewAdGrid;
