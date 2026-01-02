import React, { useState, useEffect } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS install instructions after a delay
      setTimeout(() => setShowPrompt(true), 5000);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] animate-slide-up">
      <div className="bg-accent border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🌙</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">앱 설치하기</h3>
                <button
                  onClick={handleDismiss}
                  className="text-text-muted hover:text-white transition-colors p-1 -mr-1"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-text-muted mt-1">
                LunaAlba를 앱으로 설치하고 더 빠르게 이용하세요!
              </p>
            </div>
          </div>

          {isIOS ? (
            /* iOS Installation Instructions */
            <div className="mt-4 bg-white/5 rounded-lg p-3">
              <p className="text-xs text-text-muted mb-2">iOS에서 설치하려면:</p>
              <ol className="space-y-2 text-sm text-white">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">1</span>
                  <Share size={16} className="text-primary" />
                  <span>공유 버튼 탭</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">2</span>
                  <Plus size={16} className="text-primary" />
                  <span>"홈 화면에 추가" 선택</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Android/Desktop Install Button */
            <button
              onClick={handleInstall}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors"
            >
              <Download size={20} />
              <span>지금 설치하기</span>
            </button>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-surface px-4 py-3 flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="text-green-400">✓</span> 오프라인 사용
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-400">✓</span> 빠른 로딩
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-400">✓</span> 푸시 알림
          </span>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
