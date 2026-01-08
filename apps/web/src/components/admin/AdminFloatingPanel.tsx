/**
 * 관리자 전용 플로팅 패널
 * 관리자로 로그인한 경우에만 화면 우측 하단에 표시
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, BarChart2, ChevronUp, ChevronDown, X, Shield } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

const AdminFloatingPanel: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        // 관리자 상태 체크 함수 (role 필드 기반)
        const checkAdminStatus = () => {
            const user = getCurrentUser();
            setIsAdmin(user !== null && user.role === 'admin');
        };

        // 초기 체크
        checkAdminStatus();

        // storage 변경 감지 (로그인/로그아웃 시)
        window.addEventListener('storage', checkAdminStatus);

        // 커스텀 이벤트 리스너 (같은 탭에서의 로그인/로그아웃 감지)
        window.addEventListener('authStateChanged', checkAdminStatus);

        return () => {
            window.removeEventListener('storage', checkAdminStatus);
            window.removeEventListener('authStateChanged', checkAdminStatus);
        };
    }, []);

    // 관리자가 아니면 렌더링하지 않음
    if (!isAdmin) return null;

    // 최소화 상태
    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg 
                         flex items-center justify-center hover:scale-110 transition-all duration-300
                         animate-pulse hover:animate-none"
                title="관리자 메뉴 열기"
            >
                <Shield className="w-6 h-6 text-white" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* 메인 패널 */}
            <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl 
                           border border-cyan-500/30 overflow-hidden transition-all duration-300
                           ${isExpanded ? 'w-72' : 'w-60'}`}>

                {/* 헤더 */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-4 py-3 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">관리자 모드</div>
                            <div className="text-cyan-300 text-xs">Admin Panel</div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-white/70" /> : <ChevronUp className="w-4 h-4 text-white/70" />}
                        </button>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-white/70" />
                        </button>
                    </div>
                </div>

                {/* 빠른 링크 */}
                <div className="p-3 space-y-2">
                    <Link
                        to="/admin/content"
                        className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 
                                 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-xl transition-all group"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-medium text-sm group-hover:text-cyan-300 transition-colors">
                                사이트 관리
                            </div>
                            <div className="text-white/50 text-xs">콘텐츠, 테마, 설정</div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/crm"
                        className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                                 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl transition-all group"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                                CRM 대시보드
                            </div>
                            <div className="text-white/50 text-xs">회원, 광고, 통계</div>
                        </div>
                    </Link>

                    {isExpanded && (
                        <>
                            <div className="border-t border-white/5 pt-2 mt-2">
                                <Link
                                    to="/advertiser"
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <BarChart2 className="w-4 h-4 text-primary" />
                                    <span className="text-white/70 text-sm">광고주 센터</span>
                                </Link>
                            </div>

                            <div className="text-xs text-white/30 text-center pt-2">
                                관리자: {getCurrentUser()?.email}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminFloatingPanel;
