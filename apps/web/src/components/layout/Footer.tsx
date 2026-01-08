import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

const Footer: React.FC = () => {
    const user = getCurrentUser();
    // role 필드가 'admin'인지 확인 (이메일 기반 체크 제거)
    const isAdmin = user?.role === 'admin';

    return (
        <footer className="bg-accent/50 border-t border-white/10 mt-auto" role="contentinfo" aria-label="사이트 푸터">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Link to="/" className="block">
                            <img src="/logo-horizontal-white.png" alt="달빛알바" className="h-8 object-contain" />
                        </Link>
                        <p className="text-sm text-text-muted leading-relaxed">
                            대한민국 No.1 유흥알바 채용 플랫폼
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white/20 transition-colors">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white/20 transition-colors">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white/20 transition-colors">
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4">서비스</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/search" className="text-text-muted hover:text-white transition-colors">구인구직</Link></li>
                            <li><Link to="/theme" className="text-text-muted hover:text-white transition-colors">테마별 알바</Link></li>
                            <li><Link to="/urgent" className="text-text-muted hover:text-white transition-colors">급구 알바</Link></li>
                            <li><Link to="/community" className="text-text-muted hover:text-white transition-colors">커뮤니티</Link></li>
                            <li><Link to="/post-ad" className="text-text-muted hover:text-white transition-colors">광고 등록</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-4">고객지원</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/support" className="text-text-muted hover:text-white transition-colors">고객센터</Link></li>
                            <li><a href="#" className="text-text-muted hover:text-white transition-colors">자주 묻는 질문</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white transition-colors">제휴 문의</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white transition-colors">광고 문의</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4">연락처</h4>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li className="flex items-center gap-2">
                                <Phone size={14} />
                                <span>02-1234-5678</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={14} />
                                <span>contact@dalbitalba.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={14} className="mt-1 shrink-0" />
                                <span>서울특별시 강남구 테헤란로<br />123 달빛알바빌딩 5층</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
                        <a href="#" className="text-text-muted hover:text-white transition-colors">회사소개</a>
                        <Link to="/terms" className="text-white font-bold hover:text-primary transition-colors">이용약관</Link>
                        <Link to="/privacy" className="text-white font-bold hover:text-primary transition-colors">개인정보처리방침</Link>
                        <Link to="/youth-protection" className="text-red-400 font-bold hover:text-red-300 transition-colors">청소년보호정책</Link>
                        <Link to="/advertiser" className="text-text-muted hover:text-white transition-colors">광고주센터</Link>
                        {isAdmin && (
                            <Link to="/admin/crm" className="text-primary/70 hover:text-primary transition-colors font-medium">
                                🔐 관리자 CRM
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin/content" className="text-cyan-400/70 hover:text-cyan-400 transition-colors font-medium">
                                ⚙️ 사이트 관리
                            </Link>
                        )}
                    </div>

                    {/* Company Info */}
                    <div className="text-center text-xs text-text-muted/70 space-y-1">
                        {/* TODO: 아래 정보를 실제 사업자 정보로 반드시 변경하세요 */}
                        <p>상호명: (주)달빛알바 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
                        <p>통신판매업신고번호: 2025-서울강남-00000 | 직업정보제공사업 신고번호: J1234567890123</p>
                        <p className="mt-3 text-text-muted/50">
                            달빛알바는 통신판매중개자이며 통신판매의 당사자가 아닙니다.<br />
                            따라서 달빛알바는 상품·거래정보 및 거래에 대하여 책임을 지지 않습니다.
                        </p>
                    </div>

                    {/* Legal Notices - 청소년 보호법 및 직업안정법 */}
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="text-center space-y-2">
                            <p className="text-red-400 font-bold text-sm flex items-center justify-center gap-2">
                                🔞 청소년유해매체물 (청소년보호법 제9조)
                            </p>
                            <p className="text-xs text-red-300/80">
                                본 사이트는 만 19세 미만 청소년의 이용이 금지된 청소년유해매체물입니다.
                            </p>
                            <div className="text-xs text-text-muted/60 space-y-1 mt-3">
                                <p>• 청소년보호법 제16조(표시의무), 제17조(청소년에 대한 판매금지 등)</p>
                                <p>• 직업안정법 제34조(허위광고 금지), 제47조의3(불법 직업소개 금지)</p>
                                <p>• 위반 시 3년 이하의 징역 또는 3천만원 이하의 벌금에 처해질 수 있습니다.</p>
                            </div>
                        </div>
                    </div>

                    {/* 청소년보호책임자 */}
                    <div className="mt-4 text-center text-xs text-text-muted/70">
                        <p>청소년보호책임자: 홍길동 (contact@dalbitalba.com)</p>
                    </div>

                    {/* Copyright */}
                    <div className="text-center mt-6 text-sm text-text-muted">
                        <p>© 2025 DalbitAlba. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

