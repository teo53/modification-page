import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Megaphone, Calendar, HelpCircle } from 'lucide-react';

const CustomerSupport: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'notice' | 'event' | 'faq'>('notice');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const notices = [
        { id: 1, title: '[공지] 서버 점검 안내 (11/20 02:00 ~ 06:00)', date: '2025.11.18' },
        { id: 2, title: '[안내] 허위 매물 신고 포상제 실시', date: '2025.11.15' },
        { id: 3, title: '[업데이트] 광고 등록 절차 간소화 안내', date: '2025.11.10' },
    ];

    const events = [
        { id: 1, title: '신규 가입 광고주 50% 할인 이벤트', period: '2025.11.01 ~ 2025.11.30', status: '진행중' },
        { id: 2, title: '친구 초대하면 포인트 지급!', period: '상시 진행', status: '진행중' },
        { id: 3, title: '10월 베스트 업소 시상식', period: '2025.10.01 ~ 2025.10.31', status: '종료' },
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
                                <button className="px-4 py-2 rounded bg-surface text-text-main text-sm hover:bg-accent transition-colors border border-border">
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
        </div>
    );
};

export default CustomerSupport;
