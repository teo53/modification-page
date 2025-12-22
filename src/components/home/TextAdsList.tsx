import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';

// 광고 데이터 - 프리미엄/일반 구분 없이 혼합
const textAds = [
    { id: 1, title: '강남 최고급 룸살롱 여성 스탭 모집', location: '서울 강남', badge: 'VIP', isNew: true, highlightConfig: { color: 'pink', text: '최고급' } },
    { id: 2, title: '고수익 보장! 하이클래스 룸 스탭 채용', location: '서울 강남', badge: 'HOT', isHot: true },
    { id: 3, title: '신규 오픈 기념 특별 채용 이벤트', location: '서울 홍대', badge: 'NEW', highlightConfig: { color: 'cyan', text: '이벤트' } },
    { id: 4, title: '손님 많은 업소에서 인원 충원합니다', location: '서울 강남', isUrgent: true },
    { id: 5, title: '일 150만원 이상 고수익 보장! VIP 모집', location: '서울 청담', badge: 'VIP', highlightConfig: { color: 'yellow', text: '고수익' } },
    { id: 6, title: '성실하고 밝은 분 우대합니다', location: '서울 신촌' },
    { id: 7, title: '제이스 VIP 라운지 스탭 채용', location: '서울 강남', badge: 'VIP', highlightConfig: { color: 'green', text: 'VIP' } },
    { id: 8, title: '최고 대우 보장! 경력자 환영', location: '서울 역삼' },
    { id: 9, title: '고페이 VIP 업소 긴급 모집', location: '서울 강남', badge: 'VIP', highlightConfig: { color: 'pink', text: '고페이' } },
    { id: 10, title: '주말 알바 가능! 파트타임 모집', location: '서울 강남' },
    { id: 11, title: '초보 환영! 친절히 알려드립니다', location: '서울 신촌' },
    { id: 12, title: '숙소 제공! 지방에서도 지원 가능', location: '서울 강남' },
    { id: 13, title: '당일 지급! 안전하고 깨끗한 업소', location: '서울 홍대' },
    { id: 14, title: '보장직, 지원금 당일지급! 숙소지원 가능', location: '서울 강남', badge: 'VIP', isNew: true },
    { id: 15, title: 'PREMIUM 업소 - 후기 200건 이상', location: '서울 청담', badge: 'PREMIUM' },
    { id: 16, title: '강남 역삼 선불 고수익 알바 모집', location: '서울 강남', isUrgent: true },
];

const TextAdsList: React.FC = () => {
    // 두 컬럼으로 분배 (혼합)
    const leftColumnAds = textAds.filter((_, i) => i % 2 === 0);
    const rightColumnAds = textAds.filter((_, i) => i % 2 !== 0);

    const renderTitle = (title: string, config: any) => {
        const colorMap: Record<string, string> = {
            yellow: 'bg-yellow-500/30 text-yellow-100',
            pink: 'bg-pink-500/30 text-pink-100',
            green: 'bg-green-500/30 text-green-100',
            cyan: 'bg-cyan-500/30 text-cyan-100',
        };

        if (!config?.text) return <span className="text-white">{title}</span>;

        const colorClass = colorMap[config.color] || colorMap.yellow;
        const parts = title.split(config.text);
        if (parts.length === 1) return <span className="text-white">{title}</span>;

        return (
            <span className="text-white">
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        {part}
                        {i < parts.length - 1 && (
                            <span className={`px-1 py-0.5 rounded ${colorClass}`}>{config.text}</span>
                        )}
                    </React.Fragment>
                ))}
            </span>
        );
    };

    const renderAdItem = (ad: typeof textAds[0], index: number) => (
        <Link
            key={ad.id}
            to={`/ad/${ad.id}`}
            className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors group"
        >
            <div className="text-text-muted text-sm w-6 text-center">{index + 1}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1 flex-shrink-0">
                        {ad.isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>}
                        {ad.isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>}
                        {ad.badge === 'VIP' && <span className="bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded">VIP</span>}
                        {ad.badge === 'PREMIUM' && <span className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">PREMIUM</span>}
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin size={10} />
                        {ad.location}
                    </div>
                    {ad.isUrgent && <Clock size={12} className="text-red-400 flex-shrink-0" />}
                </div>
                <h3 className="truncate group-hover:text-primary transition-colors">
                    {renderTitle(ad.title, (ad as any).highlightConfig)}
                </h3>
            </div>
        </Link>
    );

    return (
        <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">전체 채용 광고</h2>
                <Link to="/search" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* 왼쪽 컬럼 */}
                <div className="bg-accent/30 rounded-xl border border-white/5 overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {leftColumnAds.map((ad, index) => renderAdItem(ad, index))}
                    </div>
                </div>

                {/* 오른쪽 컬럼 */}
                <div className="bg-accent/30 rounded-xl border border-white/5 overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {rightColumnAds.map((ad, index) => renderAdItem(ad, index))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TextAdsList;
