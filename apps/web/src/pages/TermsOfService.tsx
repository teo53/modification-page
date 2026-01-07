import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                        <FileText className="text-primary" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">이용약관</h1>
                    <p className="text-text-muted">루나알바 서비스 이용약관</p>
                </div>

                {/* Content */}
                <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제1조 (목적)</h2>
                        <p className="text-text-muted leading-relaxed">
                            이 약관은 (주)루나알바(이하 "회사")가 운영하는 웹사이트 "루나알바"(이하 "사이트")에서
                            제공하는 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및
                            책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제2조 (정의)</h2>
                        <ul className="space-y-3 text-text-muted">
                            <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                                <span><strong className="text-white">"서비스"</strong>: 회사가 사이트를 통해 제공하는 구인구직 정보 제공 서비스 및 관련 제반 서비스</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                                <span><strong className="text-white">"회원"</strong>: 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여받은 자</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                                <span><strong className="text-white">"광고주"</strong>: 서비스를 통해 구인 광고를 게재하는 회원</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                                <span><strong className="text-white">"구직자"</strong>: 서비스를 통해 구직 활동을 하는 회원</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제3조 (약관의 효력 및 변경)</h2>
                        <ol className="space-y-2 text-text-muted list-decimal list-inside">
                            <li>본 약관은 서비스를 이용하고자 하는 모든 회원에게 그 효력을 발생합니다.</li>
                            <li>회사는 필요한 경우 관련 법령에 위배되지 않는 범위 내에서 약관을 변경할 수 있습니다.</li>
                            <li>변경된 약관은 적용일 7일 전부터 사이트에 공지됩니다.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제4조 (이용계약의 성립)</h2>
                        <ol className="space-y-2 text-text-muted list-decimal list-inside">
                            <li>이용계약은 회원가입 신청자가 본 약관에 동의하고 회원가입을 완료한 시점에 성립됩니다.</li>
                            <li>회사는 다음 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다:
                                <ul className="ml-6 mt-2 space-y-1">
                                    <li>- 만 19세 미만의 청소년인 경우</li>
                                    <li>- 실명이 아니거나 타인의 정보를 도용한 경우</li>
                                    <li>- 허위 정보를 기재하거나 필수사항을 기재하지 않은 경우</li>
                                </ul>
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제5조 (서비스의 제공)</h2>
                        <p className="text-text-muted leading-relaxed mb-4">회사는 다음의 서비스를 제공합니다:</p>
                        <ul className="space-y-2 text-text-muted">
                            <li>• 구인정보 게시 및 검색 서비스</li>
                            <li>• 구직자 정보 등록 및 열람 서비스</li>
                            <li>• 커뮤니티 서비스</li>
                            <li>• 광고 서비스</li>
                            <li>• 기타 회사가 정하는 서비스</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제6조 (회원의 의무)</h2>
                        <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                            <p className="text-red-200 font-bold mb-2">다음 행위는 금지됩니다:</p>
                            <ul className="space-y-1 text-red-200/80 text-sm">
                                <li>• 허위 정보를 등록하거나 타인의 정보를 도용하는 행위</li>
                                <li>• 불법적인 내용의 광고를 게시하는 행위</li>
                                <li>• 성매매, 불법 행위를 알선하는 행위</li>
                                <li>• 서비스의 정상적인 운영을 방해하는 행위</li>
                                <li>• 타인의 권리나 명예를 침해하는 행위</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제7조 (면책조항)</h2>
                        <ol className="space-y-2 text-text-muted list-decimal list-inside">
                            <li>회사는 통신판매중개자로서 회원 간의 거래에 대하여 책임을 지지 않습니다.</li>
                            <li>회사는 회원이 게시한 정보의 정확성, 신뢰성에 대하여 책임을 지지 않습니다.</li>
                            <li>회사는 천재지변 등 불가항력적인 사유로 인한 서비스 중단에 대하여 책임을 지지 않습니다.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제8조 (관할법원)</h2>
                        <p className="text-text-muted leading-relaxed">
                            서비스 이용과 관련하여 발생한 분쟁에 대해서는 회사의 본사 소재지를 관할하는 법원을
                            제1심 관할법원으로 합니다.
                        </p>
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

export default TermsOfService;
