import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-surface border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-text-main mb-4">LunaAlba</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            대한민국 No.1 유흥알바 채용 플랫폼
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-text-muted hover:text-primary hover:bg-accent transition-colors border border-border">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-text-muted hover:text-primary hover:bg-accent transition-colors border border-border">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-text-muted hover:text-primary hover:bg-accent transition-colors border border-border">
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-text-main font-bold mb-4">서비스</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/search" className="text-text-muted hover:text-text-main transition-colors">구인구직</Link></li>
                            <li><Link to="/theme" className="text-text-muted hover:text-text-main transition-colors">테마별 알바</Link></li>
                            <li><Link to="/urgent" className="text-text-muted hover:text-text-main transition-colors">급구 알바</Link></li>
                            <li><Link to="/community" className="text-text-muted hover:text-text-main transition-colors">커뮤니티</Link></li>
                            <li><Link to="/post-ad" className="text-text-muted hover:text-text-main transition-colors">광고 등록</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-text-main font-bold mb-4">고객지원</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/support" className="text-text-muted hover:text-text-main transition-colors">고객센터</Link></li>
                            <li><a href="#" className="text-text-muted hover:text-text-main transition-colors">자주 묻는 질문</a></li>
                            <li><a href="#" className="text-text-muted hover:text-text-main transition-colors">제휴 문의</a></li>
                            <li><a href="#" className="text-text-muted hover:text-text-main transition-colors">광고 문의</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-text-main font-bold mb-4">연락처</h4>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li className="flex items-center gap-2">
                                <Phone size={14} />
                                <span>02-1234-5678</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={14} />
                                <span>contact@lunaalba.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={14} className="mt-1 shrink-0" />
                                <span>서울특별시 강남구 테헤란로<br />123 루나알바빌딩 5층</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="pt-6 border-t border-border">
                    <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
                        <a href="#" className="text-text-muted hover:text-text-main transition-colors">회사소개</a>
                        <a href="#" className="text-text-main font-bold hover:text-primary transition-colors">이용약관</a>
                        <a href="#" className="text-text-main font-bold hover:text-primary transition-colors">개인정보처리방침</a>
                        <a href="#" className="text-text-muted hover:text-text-main transition-colors">청소년보호정책</a>
                        <Link to="/advertiser/dashboard" className="text-text-muted hover:text-text-main transition-colors">광고주센터</Link>
                        <Link to="/admin/dashboard" className="text-text-light hover:text-text-muted transition-colors">관리자</Link>
                    </div>

                    {/* Company Info */}
                    <div className="text-center text-xs text-text-muted/70 space-y-1">
                        <p>상호명: (주)루나알바 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
                        <p>통신판매업신고번호: 2025-서울강남-00000 | 직업정보제공사업 신고번호: J1234567890123</p>
                        <p className="mt-3 text-text-muted/50">
                            루나알바는 통신판매중개자이며 통신판매의 당사자가 아닙니다.<br />
                            따라서 루나알바는 상품·거래정보 및 거래에 대하여 책임을 지지 않습니다.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="text-center mt-6 text-sm text-text-muted">
                        <p>© 2025 LunaAlba. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
