import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lunaalba.app',
  appName: 'LunaAlba',
  // Points to the web app build output
  webDir: '../web/dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0a0a0b',
    allowMixedContent: true,
    // Android WebView 설정
    overScrollMode: 'never',
  },
  ios: {
    backgroundColor: '#0a0a0b',
    // iOS WebView 스크롤 바운스 비활성화
    contentInset: 'never',
    scrollEnabled: true,
    // iOS 스크롤 bounce 비활성화
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#0a0a0b',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      iosSpinnerStyle: 'small',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // iOS 스크롤 behavior 관련 추가 설정
    WebView: {
      // iOS 스크롤 튕김 방지
      allowsBackForwardNavigationGestures: false,
    },
  },
};

export default config;
