import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PenSquare, FileText, X } from 'lucide-react';

interface FABItem {
  icon: React.ElementType;
  label: string;
  path: string;
  color: string;
}

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fabItems: FABItem[] = [
    {
      icon: PenSquare,
      label: '광고 등록',
      path: '/post-ad',
      color: 'bg-primary',
    },
    {
      icon: FileText,
      label: '이력서 등록',
      path: '/post-resume',
      color: 'bg-purple-500',
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* FAB Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 z-50"
          >
            {fabItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                    transition: { delay: (fabItems.length - index - 1) * 0.05 }
                  }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <span className="bg-card text-text-main text-sm font-medium px-3 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap">
                      {item.label}
                    </span>
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 ${item.color} rounded-full shadow-lg flex items-center justify-center`}
                    >
                      <Icon size={22} className="text-white" />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-colors duration-300 ${
          isOpen ? 'bg-gray-700' : 'bg-primary'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X size={26} className="text-white" />
          ) : (
            <Plus size={26} className="text-white" />
          )}
        </motion.div>

        {/* Pulse Animation when closed */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
