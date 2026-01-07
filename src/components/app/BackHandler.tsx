import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { motion, AnimatePresence } from 'framer-motion';

const BackHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitToast, setShowExitToast] = useState(false);
  const [exitPressedOnce, setExitPressedOnce] = useState(false);

  const handleBackButton = useCallback(() => {
    // If we're on the home page, show exit confirmation
    if (location.pathname === '/') {
      if (exitPressedOnce) {
        // Second press - exit app
        App.exitApp();
      } else {
        // First press - show toast
        setExitPressedOnce(true);
        setShowExitToast(true);

        // Reset after 2 seconds
        setTimeout(() => {
          setExitPressedOnce(false);
          setShowExitToast(false);
        }, 2000);
      }
    } else {
      // Not on home page - navigate back
      navigate(-1);
    }
  }, [location.pathname, exitPressedOnce, navigate]);

  useEffect(() => {
    // Register back button listener for Capacitor (Android)
    const backButtonListener = App.addListener('backButton', () => {
      // We handle all back navigation ourselves
      handleBackButton();
    });

    // Also handle browser back button for web testing
    const handlePopState = (e: PopStateEvent) => {
      if (location.pathname === '/') {
        e.preventDefault();
        handleBackButton();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      backButtonListener.then(listener => listener.remove());
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBackButton, location.pathname]);

  return (
    <AnimatePresence>
      {showExitToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-gray-800 text-white text-sm font-medium rounded-full shadow-lg"
        >
          뒤로가기를 한번 더 누르면 앱이 종료됩니다
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackHandler;
