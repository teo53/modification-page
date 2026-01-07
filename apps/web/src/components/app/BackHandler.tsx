import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const TOAST_DURATION = 2000; // 2 seconds

const BackHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const exitPressedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleBackButton = useCallback(() => {
    const isHomePage = location.pathname === '/';

    if (isHomePage) {
      if (exitPressedRef.current) {
        // Second press within timeout - exit app
        App.exitApp();
      } else {
        // First press - show toast and set flag
        exitPressedRef.current = true;
        setShowToast(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Reset after TOAST_DURATION
        timeoutRef.current = setTimeout(() => {
          exitPressedRef.current = false;
          setShowToast(false);
        }, TOAST_DURATION);
      }
    } else {
      // Not on home page - navigate back
      navigate(-1);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Register back button listener for Capacitor (Android)
    let listenerHandle: { remove: () => void } | null = null;

    App.addListener('backButton', () => {
      handleBackButton();
    }).then((handle) => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [handleBackButton]);

  // Render toast using portal for proper z-index stacking
  const toast = (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm font-medium rounded-xl shadow-2xl border border-white/10"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">👆</span>
            <span>뒤로가기를 한번 더 누르면 종료됩니다</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to ensure toast renders at document body level
  return typeof document !== 'undefined'
    ? createPortal(toast, document.body)
    : null;
};

export default BackHandler;
