import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [direction, setDirection] = useState(0);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Handle splash completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    dispatch({ type: 'SET_APP_READY', payload: true });
  };

  // Determine navigation direction for animations
  useEffect(() => {
    const currentDepth = location.pathname.split('/').length;
    const prevDepth = prevPath.split('/').length;

    if (currentDepth > prevDepth) {
      setDirection(1); // Forward
    } else if (currentDepth < prevDepth) {
      setDirection(-1); // Back
    } else {
      setDirection(0); // Same level
    }

    setPrevPath(location.pathname);
    dispatch({ type: 'SET_CURRENT_ROUTE', payload: location.pathname });
  }, [location.pathname, prevPath, dispatch]);

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

  // Page transition variants
  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : direction < 0 ? '-20%' : 0,
      opacity: direction === 0 ? 1 : 0.8,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-20%' : direction < 0 ? '100%' : 0,
      opacity: 0.8,
    }),
  };

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

        {/* Main Content with Page Transitions */}
        <main
          className={`flex-1 overflow-x-hidden ${showBottomNav ? 'pb-20' : ''}`}
          style={{ minHeight: 'calc(100vh - 56px - 64px)' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'tween',
                ease: 'easeInOut',
                duration: 0.25,
              }}
              className="min-h-full"
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNavigation />}
      </div>
    </>
  );
};

export default AppLayout;
