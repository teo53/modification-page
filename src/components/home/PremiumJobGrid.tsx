// =============================================================================
// 📁 src/components/home/PremiumJobGrid.tsx
// 🏷️  프리미엄채용정보 - queenalba 정확 카피
// 📐 카드 규격: 191×154 비율, 7열 그리드
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useDataMode } from '../../contexts/DataModeContext';
import { estimateGradeFromDays } from '../../utils/advertiserGrade';

// 광고 타입
interface PremiumAd {
    id: string;
    image: string;
    location: string;
    district: string;
    businessName: string;
    title: string;
    salary: string;
    salaryType: string;
    category: string;
    rotationCount: number;
    activeDays: number;
    borderColor: 'pink' | 'purple' | 'cyan' | 'none';
    isHit?: boolean;
}

// 샘플 데이터 (7열 x 4행 = 28개)
const premiumAdsData: PremiumAd[] = [
    { id: 'pj1', image: 'https://picsum.photos/seed/pj1/191/70', location: '경기', district: '강남 VIP용', businessName: '강남', title: '★★★ 정통 하이펍넬리...', salary: '120,000원', salaryType: '시급', category: '룸싸롱', rotationCount: 57, activeDays: 1710, borderColor: 'pink' },
    { id: 'pj2', image: 'https://picsum.photos/seed/pj2/191/70', location: '서울', district: '강남구', businessName: '라부부', title: '강남 역삼 선릉★ 공주...', salary: '180,000원', salaryType: '건당', category: '기타', rotationCount: 89, activeDays: 2820, borderColor: 'pink', isHit: true },
    { id: 'pj3', image: 'https://picsum.photos/seed/pj3/191/70', location: '서울', district: '강남구', businessName: '1층에이덕배슬문회당', title: '☆TC이벤트☆하이...', salary: '협의', salaryType: '협의', category: '시사룸', rotationCount: 46, activeDays: 1380, borderColor: 'cyan' },
    { id: 'pj4', image: 'https://picsum.photos/seed/pj4/191/70', location: '서울', district: '송파구', businessName: '원가라오게잠실WIN', title: '♥잠실 원가라오게11...', salary: '협의', salaryType: '협의', category: '룸싸롱', rotationCount: 25, activeDays: 750, borderColor: 'pink' },
    { id: 'pj5', image: 'https://picsum.photos/seed/pj5/191/70', location: '인천', district: '미추홀구', businessName: '골드문', title: '주안동 1등! 슬x터치x...', salary: '75,000원', salaryType: '시급', category: '노래주점', rotationCount: 4, activeDays: 270, borderColor: 'pink' },
    { id: 'pj6', image: 'https://picsum.photos/seed/pj6/191/70', location: '서울', district: '신림동', businessName: '★신림 하프대표★', title: '신림 만고 하이펍넬리...', salary: '120,000원', salaryType: '시급', category: '룸싸롱', rotationCount: 46, activeDays: 1590, borderColor: 'pink' },
    { id: 'pj7', image: 'https://picsum.photos/seed/pj7/191/70', location: '서울', district: '강남구', businessName: '강남1등달도하이펍', title: '[서울] 강남 1등 달도 선수', salary: '100,000원', salaryType: '시급', category: '기타', rotationCount: 10, activeDays: 300, borderColor: 'pink' },

    { id: 'pj8', image: 'https://picsum.photos/seed/pj8/191/70', location: '부산', district: '부산진구', businessName: '베를린', title: '[부산 부산진구] 베를린', salary: '150,000원', salaryType: '시급', category: '마사지', rotationCount: 4, activeDays: 120, borderColor: 'pink' },
    { id: 'pj9', image: 'https://picsum.photos/seed/pj9/191/70', location: '서울', district: '강남구', businessName: '도파민', title: '[서울 강남구] 도파민', salary: '협의', salaryType: '협의', category: '룸싸롱', rotationCount: 11, activeDays: 930, borderColor: 'pink' },
    { id: 'pj10', image: 'https://picsum.photos/seed/pj10/191/70', location: '서울', district: '강남구', businessName: '랭키페현준클래식', title: '[서울 강남구] 클래식탠카페 현준', salary: '협의', salaryType: '협의', category: '룸싸롱', rotationCount: 87, activeDays: 2610, borderColor: 'pink' },
    { id: 'pj11', image: 'https://picsum.photos/seed/pj11/191/70', location: '서울', district: '강남구', businessName: '클래식탠져클로이체이먼...', title: '클래식탠져클로이체이먼...', salary: '190,000원', salaryType: '시급', category: '룸싸롱', rotationCount: 32, activeDays: 960, borderColor: 'pink' },
    { id: 'pj12', image: 'https://picsum.photos/seed/pj12/191/70', location: '서울', district: '강남구', businessName: '강남 깽오킹스맨', title: '★깽오킹스맨KEI클럿...', salary: '협의', salaryType: '협의', category: '룸싸롱', rotationCount: 4, activeDays: 360, borderColor: 'cyan' },
    { id: 'pj13', image: 'https://picsum.photos/seed/pj13/191/70', location: '서울', district: '강남구', businessName: '합법AV제작사', title: '[1회당 최소 1천만원...]', salary: '협의', salaryType: '협의', category: '기타', rotationCount: 14, activeDays: 420, borderColor: 'pink' },
    { id: 'pj14', image: 'https://picsum.photos/seed/pj14/191/70', location: '경기', district: '시흥시', businessName: '임팩트문부장', title: '[강남전쟁팀팩트스페셜...]', salary: '160,000원', salaryType: '시급', category: '기타', rotationCount: 7, activeDays: 570, borderColor: 'pink' },

    { id: 'pj15', image: 'https://picsum.photos/seed/pj15/191/70', location: '서울', district: '강남구', businessName: '아벨스웨디시', title: '아벨 스웨디시 모집중', salary: '협의', salaryType: '협의', category: '마사지', rotationCount: 21, activeDays: 630, borderColor: 'pink' },
    { id: 'pj16', image: 'https://picsum.photos/seed/pj16/191/70', location: '서울', district: '강남구', businessName: '플라워', title: '♥엘 100만이상 ♥...', salary: '150,000원', salaryType: '시급', category: '기타', rotationCount: 7, activeDays: 570, borderColor: 'pink' },
    { id: 'pj17', image: 'https://picsum.photos/seed/pj17/191/70', location: '서울', district: '강남구', businessName: '◎VIP텐카페◎', title: '☆☆강남 텐카페☆☆', salary: '협의', salaryType: '협의', category: '룸싸롱', rotationCount: 33, activeDays: 990, borderColor: 'pink' },
    { id: 'pj18', image: 'https://picsum.photos/seed/pj18/191/70', location: '경기', district: '수원시', businessName: 'HOTPLACE', title: '60분 T.C 12만원...', salary: '150,000원', salaryType: '시급', category: '마사지', rotationCount: 39, activeDays: 1170, borderColor: 'pink', isHit: true },
    { id: 'pj19', image: 'https://picsum.photos/seed/pj19/191/70', location: '서울', district: '송파구', businessName: '원 가라오게', title: '11만 이벤트♥송파...', salary: '110,000원', salaryType: '시급', category: '노래주점', rotationCount: 15, activeDays: 1350, borderColor: 'pink' },
    { id: 'pj20', image: 'https://picsum.photos/seed/pj20/191/70', location: '충북', district: '청주시', businessName: '라벳테라피', title: '10-13만이상/청주...', salary: '110,000원', salaryType: '건당', category: '마사지', rotationCount: 1, activeDays: 90, borderColor: 'pink' },
    { id: 'pj21', image: 'https://picsum.photos/seed/pj21/191/70', location: '서울', district: '강남구', businessName: '메타엔터테인먼트', title: 'BJ/방송/게스트BJ...', salary: '협의', salaryType: '협의', category: '기타', rotationCount: 21, activeDays: 630, borderColor: 'cyan' },

    { id: 'pj22', image: 'https://picsum.photos/seed/pj22/191/70', location: '서울', district: '강서구', businessName: '골타 패펙트', title: '강서 마곡 패펙 셔...', salary: '150,000원', salaryType: '건당', category: '룸싸롱', rotationCount: 11, activeDays: 870, borderColor: 'pink' },
    { id: 'pj23', image: 'https://picsum.photos/seed/pj23/191/70', location: '서울', district: '강남구', businessName: '12월이벤트', title: '★★쏠티 이벤트★★', salary: '120,000원', salaryType: '시급', category: '룸싸롱', rotationCount: 26, activeDays: 1960, borderColor: 'pink' },
    { id: 'pj24', image: 'https://picsum.photos/seed/pj24/191/70', location: '경기', district: '고양시', businessName: '파스텔 스웨디시', title: '고양시 파스텔...', salary: '120,000원', salaryType: '시급', category: '마사지', rotationCount: 45, activeDays: 1380, borderColor: 'pink' },
    { id: 'pj25', image: 'https://picsum.photos/seed/pj25/191/70', location: '서울', district: '강남구', businessName: '♥헬로♥', title: '♥원든헤츌...', salary: '130,000원', salaryType: '건당', category: '룸싸롱', rotationCount: 24, activeDays: 1920, borderColor: 'pink' },
    { id: 'pj26', image: 'https://picsum.photos/seed/pj26/191/70', location: '서울', district: '강남구', businessName: '블랙핑크', title: '강남 최고 페이 초보...', salary: '190,000원', salaryType: '건당', category: '기타', rotationCount: 24, activeDays: 1020, borderColor: 'pink' },
    { id: 'pj27', image: 'https://picsum.photos/seed/pj27/191/70', location: '경기', district: '용인시', businessName: '원희테라피', title: '급구♥갯수보장♥깔끔', salary: '400,000원', salaryType: '건당', category: '마사지', rotationCount: 1, activeDays: 60, borderColor: 'pink' },
    { id: 'pj28', image: 'https://picsum.photos/seed/pj28/191/70', location: '서울', district: '강남구', businessName: '고페이 VIP 편집샵', title: '갯수 고페이 절대보장', salary: '500,000원', salaryType: '건당', category: '기타', rotationCount: 8, activeDays: 240, borderColor: 'pink', isHit: true },
];

// 위치 색상
const locationColors: Record<string, string> = {
    '서울': 'bg-pink-500',
    '경기': 'bg-green-500',
    '부산': 'bg-blue-500',
    '인천': 'bg-cyan-500',
    '충북': 'bg-yellow-600',
};

// 테두리 색상
const borderColorMap: Record<string, string> = {
    pink: 'border-pink-400',
    purple: 'border-purple-400',
    cyan: 'border-cyan-400',
    none: 'border-white/20',
};

// 191×154 세로형 카드 - queenalba 정확 카피
const VerticalCard: React.FC<{ ad: PremiumAd }> = ({ ad }) => {
    const locColor = locationColors[ad.location] || 'bg-gray-500';
    const borderColor = borderColorMap[ad.borderColor] || 'border-pink-400';
    // 광고주 등급 계산 (활동일 기반)
    const grade = estimateGradeFromDays(ad.activeDays);

    return (
        <Link
            to={`/ad/${ad.id}`}
            className="block group"
        >
            {/* 191×154 비율 카드 */}
            <div
                className={`
                    rounded-lg overflow-hidden
                    border-2 ${borderColor}
                    bg-accent hover:bg-accent/80
                    transition-all hover:scale-[1.02]
                `}
                style={{ aspectRatio: '191/154' }}
            >
                {/* 상단: 로고 이미지 (약 45% 높이) */}
                <div className="relative h-[45%] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <img
                        src={ad.image}
                        alt={ad.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />

                    {/* 위치 태그 - 좌측 상단 */}
                    <div className="absolute top-1 left-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${locColor} text-white`}>
                            {ad.location}
                        </span>
                    </div>

                    {/* 회/일 뱃지 + 등급 - 우측 하단 */}
                    <div className="absolute bottom-1 right-1">
                        <span className={`
                            inline-flex items-center
                            bg-gradient-to-r from-yellow-300 to-amber-400
                            text-amber-900 text-[9px] font-bold 
                            px-1.5 py-0.5 rounded
                            shadow
                        `} title={`${grade.nameKo} 등급`}>
                            {grade.icon} {ad.rotationCount}회 {ad.activeDays}일
                        </span>
                    </div>
                </div>

                {/* 하단: 정보 (약 55% 높이) */}
                <div className="h-[55%] p-2 flex flex-col justify-between">
                    {/* 업체명 */}
                    <div className="text-[11px] font-bold text-white truncate">
                        {ad.businessName}
                    </div>

                    {/* 제목 */}
                    <div className="text-[10px] text-text-muted truncate leading-tight">
                        {ad.title}
                    </div>

                    {/* 급여 */}
                    <div className="flex items-center gap-1 mt-auto">
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-pink-500/30 text-pink-300">
                            {ad.salaryType}
                        </span>
                        <span className="text-[11px] font-bold text-primary">
                            {ad.salary}
                        </span>
                    </div>

                    {/* 카테고리 */}
                    <div className="text-[9px] text-text-muted">
                        {ad.category}
                    </div>
                </div>
            </div>
        </Link>
    );
};

// 메인 컴포넌트
const PremiumJobGrid: React.FC = () => {
    const { useSampleData } = useDataMode();

    return (
        <section className="py-6 bg-background">
            <div className="container mx-auto px-4">
                {/* 헤더 - queenalba 스타일 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                        <h2 className="text-lg font-bold">
                            <span className="text-pink-400">프리미엄</span>
                            <span className="text-white">채용정보</span>
                        </h2>
                        <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded border border-white/10 transition-colors">
                            광고신청 +
                        </button>
                        {useSampleData && (
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                샘플
                            </span>
                        )}
                    </div>
                    <Link to="/search?productType=vip" className="text-xs text-text-muted hover:text-primary transition-colors">
                        더보기 +
                    </Link>
                </div>

                {/* 7열 그리드 - 191×154 비율 카드 */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                    {premiumAdsData.map((ad) => (
                        <VerticalCard key={ad.id} ad={ad} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumJobGrid;
