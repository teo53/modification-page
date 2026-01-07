import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppBar from './AppBar';
import BottomNavigation from './BottomNavigation';
import OfflineIndicator from '../pwa/OfflineIndicator';
import SplashScreen from './SplashScreen';

// Pages where AppBar should show back button
const BACK_BUTTON_ROUTES = [
  '/ad/',
  '/community/post/',
  '/post-ad',
  '/login',
  '/signup',
  '/advertiser/',
  '/admin/',
  '/support',
];

// Pages where bottom nav should be hidden
const HIDE_BOTTOM_NAV_ROUTES = [
  '/login',
  '/signup',
  '/post-ad',
];

// Pages that use transparent AppBar
const TRANSPARENT_APPBAR_ROUTES = [
  '/',
];

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { dispatch } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  // Handle splash completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    dispatch({ type: 'SET_APP_READY', payload: true });
  };

  // Track current route
  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_ROUTE', payload: location.pathname });
  }, [location.pathname, dispatch]);

  // Determine if back button should show
  const showBackButton = BACK_BUTTON_ROUTES.some(route =>
    location.pathname.startsWith(route)
  );

  // Determine if bottom nav should show
  const showBottomNav = !HIDE_BOTTOM_NAV_ROUTES.some(route =>
    location.pathname.startsWith(route)
  );

  // Determine AppBar style
  const isTransparentAppBar = TRANSPARENT_APPBAR_ROUTES.includes(location.pathname);

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} minimumDuration={2500} />
      )}

      {/* Main App */}
      <div className="min-h-screen flex flex-col bg-background text-text-main font-sans">
        {/* Offline Status */}
        <OfflineIndicator />

        {/* App Bar */}
        <AppBar
          showBackButton={showBackButton}
          transparent={isTransparentAppBar}
        />

        {/* Main Content - Simple render */}
        <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNavigation />}
      </div>
    </>
  );
};

export default AppLayout;
