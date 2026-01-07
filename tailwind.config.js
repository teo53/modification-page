/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== 레거시 컬러 (기존 호환성 유지) =====
        background: '#111111',
        primary: {
          DEFAULT: '#E5C04B', // Bright Gold
          hover: '#D4AF37',
        },
        secondary: {
          DEFAULT: '#FF007F', // Pink
          hover: '#D9006C',
        },
        accent: '#1E1E1E',
        text: {
          main: '#FFFFFF',
          muted: '#CCCCCC',
        },

        // ===== 테마 기반 컬러 (CSS 변수 연결) =====
        // 이 컬러들은 data-theme 속성에 따라 자동으로 변경됩니다

        // 배경
        'theme-bg': {
          primary: 'var(--theme-bg-primary)',
          secondary: 'var(--theme-bg-secondary)',
          tertiary: 'var(--theme-bg-tertiary)',
          elevated: 'var(--theme-bg-elevated)',
        },

        // 표면 (카드, 패널)
        'theme-surface': {
          DEFAULT: 'var(--theme-surface-primary)',
          primary: 'var(--theme-surface-primary)',
          secondary: 'var(--theme-surface-secondary)',
          tertiary: 'var(--theme-surface-tertiary)',
          hover: 'var(--theme-surface-hover)',
          active: 'var(--theme-surface-active)',
        },

        // 테두리
        'theme-border': {
          DEFAULT: 'var(--theme-border-primary)',
          primary: 'var(--theme-border-primary)',
          secondary: 'var(--theme-border-secondary)',
          tertiary: 'var(--theme-border-tertiary)',
          focus: 'var(--theme-border-focus)',
          error: 'var(--theme-border-error)',
        },

        // 텍스트
        'theme-text': {
          DEFAULT: 'var(--theme-text-primary)',
          primary: 'var(--theme-text-primary)',
          secondary: 'var(--theme-text-secondary)',
          tertiary: 'var(--theme-text-tertiary)',
          disabled: 'var(--theme-text-disabled)',
          inverse: 'var(--theme-text-inverse)',
          link: 'var(--theme-text-link)',
        },

        // 브랜드 - Primary (골드)
        'theme-primary': {
          DEFAULT: 'var(--theme-primary)',
          light: 'var(--theme-primary-light)',
          dark: 'var(--theme-primary-dark)',
          hover: 'var(--theme-primary-hover)',
          active: 'var(--theme-primary-active)',
          muted: 'var(--theme-primary-muted)',
          bg: 'var(--theme-primary-bg)',
        },

        // 브랜드 - Secondary (핑크)
        'theme-secondary': {
          DEFAULT: 'var(--theme-secondary)',
          light: 'var(--theme-secondary-light)',
          dark: 'var(--theme-secondary-dark)',
          hover: 'var(--theme-secondary-hover)',
          active: 'var(--theme-secondary-active)',
          muted: 'var(--theme-secondary-muted)',
          bg: 'var(--theme-secondary-bg)',
        },

        // 시멘틱
        'theme-success': {
          DEFAULT: 'var(--theme-success)',
          light: 'var(--theme-success-light)',
          dark: 'var(--theme-success-dark)',
          bg: 'var(--theme-success-bg)',
        },
        'theme-warning': {
          DEFAULT: 'var(--theme-warning)',
          light: 'var(--theme-warning-light)',
          dark: 'var(--theme-warning-dark)',
          bg: 'var(--theme-warning-bg)',
        },
        'theme-error': {
          DEFAULT: 'var(--theme-error)',
          light: 'var(--theme-error-light)',
          dark: 'var(--theme-error-dark)',
          bg: 'var(--theme-error-bg)',
        },
        'theme-info': {
          DEFAULT: 'var(--theme-info)',
          light: 'var(--theme-info-light)',
          dark: 'var(--theme-info-dark)',
          bg: 'var(--theme-info-bg)',
        },

        // 프리미엄 등급
        'theme-vip': {
          primary: 'var(--theme-vip-primary)',
          secondary: 'var(--theme-vip-secondary)',
        },
        'theme-diamond': {
          primary: 'var(--theme-diamond-primary)',
          secondary: 'var(--theme-diamond-secondary)',
        },
        'theme-special': {
          primary: 'var(--theme-special-primary)',
          secondary: 'var(--theme-special-secondary)',
        },
      },

      // 테마 그림자
      boxShadow: {
        'theme-sm': 'var(--theme-shadow-sm)',
        'theme-md': 'var(--theme-shadow-md)',
        'theme-lg': 'var(--theme-shadow-lg)',
        'theme-xl': 'var(--theme-shadow-xl)',
        'theme-glow-primary': 'var(--theme-shadow-glow-primary)',
        'theme-glow-secondary': 'var(--theme-shadow-glow-secondary)',
      },

      fontFamily: {
        sans: ['"Noto Sans KR"', 'Roboto', 'sans-serif'],
      },

      // 테마 전환 애니메이션
      transitionProperty: {
        'theme': 'background-color, color, border-color, box-shadow',
      },
    },
  },
  plugins: [],
}
