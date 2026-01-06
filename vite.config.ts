import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI 라이브러리
          'vendor-ui': ['framer-motion', 'lucide-react', 'recharts'],
          // 에디터 관련
          'vendor-editor': ['react-quill-new', 'quill'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'backend'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', 'src/test', '**/*.d.ts'],
    },
  },
})
