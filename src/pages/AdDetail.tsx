import React, { useEffect } from 'react';
import { MapPin, Clock, Calendar, DollarSign, Phone, MessageCircle, Heart, Share2, ChevronLeft, Zap } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allAds } from '../data/mockAds';
import { useApp } from '../context/AppContext';

const AdDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite, addRecentView } = useApp();

    // Find the ad by id
    const ad = allAds.find(a => String(a.id) === id);
    const isFav = id ? isFavorite(id) : false;

    // Add to recent views on load
    useEffect(() => {
        if (ad) {
            addRecentView({
                id: String(ad.id),
                title: ad.title,
                location: ad.location,
                pay: ad.pay
            });
        }
    }, [ad, addRecentView]);

    // Handle favorite toggle
    const handleFavoriteClick = () => {
        if (id) {
            toggleFavorite(id);
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
        }
    };

    // Handle share
    const handleShare = async () => {
        if (navigator.share && ad) {
            try {
                await navigator.share({
                    title: ad.title,
                    text: `${ad.location} - ${ad.pay}`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    // If ad not found
    if (!ad) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-text-main mb-2">공고를 찾을 수 없습니다</h2>
                    <p className="text-text-muted mb-4">삭제되었거나 존재하지 않는 공고입니다.</p>
                    <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg font-bold">
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 md:pb-12 bg-background">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-text-main">
                    <ChevronLeft />
                </button>
                <span className="font-bold text-text-main">채용정보</span>
                <button onClick={handleShare} className="text-text-main">
                    <Share2 size={20} />
                </button>
            </div>

            <div className="container mx-auto px-4 md:py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Image Gallery */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-accent relative group">
                            <img
                                src={ad.thumbnail}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                            {ad.isHot && (
                                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-badge-hot text-white text-sm font-bold flex items-center gap-1">
                                    <Zap size={14} /> 급구
                                </span>
                            )}
                            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
                                1 / 1
                            </div>
                        </div>

                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {ad.productType === 'vip' && (
                                            <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold">
                                                VIP
                                            </span>
                                        )}
                                        {ad.productType === 'special' && (
                                            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-600 text-xs font-bold">
                                                SPECIAL
                                            </span>
                                        )}
                                        {ad.isNew && (
                                            <span className="px-2 py-1 rounded bg-green-500/20 text-green-600 text-xs font-bold">
                                                NEW
                                            </span>
                                        )}
                                        {ad.badges.map((badge, idx) => (
                                            <span key={idx} className="px-2 py-1 rounded bg-accent text-text-muted text-xs">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold text-text-main mb-2">
                                        {ad.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <MapPin size={16} />
                                        <span>{ad.location}</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleFavoriteClick}
                                    className="p-3 rounded-full bg-accent hover:bg-accent-dark transition-colors"
                                >
                                    <Heart
                                        size={24}
                                        className={isFav ? 'text-primary' : 'text-text-muted'}
                                        fill={isFav ? 'currentColor' : 'none'}
                                    />
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-accent border border-border">
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                        <DollarSign size={12} /> 급여
                                    </span>
                                    <p className="text-lg font-bold text-primary">{ad.pay}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                        <Clock size={12} /> 근무시간
                                    </span>
                                    <p className="text-text-main">협의</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                        <Calendar size={12} /> 근무요일
                                    </span>
                                    <p className="text-text-main">협의 가능</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-text-muted">등록일</span>
                                    <p className="text-text-main">{new Date().toLocaleDateString('ko-KR')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-border" />

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-text-main mb-4">상세모집요강</h3>
                            <div className="bg-accent p-5 rounded-xl border border-border text-text-muted leading-relaxed whitespace-pre-line text-sm">
                                {`안녕하세요. ${ad.title.split(' ')[0]}에서 새로운 가족을 모십니다.

📌 자격요건
- 20세 이상 성인
- 초보가능, 경력자 우대
- 대학생, 휴학생, 직장인 투잡 가능

💰 근무조건
- ${ad.pay} + @ (팁, 인센티브 별도)
- 당일지급 원칙
- 출퇴근 자유, 강요 없음

🎁 복리후생
- 만근비 지급
- 명절 선물/보너스
- 쾌적한 대기실 완비
- 텃세 절대 없음

편하게 문의주세요. 친절하게 상담해드립니다.`}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-text-main">위치 정보</h3>
                            <div className="h-48 bg-accent rounded-xl flex items-center justify-center border border-border">
                                <div className="text-center">
                                    <MapPin size={32} className="text-text-muted mx-auto mb-2" />
                                    <span className="text-text-muted">{ad.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Contact (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 space-y-4 p-6 rounded-xl bg-card border border-border shadow-sm">
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-3 overflow-hidden">
                                    <img src={ad.thumbnail} alt="" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-lg font-bold text-text-main">{ad.title.split(' ')[0]}</h3>
                                <p className="text-sm text-text-muted">담당자: 매니저</p>
                            </div>

                            <button className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                                <Phone size={20} />
                                전화 문의
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex gap-2 z-50 safe-area-pb">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-lg bg-primary text-white font-bold flex items-center justify-center gap-2"
                >
                    <Phone size={20} />
                    전화하기
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-lg bg-[#FAE100] text-[#371D1E] font-bold flex items-center justify-center gap-2"
                >
                    <MessageCircle size={20} />
                    카톡문의
                </motion.button>
            </div>
        </div>
    );
};

export default AdDetail;
