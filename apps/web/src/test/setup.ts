// =============================================================================
// 📁 src/test/setup.ts
// 🧪 Vitest 테스트 설정
// =============================================================================

import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    }),
});

// Mock localStorage
const localStorageMock = {
    getItem: (_key: string) => null,
    setItem: (_key: string, _value: string) => { },
    removeItem: (_key: string) => { },
    clear: () => { },
    length: 0,
    key: (_index: number) => null,
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock window.dispatchEvent
window.dispatchEvent = () => true;

// Mock scrollTo
window.scrollTo = () => { };
