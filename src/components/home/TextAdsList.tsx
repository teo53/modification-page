import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';

const textAds = [
    { id: 1, title: '⭐세상 어디에도 없는 【직인으뮤】 육상리제이!!!', location: '서울', badge: 'VIP', isNew: true, highlightConfig: { color: 'pink', text: '직인으뮤' } },
    { id: 2, title: '친절접수☎메이저식♬한국판페이♬만족지급♬안심운영 ★★초보환영 고수우대★★', location: '서울', badge: 'HOT', isHot: true },
    { id: 3, title: '☆☆☆톨미 이벤트☆☆☆', location: '서울', badge: 'NEW', highlightConfig: { color: 'cyan', text: '이벤트' } },
    { id: 4, title: '❤ 손님 많아서 인니를 모십니다 ❤', location: '서울', isUrgent: true },
    { id: 5, title: '★실 봉급 100-150만 아닌 맹글짧!!!홀를짧!!!백만원모집!①', location: '서울', badge: 'VIP', highlightConfig: { color: 'yellow', text: '' } },
    { id: 6, title: '● 복 많은성실알밤들♥올 강압어데에서 성여어에서 성어어!!!', location: '서울' },
    { id: 7, title: '♥제이스♥VIP♥', location: '서울', badge: 'VIP', highlightConfig: { color: 'green', text: 'VIP' } },
    { id: 8, title: '❤최고에✌참담❤', location: '서울' },
    { id: 9, title: '● 고페이✹ VIP ● 옵조대이 ●', location: '서울', badge: 'VIP', highlightConfig: { color: 'pink', text: '고페이' } },
    { id: 10, title: '❤에반미 ❤모토봉열 ❤ 팔주100 ❤', location: '서울' },
    { id: 11, title: '○ 고페이들 ○ 카타본들 ○', location: '서울' },
    { id: 12, title: '복 농악술어니 ❤ 업위기어지 ❤', location: '서울' },
    { id: 13, title: '❤ 카지도 ❤ 부상어아이어', location: '서울' },
    { id: 14, title: '★보장직, 지원금❤️당일지급 밀방1등 VIP💫숙소지원 보상조 맹강👷 발까지요!!', location: '서울', badge: 'VIP', isNew: true },
    { id: 15, title: '★PREMIUM★ 후기 200 응이 가거기요.', location: '서울', badge: 'PREMIUM' },
    { id: 16, title: '강남 역삼 선불💰고주탁 구수 모집', location: '서울 강남구', isUrgent: true },
];

const TextAdsList: React.FC = () => {
    // Split ads into two groups for demo
    const highlightAds = textAds.filter((_, i) => i % 2 === 0);
    const standardAds = textAds.filter((_, i) => i % 2 !== 0);

    const renderTitle = (title: string, config: any) => {
        const colorMap: Record<string, string> = {
            yellow: 'bg-yellow-500/30 text-yellow-100 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
            pink: 'bg-pink-500/30 text-pink-100 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
            green: 'bg-green-500/30 text-green-100 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
            cyan: 'bg-cyan-500/30 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        };

        const colorClass = colorMap[config?.color] || colorMap.yellow;
        const textToHighlight = config?.text;

        if (!textToHighlight) {
            return <span className={`px-1 py-0.5 rounded ${colorClass}`}>{title}</span>;
        }

        const parts = title.split(textToHighlight);
        if (parts.length === 1) return title; // Not found

        return (
            <span>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        {part}
                        {i < parts.length - 1 && (
                            <span className={`px-1 py-0.5 rounded ${colorClass}`}>{textToHighlight}</span>
                        )}
                    </React.Fragment>
                ))}
            </span>
        );
    };

    return (
        <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-main">전체 채용 광고</h2>
                <Link to="/search" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Column 1: Highlighter / Emphasized Ads */}
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-primary/10 border-b border-primary/20 text-sm font-bold text-primary flex items-center justify-center">
                        프리미엄 강조형
                    </div>
                    <div className="divide-y divide-border">
                        {highlightAds.map((ad, index) => (
                            <Link
                                key={ad.id}
                                to={`/ad/${ad.id}`}
                                className="flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-text-muted text-sm w-6 text-center">{index + 1}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex gap-1">
                                            {ad.isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>}
                                            {ad.isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>}
                                            {ad.badge === 'VIP' && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">VIP</span>}
                                        </div>
                                        <div className="text-xs text-text-muted flex items-center gap-1">
                                            <MapPin size={10} />
                                            {ad.location}
                                        </div>
                                    </div>
                                    <h3 className="truncate">
                                        {renderTitle(ad.title, (ad as any).highlightConfig)}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 2: Standard Ads */}
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-surface border-b border-border text-sm font-bold text-text-muted flex items-center justify-center">
                        일반 리스트형
                    </div>
                    <div className="divide-y divide-border">
                        {standardAds.map((ad, index) => (
                            <Link
                                key={ad.id}
                                to={`/ad/${ad.id}`}
                                className="flex items-center gap-3 px-6 py-4 hover:bg-surface transition-colors group"
                            >
                                <div className="text-text-muted text-sm w-6 text-center">{index + 1}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="text-xs text-text-muted flex items-center gap-1">
                                            <MapPin size={10} />
                                            {ad.location}
                                        </div>
                                        {ad.isUrgent && <Clock size={12} className="text-red-400" />}
                                    </div>
                                    <h3 className="text-text-main group-hover:text-primary transition-colors truncate">
                                        {ad.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TextAdsList;
