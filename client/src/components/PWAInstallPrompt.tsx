import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed/running in standalone mode
    const checkStandalone = () => {
      const isStandaloneApp = window.matchMedia('(display-mode: standalone)').matches ||
                             (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneApp);
    };

    checkStandalone();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      
      // Don't show prompt immediately - wait for user engagement
      setTimeout(() => {
        if (!isStandalone) {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds of engagement
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation success
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install_success', {
          event_category: 'PWA',
          event_label: 'Salt & Scoville App Installed'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // Track installation attempt
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install_accepted', {
          event_category: 'PWA',
          event_label: 'Salt & Scoville Install Accepted'
        });
      }
    } else {
      console.log('User dismissed the install prompt');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install_dismissed', {
          event_category: 'PWA',
          event_label: 'Salt & Scoville Install Dismissed'
        });
      }
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Don't show again for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'PWA',
        event_label: 'Install Prompt Dismissed'
      });
    }
  };

  // Don't show if already installed, dismissed recently, or no prompt available
  if (isStandalone || !deferredPrompt || !showPrompt) {
    return null;
  }

  // Check if recently dismissed
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm mx-auto">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-flame-red/10 rounded-lg">
          <Smartphone className="w-5 h-5 text-flame-red" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Install Salt & Scoville App
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Get quick access to recipes, products, and FlavaDave recommendations
          </p>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-flame-red text-white text-xs font-medium rounded-md hover:bg-flame-red/90 transition-colors"
            >
              <Download className="w-3 h-3" />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Hook for programmatic PWA installation
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneApp = window.matchMedia('(display-mode: standalone)').matches ||
                             (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneApp);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return null;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setIsInstallable(false);
    
    return outcome;
  };

  return {
    isInstallable: isInstallable && !isStandalone,
    isStandalone,
    promptInstall
  };
}