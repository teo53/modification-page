import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Users, Phone, Mail, FileText } from 'lucide-react';

const YouthProtectionPolicy: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                        <Shield className="text-red-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">청소년보호정책</h1>
                    <p className="text-text-muted">달빛알바 청소년 보호 정책 안내</p>
                </div>

                {/* Warning Banner */}
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="text-red-400 flex-shrink-0" size={32} />
                        <div>
                            <h2 className="text-xl font-bold text-red-400 mb-2">🔞 청소년유해매체물</h2>
                            <p className="text-red-200">
                                본 사이트는 청소년보호법에 의해 청소년유해매체물로 지정되어 있으며,
                                만 19세 미만의 청소년은 이용할 수 없습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-accent/30 rounded-xl border border-white/5 p-6 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-primary" />
                            제1조 (목적)
                        </h2>
                        <p className="text-text-muted leading-relaxed">
                            본 정책은 청소년보호법에 따라 청소년이 유해한 매체로부터 보호받을 수 있도록
                            만물상사(이하 "회사")가 마련한 청소년 보호 정책입니다.
                            회사는 청소년이 건전한 인격체로 성장할 수 있도록 청소년유해매체물로부터
                            청소년을 보호하기 위해 본 정책을 수립하여 운영합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users size={20} className="text-primary" />
                            제2조 (청소년의 정의)
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            청소년보호법 제2조 제1호에 따라 "청소년"이란 만 19세 미만인 사람을 말합니다.
                            다만, 만 19세가 되는 해의 1월 1일을 맞이한 사람은 제외합니다.
                        </p>
                        <div className="bg-background rounded-lg p-4 border border-white/5">
                            <p className="text-sm text-white font-bold mb-2">청소년 연령 기준</p>
                            <ul className="text-sm text-text-muted space-y-1">
                                <li>• 만 19세 미만: 청소년 (이용 불가)</li>
                                <li>• 만 19세 이상: 성인 (이용 가능)</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제3조 (청소년유해정보의 표시)</h2>
                        <p className="text-text-muted leading-relaxed">
                            회사는 청소년보호법 제16조에 따라 청소년유해매체물에 대하여 다음과 같이 표시합니다:
                        </p>
                        <ul className="mt-4 space-y-2 text-text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                사이트 진입 시 성인인증 화면 표시
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                푸터 영역에 "청소년유해매체물" 표시
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                메타태그를 통한 청소년유해사이트 표시
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제4조 (청소년 접근 제한)</h2>
                        <p className="text-text-muted leading-relaxed">
                            회사는 청소년보호법 제17조에 따라 청소년이 청소년유해매체물에 접근하지 못하도록
                            다음과 같은 조치를 취하고 있습니다:
                        </p>
                        <ul className="mt-4 space-y-2 text-text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                사이트 진입 시 생년월일을 통한 성인인증 실시
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                만 19세 미만 이용자의 서비스 이용 차단
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                회원가입 시 본인인증을 통한 연령 확인
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제5조 (청소년보호책임자)</h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            회사는 청소년보호법 제42조에 따라 청소년보호를 위한 업무를 수행하는
                            청소년보호책임자를 다음과 같이 지정합니다:
                        </p>
                        <div className="bg-background rounded-lg p-4 border border-white/5">
                            <div className="space-y-2">
                                <p className="text-white"><strong>청소년보호책임자:</strong> 권해성 (대표)</p>
                                <p className="text-text-muted flex items-center gap-2">
                                    <Mail size={14} />
                                    이메일: youth@dalbitalba.com
                                </p>
                                <p className="text-text-muted flex items-center gap-2">
                                    <Phone size={14} />
                                    전화: 031-123-4567
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제6조 (위반 시 처벌)</h2>
                        <p className="text-text-muted leading-relaxed">
                            청소년보호법을 위반하여 청소년에게 유해매체물을 제공하거나,
                            청소년유해업소에 청소년을 고용 또는 출입시키는 경우 다음과 같은 처벌을 받을 수 있습니다:
                        </p>
                        <div className="mt-4 bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                            <ul className="space-y-2 text-red-200 text-sm">
                                <li>• 청소년보호법 제58조: 3년 이하의 징역 또는 3천만원 이하의 벌금</li>
                                <li>• 청소년보호법 제59조: 2년 이하의 징역 또는 2천만원 이하의 벌금</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제7조 (신고 안내)</h2>
                        <p className="text-text-muted leading-relaxed">
                            청소년유해매체물 관련 불법 정보 또는 청소년 피해 사례를 발견하신 경우
                            다음 기관에 신고해 주시기 바랍니다:
                        </p>
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                            <div className="bg-background rounded-lg p-4 border border-white/5">
                                <p className="text-white font-bold mb-2">방송통신심의위원회</p>
                                <p className="text-text-muted text-sm">☎ 1377 (불법정보신고센터)</p>
                            </div>
                            <div className="bg-background rounded-lg p-4 border border-white/5">
                                <p className="text-white font-bold mb-2">여성가족부</p>
                                <p className="text-text-muted text-sm">☎ 1388 (청소년 긴급전화)</p>
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

export default YouthProtectionPolicy;
