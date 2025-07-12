import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    console.log('PWAInstallPrompt component mounted');

    // Clear any previous dismissal for testing
    sessionStorage.removeItem('pwa-install-dismissed'); // Uncomment for testing

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    console.log('iOS detected:', isIOSDevice);

    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone === true;
    setIsInStandaloneMode(isStandalone);
    console.log('Standalone mode:', isStandalone);

    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
      // Show the install prompt
      setShowInstallPrompt(true);
      setDebugInfo('Install prompt available (Chrome/Edge)');
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsInstallable(false);
      setDebugInfo('App installed successfully');
    };

    // Check installation status and show appropriate prompt
    if (isStandalone) {
      setDebugInfo('Already installed - running in standalone mode');
      setShowInstallPrompt(false);
    } else if (isIOSDevice) {
      setDebugInfo('iOS detected - manual installation available');
      setShowInstallPrompt(true);
      setIsInstallable(true);
    } else {
      setDebugInfo('Waiting for install prompt...');
      // Show manual install option after 2 seconds for non-iOS (reduced from 3)
      setTimeout(() => {
        if (!deferredPrompt && !isStandalone) {
          setDebugInfo('No auto-install prompt - manual installation available');
          setShowInstallPrompt(true);
          setIsInstallable(true);
        }
      }, 2000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // iOS-specific instructions
      const instructions = `To install VMS Guard on iOS:

1. Tap the Share button (□↗) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm

The app will appear on your home screen like a native app!`;
      
      alert(instructions);
      return;
    }

    if (!deferredPrompt) {
      // Manual install instructions for other browsers
      const instructions = `To install this app:

Chrome/Edge:
1. Click the three dots menu (⋮)
2. Select "Install VMS Guard"
3. Or look for the install icon in the address bar

Firefox:
1. Look for the install icon in the address bar
2. Or use the browser menu`;
      
      alert(instructions);
      return;
    }

    try {
      // Show the install prompt (Chrome/Edge)
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDebugInfo('User accepted install');
      } else {
        console.log('User dismissed the install prompt');
        setDebugInfo('User dismissed install');
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Install prompt error:', error);
      setDebugInfo('Install prompt error: ' + error.message);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Remember user dismissed it for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if user already dismissed it this session or if already installed
  if (sessionStorage.getItem('pwa-install-dismissed') || isInStandaloneMode) {
    console.log('PWA prompt hidden - dismissed or standalone');
    return null;
  }

  if (!showInstallPrompt) {
    console.log('PWA prompt hidden - showInstallPrompt is false');
    return null;
  }

  console.log('PWA prompt rendering');

  const getInstallMessage = () => {
    if (isIOS) {
      return "Tap the Share button (□↗) then 'Add to Home Screen'";
    }
    return "Add to your home screen for quick access";
  };

  const getButtonText = () => {
    if (isIOS) {
      return "🛡️ How to Install";
    }
    return isInstallable ? "🛡️ Install Now" : "🛡️ Install Help";
  };

  return (
    <Alert variant={isIOS ? "success" : "info"} className="m-3" dismissible onClose={handleDismiss}>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className="flex-grow-1">
          <strong>
            {isIOS ? "🍎 Install on iOS" : "🛡️ Install VMS Guard"}
          </strong>
          <br />
          <small>{getInstallMessage()}</small>
          <br />
          <small className="text-muted">Debug: {debugInfo}</small>
        </div>
        <Button 
          variant={isInstallable ? "primary" : "outline-primary"} 
          size="sm" 
          onClick={handleInstallClick}
          className="ms-2"
        >
          {getButtonText()}
        </Button>
      </div>
    </Alert>
  );
};

export default PWAInstallPrompt;
