// =============================================================================
// 📁 src/components/home/CompactAdGrid.tsx
// 🏷️  우대채용정보 - 반응형 6열 그리드 (다른 섹션과 동일한 폭)
// 📐 비율 유지: 191:154 약 1.24:1 → aspect-[191/154] 사용
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useDataMode } from '../../contexts/DataModeContext';
import { estimateGradeFromDays } from '../../utils/advertiserGrade';

// 광고 타입
interface CompactAd {
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
    views: number;
    borderColor: 'pink' | 'yellow' | 'green' | 'blue' | 'purple';
    isHot?: boolean;
    isNew?: boolean;
}

// 샘플 데이터 (6열 x 4행 = 24개)
const compactAdsData: CompactAd[] = [
    { id: 'c1', image: 'https://picsum.photos/seed/c1/200/100', location: '서울', district: '강남구', businessName: '시엘 엔터테인먼트', title: '여성방송인 신입, 미경력 환영합니다', salary: '협의', salaryType: '협의', category: '기타', rotationCount: 9, activeDays: 780, views: 1542, borderColor: 'pink' },
    { id: 'c2', image: 'https://picsum.photos/seed/c2/200/100', location: '서울', district: '강남구', businessName: '☆요', title: '파랙픽 쇼핑 오픈텔링 고소득 모집', salary: '600,000원', salaryType: '건당', category: '룸싸롱', rotationCount: 22, activeDays: 1260, views: 3241, borderColor: 'pink', isNew: true },
    { id: 'c3', image: 'https://picsum.photos/seed/c3/200/100', location: '서울', district: '강서구', businessName: '♥민재실장♥', title: '강서구 마곡 골타 패펙트 셔츠룸', salary: '500,000원', salaryType: '건당', category: '룸싸롱', rotationCount: 4, activeDays: 360, views: 892, borderColor: 'pink' },
    { id: 'c4', image: 'https://picsum.photos/seed/c4/200/100', location: '경기', district: '이천시', businessName: '토끼', title: '싸이☆ 많이 안밀어요! 약속 잘 지켜요', salary: '500,000원', salaryType: '건당', category: '기타', rotationCount: 17, activeDays: 1290, views: 2156, borderColor: 'green' },
    { id: 'c5', image: 'https://picsum.photos/seed/c5/200/100', location: '서울', district: '강남구', businessName: '강남호빠 쁠러팅', title: '강남호빠쁠러팅 사랑사장 무관심 대환영', salary: '협의', salaryType: '협의', category: '룸싸롱', rotationCount: 19, activeDays: 670, views: 4521, borderColor: 'blue', isHot: true },
    { id: 'c6', image: 'https://picsum.photos/seed/c6/200/100', location: '서울', district: '강남구', businessName: '♥당일른대부', title: '★고페이♥주보장★ 당일 지급 가능', salary: '110,000원', salaryType: '시급', category: '기타', rotationCount: 18, activeDays: 1020, views: 1893, borderColor: 'purple' },

    { id: 'c7', image: 'https://picsum.photos/seed/c7/200/100', location: '서울', district: '영등포', businessName: 'VIP', title: '♡최고페이♡2030인연격 고소득 보장', salary: '협의', salaryType: '협의', category: '노래주점', rotationCount: 1, activeDays: 30, views: 567, borderColor: 'pink' },
    { id: 'c8', image: 'https://picsum.photos/seed/c8/200/100', location: '서울', district: '송파구', businessName: '쏠리', title: '솔속연휴♦on 언제든 24시간 상담가능', salary: '120,000원', salaryType: '시급', category: '업소', rotationCount: 2, activeDays: 180, views: 743, borderColor: 'yellow' },
    { id: 'c9', image: 'https://picsum.photos/seed/c9/200/100', location: '서울', district: '종로구', businessName: '유앤미쏠리', title: '유앤미 하이파블릭 D팀 슬밀리언', salary: '협의', salaryType: '협의', category: '마사지', rotationCount: 8, activeDays: 660, views: 1234, borderColor: 'pink' },
    { id: 'c10', image: 'https://picsum.photos/seed/c10/200/100', location: '서울', district: '노원구', businessName: '슈파맨', title: '♥필주청수춤●시간대기 아이디시', salary: '60,000원', salaryType: '시급', category: '노래주점', rotationCount: 2, activeDays: 180, views: 456, borderColor: 'green' },
    { id: 'c11', image: 'https://picsum.photos/seed/c11/200/100', location: '경기', district: '시흥시', businessName: '중심 스웨디시', title: '♥고페이보장당일지급♥ 충티 가능', salary: '170,000원', salaryType: '건당', category: '마사지', rotationCount: 16, activeDays: 1320, views: 2987, borderColor: 'blue' },
    { id: 'c12', image: 'https://picsum.photos/seed/c12/200/100', location: '서울', district: '송파구', businessName: '원 가라오게', title: '11만 이벤트♥송파♥ 시간단축 50만', salary: '110,000원', salaryType: '시급', category: '노래주점', rotationCount: 15, activeDays: 1350, views: 3654, borderColor: 'purple', isHot: true },

    { id: 'c13', image: 'https://picsum.photos/seed/c13/200/100', location: '서울', district: '강서구', businessName: '강서 에플 셔츠룸', title: '강서 쁠럭스 셔츠룸 서베이 모집중', salary: '130,000원', salaryType: '건당', category: '룸싸롱', rotationCount: 1, activeDays: 30, views: 234, borderColor: 'pink' },
    { id: 'c14', image: 'https://picsum.photos/seed/c14/200/100', location: '서울', district: '송파구', businessName: '러브', title: '24시오픈! 곤더폰 천셔츠맵 초보환영', salary: '500,000원', salaryType: '건당', category: '룸싸롱', rotationCount: 9, activeDays: 1060, views: 1876, borderColor: 'pink' },
    { id: 'c15', image: 'https://picsum.photos/seed/c15/200/100', location: '부천', district: '원미구', businessName: '♡비비♡', title: '★스린에브모 1등을 훌싸삼아중입니다', salary: '12,000,000원', salaryType: '월급', category: '룸싸롱', rotationCount: 23, activeDays: 1020, views: 5432, borderColor: 'green' },
    { id: 'c16', image: 'https://picsum.photos/seed/c16/200/100', location: '서울', district: '강남구', businessName: '블랙핑크○', title: '○ 강남 최고 페이○ 초보 환영○ 슬N', salary: '190,000원', salaryType: '건당', category: '기타', rotationCount: 24, activeDays: 1020, views: 2341, borderColor: 'purple' },
    { id: 'c17', image: 'https://picsum.photos/seed/c17/200/100', location: '서울', district: '강남구', businessName: '플라워', title: '♥엘 100만이상 ♥강남최고페이 보장', salary: '160,000원', salaryType: '시급', category: '기타', rotationCount: 7, activeDays: 670, views: 1567, borderColor: 'pink' },
    { id: 'c18', image: 'https://picsum.photos/seed/c18/200/100', location: '서울', district: '강남구', businessName: '12월이벤트', title: '★★쏠티 이벤트★★ 특별 혜택 제공', salary: '120,000원', salaryType: '시급', category: '룸싸롱', rotationCount: 26, activeDays: 1960, views: 4123, borderColor: 'pink' },

    { id: 'c19', image: 'https://picsum.photos/seed/c19/200/100', location: '경기', district: '고양시', businessName: '파스텔 스웨디시', title: '고양시 파스텔 스웨디시 고수익 보장', salary: '120,000원', salaryType: '시급', category: '마사지', rotationCount: 45, activeDays: 1380, views: 3876, borderColor: 'yellow' },
    { id: 'c20', image: 'https://picsum.photos/seed/c20/200/100', location: '경기', district: '성남시', businessName: '분당광교부장', title: '그럴일 없을 1시간 TC29천삼만 보장', salary: '200,000원', salaryType: '시급', category: '룸싸롱', rotationCount: 7, activeDays: 210, views: 987, borderColor: 'green' },
    { id: 'c21', image: 'https://picsum.photos/seed/c21/200/100', location: '서울', district: '강남구', businessName: '라부부', title: '강남 역삼 선릉★ 공주님 구해요', salary: '180,000원', salaryType: '건당', category: '기타', rotationCount: 89, activeDays: 2820, views: 8765, borderColor: 'pink', isHot: true },
    { id: 'c22', image: 'https://picsum.photos/seed/c22/200/100', location: '서울', district: '강남구', businessName: '메타엔터테인먼트', title: 'BJ/방송/게스트BJ/틱톡/셀럽 모집', salary: '협의', salaryType: '협의', category: '기타', rotationCount: 21, activeDays: 630, views: 2543, borderColor: 'blue' },
    { id: 'c23', image: 'https://picsum.photos/seed/c23/200/100', location: '경기', district: '수원시', businessName: 'HOTPLACE', title: '60분 T.C 12만원 고정 보장합니다', salary: '150,000원', salaryType: '시급', category: '마사지', rotationCount: 39, activeDays: 1170, views: 3421, borderColor: 'purple' },
    { id: 'c24', image: 'https://picsum.photos/seed/c24/200/100', location: '인천', district: '미추홀', businessName: '골드문', title: '주안동 1등! 슬×터치× 최고 대우', salary: '75,000원', salaryType: '시급', category: '노래주점', rotationCount: 4, activeDays: 270, views: 876, borderColor: 'pink' },
];

// 테두리 색상
const borderColors: Record<string, string> = {
    pink: 'border-l-pink-500',
    yellow: 'border-l-yellow-500',
    green: 'border-l-green-500',
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500'
};

// 위치 색상
const locationColors: Record<string, string> = {
    '서울': 'bg-pink-500',
    '경기': 'bg-green-500',
    '부산': 'bg-blue-500',
    '인천': 'bg-cyan-500',
    '충북': 'bg-yellow-600',
    '부천': 'bg-purple-500',
};

// 활동일수 색상
const getActiveDaysColor = (days: number): string => {
    if (days >= 1000) return 'text-red-400';
    if (days >= 500) return 'text-orange-400';
    if (days >= 100) return 'text-yellow-400';
    return 'text-green-400';
};

// 반응형 가로형 카드 - 230×114 비율을 약 2:1로 반응형으로 적용
const WideCard: React.FC<{ ad: CompactAd }> = ({ ad }) => {
    const locColor = locationColors[ad.location] || 'bg-gray-500';
    const daysColor = getActiveDaysColor(ad.activeDays);
    // 광고주 등급 계산 (활동일 기반)
    const grade = estimateGradeFromDays(ad.activeDays);

    return (
        <Link
            to={`/ad/${ad.id}`}
            className="block group"
        >
            {/* 카드 - 반응형 aspect ratio 사용 */}
            <div className={`
                rounded-lg overflow-hidden
                bg-accent border-l-4 ${borderColors[ad.borderColor]}
                hover:bg-accent/70 transition-all
            `}
                style={{ aspectRatio: '230/114' }}
            >
                <div className="h-full flex flex-col p-2">
                    {/* 상단: 로고 + 정보 */}
                    <div className="flex gap-2 flex-1 min-h-0">
                        {/* 로고/이미지 - 정사각형에 가깝게 */}
                        <div className="w-[40%] rounded overflow-hidden bg-background relative flex-shrink-0">
                            <img
                                src={ad.image}
                                alt={ad.businessName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {ad.isHot && (
                                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[7px] px-1 rounded font-bold">
                                    HOT
                                </span>
                            )}
                            {ad.isNew && (
                                <span className="absolute top-0.5 right-0.5 bg-emerald-500 text-white text-[7px] px-1 rounded font-bold">
                                    NEW
                                </span>
                            )}
                        </div>

                        {/* 정보 영역 */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                            {/* 위치 */}
                            <div className="flex items-center gap-1">
                                <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${locColor} text-white`}>
                                    {ad.location}
                                </span>
                                <span className="text-[8px] text-text-muted truncate">{ad.district}</span>
                            </div>

                            {/* 업체명 */}
                            <div className="text-[10px] font-bold text-white truncate">
                                {ad.businessName}
                            </div>

                            {/* 제목 */}
                            <div className="text-[9px] text-text-muted truncate">
                                {ad.title}
                            </div>

                            {/* 급여 */}
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-primary/20 text-primary">
                                    {ad.salaryType}
                                </span>
                                <span className="text-[10px] font-bold text-primary truncate">
                                    {ad.salary}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 하단: 조회수 + 회/일 */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1">
                        <div className="flex items-center gap-1 text-text-muted">
                            <Eye size={9} />
                            <span className="text-[8px]">{ad.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`text-[8px] font-bold ${grade.textColor}`} title={`${grade.nameKo} 등급`}>
                                {grade.icon} {ad.rotationCount}회
                            </span>
                            <span className={`text-[8px] font-bold ${daysColor}`}>
                                {ad.activeDays}일
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// 메인 컴포넌트
const CompactAdGrid: React.FC = () => {
    const { useSampleData } = useDataMode();

    return (
        <section className="py-6 bg-background">
            <div className="container mx-auto px-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full"></div>
                        <h2 className="text-lg font-bold text-white">우대채용정보</h2>
                        <span className="text-sm text-text-muted">({compactAdsData.length}개)</span>
                        {useSampleData && (
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                샘플
                            </span>
                        )}
                    </div>

                    <Link to="/search?productType=general" className="text-xs text-text-muted hover:text-primary transition-colors">
                        더보기 +
                    </Link>
                </div>

                {/* 6열 반응형 그리드 - 다른 섹션과 동일 폭 */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {compactAdsData.map((ad) => (
                        <WideCard key={ad.id} ad={ad} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CompactAdGrid;
