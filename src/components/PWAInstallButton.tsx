import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  const iOSSafari = iOS && webkit && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
  const macOSSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua) && /Macintosh/.test(ua);
  return iOSSafari || macOSSafari;
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Detect browser type
    setIsSafariBrowser(isSafari());
    setIsIOSDevice(isIOS());

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
      return;
    }

    // For Safari, always show the install button
    if (isSafari()) {
      setShowInstallButton(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install button
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      // Hide the install button when app is installed
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    if (!showInstructions) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.pwa-install-popover')) {
        setShowInstructions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showInstructions]);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click-outside from firing immediately

    // Safari: Show instructions
    if (isSafariBrowser) {
      setShowInstructions(!showInstructions);
      return;
    }

    // Chrome/Edge: Use native prompt
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="relative">
      <Button onClick={handleInstallClick} variant="default" size="sm" className="gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Install App
      </Button>

      {/* Safari Installation Instructions Popover */}
      {showInstructions && isSafariBrowser && (
        <div className="pwa-install-popover absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <button
            onClick={e => {
              e.stopPropagation();
              setShowInstructions(false);
            }}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="font-semibold text-foreground mb-3">Install App</h3>

          {isIOSDevice ? (
            // iOS Safari instructions
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">To install this app:</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  Tap the <span className="font-semibold">Share</span> button{' '}
                  <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                  </svg>
                </li>
                <li>
                  Scroll down and tap <span className="font-semibold">"Add to Home Screen"</span>
                </li>
                <li>
                  Tap <span className="font-semibold">"Add"</span> to confirm
                </li>
              </ol>
            </div>
          ) : (
            // macOS Safari instructions
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">To install this app:</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  Click <span className="font-semibold">File</span> in the menu bar
                </li>
                <li>
                  Select <span className="font-semibold">"Add to Dock"</span>
                </li>
              </ol>
              <p className="text-xs italic mt-3">Or use Chrome/Edge for one-click installation</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
