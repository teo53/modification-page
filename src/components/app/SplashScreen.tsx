import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minimumDuration = 2000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');

  useEffect(() => {
    // Phase 1: Show logo
    const textTimer = setTimeout(() => setPhase('text'), 600);

    // Phase 2: Exit
    const exitTimer = setTimeout(() => setPhase('exit'), minimumDuration - 300);

    // Phase 3: Complete
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, minimumDuration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, minimumDuration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#111111]"
        >
          {/* Background Stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: phase === 'exit' ? 1.1 : 1,
              opacity: phase === 'exit' ? 0 : 1
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            className="relative"
          >
            {/* Moon Icon */}
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 512 512"
              initial={{ rotate: -30 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <defs>
                <linearGradient id="splash-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1a1a2e' }} />
                  <stop offset="100%" style={{ stopColor: '#111111' }} />
                </linearGradient>
                <linearGradient id="splash-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#D4AF37' }} />
                  <stop offset="100%" style={{ stopColor: '#F4CF47' }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Moon */}
              <motion.circle
                cx="256"
                cy="256"
                r="100"
                fill="url(#splash-gold)"
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              />
              <motion.circle
                cx="300"
                cy="220"
                r="70"
                fill="url(#splash-bg)"
                initial={{ scale: 0, x: 50 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              />

              {/* Stars */}
              {[
                { cx: 120, cy: 150, r: 6, delay: 0.6 },
                { cx: 400, cy: 130, r: 5, delay: 0.7 },
                { cx: 380, cy: 350, r: 4, delay: 0.8 },
                { cx: 150, cy: 380, r: 5, delay: 0.9 },
              ].map((star, i) => (
                <motion.circle
                  key={i}
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="#D4AF37"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ delay: star.delay, duration: 0.3 }}
                />
              ))}
            </motion.svg>
          </motion.div>

          {/* Brand Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase === 'text' || phase === 'exit' ? (phase === 'exit' ? 0 : 1) : 0,
              y: phase === 'text' ? 0 : 20
            }}
            transition={{ duration: 0.4 }}
            className="mt-8 text-center"
          >
            <h1 className="text-4xl font-bold">
              <span className="text-white">Luna</span>
              <span className="text-secondary">Alba</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'text' ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-text-muted text-sm mt-2"
            >
              밤의 일자리 구인구직
            </motion.p>
          </motion.div>

          {/* Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'text' ? 1 : 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-20"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Version */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 text-xs text-text-muted"
          >
            v1.0.0
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
