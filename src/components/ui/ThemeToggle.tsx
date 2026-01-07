import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
        isDark
          ? 'bg-accent hover:bg-surface text-text-main'
          : 'bg-surface hover:bg-border text-text-main'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-blue-500" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? '라이트 모드' : '다크 모드'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
