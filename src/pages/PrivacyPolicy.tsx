import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Shield, Clock, Trash2, Phone, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                        <Lock className="text-blue-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">개인정보처리방침</h1>
                    <p className="text-text-muted">루나알바 개인정보 보호 정책</p>
                </div>

                {/* Content */}
                <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-primary" />
                            제1조 (개인정보의 처리 목적)
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            (주)루나알바(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.
                            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                            이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                        </p>
                        <ul className="space-y-2 text-text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">1.</span>
                                <span><strong className="text-white">회원 가입 및 관리:</strong> 회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리, 성인인증</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">2.</span>
                                <span><strong className="text-white">서비스 제공:</strong> 구인구직 정보 제공, 콘텐츠 제공, 맞춤 서비스 제공</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">3.</span>
                                <span><strong className="text-white">민원 처리:</strong> 민원인의 신원 확인, 민원사항 확인, 처리결과 통보</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제2조 (수집하는 개인정보 항목)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="p-3 text-left text-white border-b border-white/10">구분</th>
                                        <th className="p-3 text-left text-white border-b border-white/10">수집 항목</th>
                                        <th className="p-3 text-left text-white border-b border-white/10">수집 목적</th>
                                    </tr>
                                </thead>
                                <tbody className="text-text-muted">
                                    <tr className="border-b border-white/5">
                                        <td className="p-3">필수</td>
                                        <td className="p-3">이메일, 비밀번호, 이름, 휴대폰번호, 성별</td>
                                        <td className="p-3">회원 가입, 본인 확인</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-3">선택</td>
                                        <td className="p-3">주소, 프로필 사진</td>
                                        <td className="p-3">맞춤 서비스 제공</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-3">광고주</td>
                                        <td className="p-3">사업자등록번호, 상호명, 사업자등록증</td>
                                        <td className="p-3">광고 서비스 제공</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">자동 수집</td>
                                        <td className="p-3">IP주소, 쿠키, 방문기록</td>
                                        <td className="p-3">서비스 이용 분석</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            제3조 (개인정보의 보유 및 이용기간)
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
                            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                        </p>
                        <div className="bg-background rounded-lg p-4 border border-white/5">
                            <ul className="space-y-2 text-sm text-text-muted">
                                <li>• 회원 정보: <span className="text-white">회원 탈퇴 시까지</span></li>
                                <li>• 계약 관련 기록: <span className="text-white">5년 (전자상거래법)</span></li>
                                <li>• 대금결제 기록: <span className="text-white">5년 (전자상거래법)</span></li>
                                <li>• 소비자 불만 기록: <span className="text-white">3년 (전자상거래법)</span></li>
                                <li>• 접속 기록: <span className="text-white">1년 (통신비밀보호법)</span></li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제4조 (개인정보의 제3자 제공)</h2>
                        <p className="text-text-muted leading-relaxed">
                            회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며,
                            정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만
                            개인정보를 제3자에게 제공합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제5조 (개인정보 처리 위탁)</h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="p-3 text-left text-white border-b border-white/10">수탁업체</th>
                                        <th className="p-3 text-left text-white border-b border-white/10">위탁 업무</th>
                                    </tr>
                                </thead>
                                <tbody className="text-text-muted">
                                    <tr className="border-b border-white/5">
                                        <td className="p-3">나이스페이먼츠</td>
                                        <td className="p-3">휴대폰 본인인증</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">AWS</td>
                                        <td className="p-3">클라우드 서버 운영</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Trash2 size={20} className="text-primary" />
                            제6조 (개인정보의 파기)
                        </h2>
                        <p className="text-text-muted leading-relaxed">
                            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                            지체 없이 해당 개인정보를 파기합니다. 파기 방법은 다음과 같습니다:
                        </p>
                        <ul className="mt-4 space-y-2 text-text-muted">
                            <li>• 전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                            <li>• 종이 문서: 분쇄기로 분쇄하거나 소각</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제7조 (정보주체의 권리·의무)</h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                        </p>
                        <ul className="space-y-2 text-text-muted">
                            <li className="flex items-center gap-2">
                                <span className="text-primary">✓</span>
                                개인정보 열람 요구
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">✓</span>
                                오류 등이 있을 경우 정정 요구
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">✓</span>
                                삭제 요구
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">✓</span>
                                처리 정지 요구
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제8조 (개인정보 보호책임자)</h2>
                        <div className="bg-background rounded-lg p-4 border border-white/5">
                            <div className="space-y-2">
                                <p className="text-white"><strong>개인정보 보호책임자:</strong> 홍길동 (대표이사)</p>
                                <p className="text-text-muted flex items-center gap-2">
                                    <Mail size={14} />
                                    이메일: privacy@lunaalba.com
                                </p>
                                <p className="text-text-muted flex items-center gap-2">
                                    <Phone size={14} />
                                    전화: 02-1234-5678
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제9조 (권익침해 구제방법)</h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            개인정보침해 관련 상담 및 구제를 위해 아래 기관에 문의하실 수 있습니다:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-background rounded-lg p-4 border border-white/5">
                                <p className="text-white font-bold mb-2">개인정보침해신고센터</p>
                                <p className="text-text-muted text-sm">☎ (국번없이) 118</p>
                                <p className="text-text-muted text-sm">privacy.kisa.or.kr</p>
                            </div>
                            <div className="bg-background rounded-lg p-4 border border-white/5">
                                <p className="text-white font-bold mb-2">개인정보분쟁조정위원회</p>
                                <p className="text-text-muted text-sm">☎ 1833-6972</p>
                                <p className="text-text-muted text-sm">kopico.go.kr</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-text-muted">
                    <p>시행일자: 2025년 1월 1일</p>
                    <p className="mt-2">
                        <Link to="/" className="text-primary hover:underline">홈으로 돌아가기</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
