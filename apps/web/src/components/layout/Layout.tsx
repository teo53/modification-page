import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import OfflineIndicator from '../common/OfflineIndicator';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text-main font-sans">
            {/* Offline Status Indicator */}
            <OfflineIndicator />

            {/* Skip to main content - 접근성 개선 */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
            >
                본문으로 건너뛰기
            </a>

            <Header />
            <main id="main-content" className="flex-1" role="main" aria-label="주요 콘텐츠">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
