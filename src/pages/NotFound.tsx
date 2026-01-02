import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-md">
                {/* 404 Illustration */}
                <div className="mb-8 relative">
                    <div className="text-[120px] font-bold text-border leading-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertCircle size={80} className="text-primary/50" />
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-bold text-text-main mb-4">
                    페이지를 찾을 수 없습니다
                </h1>
                <p className="text-text-muted mb-8 leading-relaxed">
                    요청하신 페이지가 존재하지 않거나 삭제되었습니다.<br />
                    주소를 다시 확인해주시기 바랍니다.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        <Home size={20} />
                        홈으로 돌아가기
                    </Link>
                    <Link
                        to="/search"
                        className="flex items-center justify-center gap-2 bg-surface text-text-main font-bold py-3 px-6 rounded-lg hover:bg-accent transition-colors border border-border"
                    >
                        <Search size={20} />
                        구인구직 보기
                    </Link>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-text-muted mb-4">인기 페이지</p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <Link to="/urgent" className="text-primary hover:underline">급구 알바</Link>
                        <span className="text-border">|</span>
                        <Link to="/theme" className="text-primary hover:underline">테마별 알바</Link>
                        <span className="text-border">|</span>
                        <Link to="/post-ad" className="text-primary hover:underline">광고 등록</Link>
                        <span className="text-border">|</span>
                        <Link to="/community" className="text-primary hover:underline">커뮤니티</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
