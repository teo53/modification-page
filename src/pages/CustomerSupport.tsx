import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Megaphone, Calendar, HelpCircle, X, Gift } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    period: string;
    status: string;
    description: string;
    benefits: string[];
}

const CustomerSupport: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'notice' | 'event' | 'faq'>('notice');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const notices = [
        { id: 1, title: '[공지] 서버 점검 안내 (11/20 02:00 ~ 06:00)', date: '2025.11.18' },
        { id: 2, title: '[안내] 허위 매물 신고 포상제 실시', date: '2025.11.15' },
        { id: 3, title: '[업데이트] 광고 등록 절차 간소화 안내', date: '2025.11.10' },
    ];

    const events: Event[] = [
        {
            id: 1,
            title: '신규 가입 광고주 50% 할인 이벤트',
            period: '2025.11.01 ~ 2025.11.30',
            status: '진행중',
            description: '처음 가입하시는 광고주분들께 첫 광고 등록 시 50% 할인 혜택을 드립니다. 프리미엄 광고 상품도 할인 적용됩니다.',
            benefits: ['첫 광고 50% 할인', '프리미엄 상품 적용 가능', '추가 노출 보너스 7일']
        },
        {
            id: 2,
            title: '친구 초대하면 포인트 지급!',
            period: '상시 진행',
            status: '진행중',
            description: '친구를 초대하고 포인트를 받으세요. 초대받은 친구가 광고를 등록하면 추가 보너스 포인트도 지급됩니다.',
            benefits: ['친구 1명당 5,000P 지급', '친구 광고 등록 시 10,000P 추가', '무제한 초대 가능']
        },
        {
            id: 3,
            title: '10월 베스트 업소 시상식',
            period: '2025.10.01 ~ 2025.10.31',
            status: '종료',
            description: '10월 한 달간 가장 많은 조회수와 문의를 받은 업소를 선정하여 시상합니다.',
            benefits: ['1등: 다음달 광고 무료', '2등: 50% 할인 쿠폰', '3등: 30% 할인 쿠폰']
        },
    ];

    const faqs = [
        { id: 1, question: '광고 등록은 어떻게 하나요?', answer: '회원가입 후 우측 상단의 "구인등록" 버튼을 클릭하여 진행하실 수 있습니다.' },
        { id: 2, question: '결제 수단은 무엇이 있나요?', answer: '신용카드, 무통장입금, 휴대폰 결제 등 다양한 수단을 지원합니다.' },
        { id: 3, question: '비밀번호를 잊어버렸어요.', answer: '로그인 화면 하단의 "비밀번호 찾기"를 통해 이메일 인증 후 재설정 가능합니다.' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-text-main mb-8 text-center">고객센터</h1>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="flex bg-surface rounded-lg p-1 border border-border">
                    <button
                        onClick={() => setActiveTab('notice')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'notice' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        <Megaphone size={16} /> 공지사항
                    </button>
                    <button
                        onClick={() => setActiveTab('event')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'event' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        <Calendar size={16} /> 이벤트
                    </button>
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'faq' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        <HelpCircle size={16} /> 자주 묻는 질문
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-6 min-h-[400px] shadow-sm">
                {activeTab === 'notice' && (
                    <div className="space-y-4 animate-fade-in">
                        {notices.map((notice) => (
                            <div key={notice.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-primary text-xs font-bold">NOTICE</span>
                                    <span className="text-text-muted text-xs">{notice.date}</span>
                                </div>
                                <h3 className="text-text-main hover:text-primary cursor-pointer transition-colors">{notice.title}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'event' && (
                    <div className="space-y-4 animate-fade-in">
                        {events.map((event) => (
                            <div key={event.id} className="border-b border-border pb-4 last:border-0 last:pb-0 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${event.status === '진행중' ? 'bg-green-500/20 text-green-600' : 'bg-surface text-text-muted'
                                            }`}>
                                            {event.status}
                                        </span>
                                        <span className="text-text-muted text-xs">{event.period}</span>
                                    </div>
                                    <h3 className="text-text-main font-bold">{event.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="px-4 py-2 rounded bg-surface text-text-main text-sm hover:bg-accent transition-colors border border-border"
                                >
                                    자세히
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'faq' && (
                    <div className="space-y-2 animate-fade-in">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between p-4 bg-surface hover:bg-accent transition-colors text-left"
                                >
                                    <span className="font-bold text-text-main flex items-center gap-2">
                                        <span className="text-primary">Q.</span> {faq.question}
                                    </span>
                                    {openFaq === faq.id ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                                </button>
                                {openFaq === faq.id && (
                                    <div className="p-4 bg-accent text-text-muted text-sm leading-relaxed border-t border-border">
                                        <span className="text-primary font-bold mr-2">A.</span>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl border border-border max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-bold text-text-main">이벤트 상세</h3>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-text-muted hover:text-text-main transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    selectedEvent.status === '진행중'
                                        ? 'bg-green-500/20 text-green-600'
                                        : 'bg-surface text-text-muted'
                                }`}>
                                    {selectedEvent.status}
                                </span>
                                <span className="text-text-muted text-sm">{selectedEvent.period}</span>
                            </div>

                            <h2 className="text-xl font-bold text-text-main mb-4">{selectedEvent.title}</h2>

                            <p className="text-text-muted mb-6 leading-relaxed">
                                {selectedEvent.description}
                            </p>

                            {/* Benefits */}
                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                                    <Gift size={16} className="text-primary" />
                                    혜택
                                </h4>
                                <ul className="space-y-2">
                                    {selectedEvent.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-text-main text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            {selectedEvent.status === '진행중' && (
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors"
                                >
                                    이벤트 참여하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSupport;
