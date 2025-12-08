import React from 'react';
import { MapPin, Clock, Calendar, DollarSign, Phone, MessageCircle, Heart, Share2, ChevronLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const AdDetail: React.FC = () => {
    const { id } = useParams();
    console.log("Ad ID:", id); // Use id to satisfy linter

    return (
        <div className="pb-24 md:pb-12">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
                <Link to="/" className="text-white"><ChevronLeft /></Link>
                <span className="font-bold text-white">채용정보</span>
                <button className="text-white"><Share2 size={20} /></button>
            </div>

            <div className="container mx-auto px-4 md:py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-accent relative group">
                            <img
                                src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop"
                                alt="Store Interior"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
                                1 / 5
                            </div>
                        </div>

                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold mb-2">
                                        VIP 업소
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                        강남 하이퍼블릭 VIP 모집합니다 (최고대우)
                                    </h1>
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <MapPin size={16} />
                                        <span>서울 강남구 역삼동</span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full bg-accent hover:bg-secondary/20 hover:text-secondary transition-colors">
                                    <Heart size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-accent border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted flex items-center gap-1"><DollarSign size={12} /> 급여</span>
                                    <p className="text-lg font-bold text-primary">시급 100,000원</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted flex items-center gap-1"><Clock size={12} /> 근무시간</span>
                                    <p className="text-white">20:00 ~ 04:00</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted flex items-center gap-1"><Calendar size={12} /> 근무요일</span>
                                    <p className="text-white">월~토 (협의가능)</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted">연령</span>
                                    <p className="text-white">20세 ~ 35세</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-white/10" />

                        {/* Description */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-xl font-bold text-white mb-4">상세모집요강</h3>
                            <div className="bg-accent/30 p-6 rounded-xl border border-white/5 text-text-muted leading-relaxed whitespace-pre-line">
                                {`안녕하세요. 강남 최고의 하이퍼블릭에서 새로운 가족을 모십니다.
                
                1. 자격요건
                - 20세 이상 성인 여성
                - 초보가능, 경력자 우대
                - 대학생, 휴학생, 직장인 투잡 가능
                
                2. 근무조건
                - 시급 10만원 + @ (팁, 인센티브 별도)
                - 당일지급 원칙
                - 출퇴근 자유, 강요 없음
                
                3. 복리후생
                - 만근비 지급
                - 명절 선물/보너스
                - 쾌적한 대기실 완비
                - 텃세 절대 없음
                
                편하게 문의주세요. 친절하게 상담해드립니다.`}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white">위치 정보</h3>
                            <div className="h-64 bg-accent rounded-xl flex items-center justify-center border border-white/5">
                                <span className="text-text-muted">지도 영역 (Kakao/Naver Map)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Contact (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 space-y-4 p-6 rounded-xl bg-accent border border-white/10">
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">Logo</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">골드문</h3>
                                <p className="text-sm text-text-muted">담당자: 김실장</p>
                            </div>

                            <button className="w-full py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                                <Phone size={20} />
                                010-1234-5678
                            </button>
                            <button className="w-full py-3 rounded-lg bg-[#FAE100] text-[#371D1E] font-bold hover:bg-[#FCE840] transition-colors flex items-center justify-center gap-2">
                                <MessageCircle size={20} />
                                카카오톡 문의
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-white/10 flex gap-2 z-50">
                <button className="flex-1 py-3 rounded-lg bg-primary text-black font-bold flex items-center justify-center gap-2">
                    <Phone size={20} />
                    전화하기
                </button>
                <button className="flex-1 py-3 rounded-lg bg-[#FAE100] text-[#371D1E] font-bold flex items-center justify-center gap-2">
                    <MessageCircle size={20} />
                    카톡문의
                </button>
            </div>
        </div>
    );
};

export default AdDetail;
