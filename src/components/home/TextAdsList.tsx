import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign, TrendingUp } from 'lucide-react';

const textAds = [
    { id: 1, title: '⭐세상 어디에도 없는【직인으뮤】육상리제이!!!', location: '서울', badge: 'VIP', isNew: true },
    { id: 2, title: '친절접수☎메이저식♬한국판페이♬만족지급♬안심운영 ★★초보환영 고수우대★★', location: '서울', badge: 'HOT', isHot: true },
    { id: 3, title: '☆☆☆톨미 이벤트☆☆☆', location: '서울', badge: 'NEW' },
    { id: 4, title: '❤ 손님 많아서 인니를 모십니다 ❤', location: '서울', isUrgent: true },
    { id: 5, title: '★실 봉급 100-150만 아닌 맹글짧!!!홀를짧!!!백만원모집!①', location: '서울', badge: 'VIP' },
    { id: 6, title: '● 복 많은성실알밤들♥올 강압어데에서 성여어에서 성어어!!!', location: '서울' },
    { id: 7, title: '♥제이스♥VIP♥', location: '서울', badge: 'VIP' },
    { id: 8, title: '❤최고에✌참담❤', location: '서울' },
    { id: 9, title: '● 고페이✹ VIP ● 옵조대이 ●', location: '서울', badge: 'VIP' },
    { id: 10, title: '❤에반미 ❤모토봉열 ❤ 팔주100 ❤', location: '서울' },
    { id: 11, title: '○ 고페이들 ○ 카타본들 ○', location: '서울' },
    { id: 12, title: '복 농악술어니 ❤ 업위기어지 ❤', location: '서울' },
    { id: 13, title: '❤ 카지도 ❤ 부상어아이어', location: '서울' },
    { id: 14, title: '★보장직, 지원금❤️당일지급 밀방1등 VIP💫숙소지원 보상조 맹강👷 발까지요!!', location: '서울', badge: 'VIP', isNew: true },
    { id: 15, title: '★PREMIUM★ 후기 200 응이 가거기요.', location: '서울', badge: 'PREMIUM' },
    { id: 16, title: '강남 역삼 선불💰고주탁 구수 모집', location: '서울 강남구', isUrgent: true },
];

const TextAdsList: React.FC = () => {
    return (
        <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">전체 채용 광고</h2>
                <Link to="/search" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="bg-accent/30 rounded-xl border border-white/5 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-accent/50 border-b border-white/5 text-sm text-text-muted">
                    <div className="col-span-1 text-center">번호</div>
                    <div className="col-span-7">제목</div>
                    <div className="col-span-2 text-center">지역</div>
                    <div className="col-span-2 text-center">등록일</div>
                </div>

                {/* List */}
                <div className="divide-y divide-white/5">
                    {textAds.map((ad, index) => (
                        <Link
                            key={ad.id}
                            to={`/ad/${ad.id}`}
                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors group"
                        >
                            <div className="col-span-1 text-center text-text-muted text-sm">
                                {index + 1}
                            </div>
                            <div className="col-span-7 flex items-center gap-2">
                                {ad.isNew && (
                                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        NEW
                                    </span>
                                )}
                                {ad.isHot && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        HOT
                                    </span>
                                )}
                                {ad.isUrgent && (
                                    <Clock size={14} className="text-red-400" />
                                )}
                                {ad.badge === 'VIP' && (
                                    <span className="bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        VIP
                                    </span>
                                )}
                                {ad.badge === 'PREMIUM' && (
                                    <span className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        PREMIUM
                                    </span>
                                )}
                                <span className="text-white group-hover:text-primary transition-colors truncate">
                                    {ad.title}
                                </span>
                            </div>
                            <div className="col-span-2 text-center flex items-center justify-center gap-1 text-text-muted text-sm">
                                <MapPin size={12} />
                                {ad.location}
                            </div>
                            <div className="col-span-2 text-center text-text-muted text-sm">
                                오늘
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TextAdsList;
