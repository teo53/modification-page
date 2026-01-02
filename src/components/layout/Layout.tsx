import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from '../pwa/MobileBottomNav';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import OfflineIndicator from '../pwa/OfflineIndicator';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text-main font-sans">
            {/* Offline Status Indicator */}
            <OfflineIndicator />

            <Header />

            {/* Main Content - Add padding bottom for mobile nav */}
            <main className="flex-1 pb-16 md:pb-0">
                <Outlet />
            </main>

            {/* Desktop Footer */}
            <div className="hidden md:block">
                <Footer />
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
        </div>
    );
};

export default Layout;
