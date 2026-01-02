import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lunaalba.app',
  appName: 'LunaAlba',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#0a0a0b',
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // We handle splash in React
      launchAutoHide: true,
      backgroundColor: '#0a0a0b',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
