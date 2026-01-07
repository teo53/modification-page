/* =============================================================================
 * 🎨 THEME CONTEXT - 테마 컨텍스트
 * =============================================================================
 * 다크 모드와 라이트 모드 전환을 관리합니다.
 * localStorage에 사용자 선호도를 저장하고 시스템 설정을 따를 수 있습니다.
 * ============================================================================= */

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// 테마 타입 정의
export type Theme = 'dark' | 'light';
export type ThemePreference = Theme | 'system';

interface ThemeContextType {
  // 현재 적용된 테마 (실제 dark 또는 light)
  theme: Theme;
  // 사용자 설정 (dark, light, 또는 system)
  preference: ThemePreference;
  // 테마 변경 함수
  setTheme: (preference: ThemePreference) => void;
  // 테마 토글 (dark <-> light)
  toggleTheme: () => void;
  // 다크 모드 여부
  isDark: boolean;
  // 라이트 모드 여부
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// localStorage 키
const THEME_STORAGE_KEY = 'theme-preference';

// 시스템 테마 감지
const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // 기본값
};

// 저장된 테마 설정 불러오기
const getSavedPreference = (): ThemePreference => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved;
    }
  }
  return 'dark'; // 기본값: 다크 모드
};

// 실제 테마 결정
const resolveTheme = (preference: ThemePreference): Theme => {
  if (preference === 'system') {
    return getSystemTheme();
  }
  return preference;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark'
}) => {
  // 초기 상태 설정 (SSR 대응)
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window !== 'undefined') {
      return getSavedPreference();
    }
    return defaultTheme;
  });

  const [theme, setThemeState] = useState<Theme>(() => resolveTheme(preference));

  // DOM에 테마 적용
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;

    // data-theme 속성 설정
    root.setAttribute('data-theme', newTheme);

    // meta 태그 업데이트 (모바일 브라우저 상태바 색상)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#111111' : '#FFFFFF');
    }

    // color-scheme 설정
    root.style.colorScheme = newTheme;
  }, []);

  // 테마 변경 함수
  const setTheme = useCallback((newPreference: ThemePreference) => {
    setPreference(newPreference);
    localStorage.setItem(THEME_STORAGE_KEY, newPreference);

    const resolvedTheme = resolveTheme(newPreference);
    setThemeState(resolvedTheme);
    applyTheme(resolvedTheme);
  }, [applyTheme]);

  // 테마 토글
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // 초기 테마 적용
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // 시스템 테마 변경 감지 (preference가 'system'일 때만)
  useEffect(() => {
    if (preference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setThemeState(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference, applyTheme]);

  const value: ThemeContextType = {
    theme,
    preference,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 커스텀 훅
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 테마 토글 버튼 컴포넌트
export const ThemeToggle: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-300
        bg-theme-surface hover:bg-theme-surface-secondary
        border border-theme-primary
        text-theme-primary
        ${className}
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`현재: ${theme === 'dark' ? '다크' : '라이트'} 모드 (클릭하여 전환)`}
    >
      {theme === 'dark' ? (
        // 해 아이콘 (라이트 모드로 전환)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        // 달 아이콘 (다크 모드로 전환)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

// 테마 선택 드롭다운 컴포넌트
export const ThemeSelector: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { preference, setTheme } = useTheme();

  const options: { value: ThemePreference; label: string; icon: string }[] = [
    { value: 'light', label: '라이트 모드', icon: '☀️' },
    { value: 'dark', label: '다크 모드', icon: '🌙' },
    { value: 'system', label: '시스템 설정', icon: '💻' },
  ];

  return (
    <select
      value={preference}
      onChange={(e) => setTheme(e.target.value as ThemePreference)}
      className={`
        input-theme
        px-3 py-2 rounded-lg
        cursor-pointer
        ${className}
      `}
      aria-label="테마 선택"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.icon} {option.label}
        </option>
      ))}
    </select>
  );
};

export default ThemeContext;
