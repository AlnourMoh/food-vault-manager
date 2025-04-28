
import { useState, useCallback } from 'react';

interface UseDebugInfoReturn {
  showDebugInfo: boolean;
  setShowDebugInfo: (value: boolean) => void;
  toggleDebugInfo: () => void;
  collectDebugInfo: () => object;
}

export const useDebugInfo = (): UseDebugInfoReturn => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const toggleDebugInfo = useCallback(() => {
    setShowDebugInfo(prev => !prev);
  }, []);
  
  const collectDebugInfo = useCallback(() => {
    // Get various information about the environment
    return {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
      languages: navigator.languages,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      url: window.location.href,
      referrer: document.referrer,
      timezoneOffset: new Date().getTimezoneOffset(),
      capacitorAvailable: typeof window.Capacitor !== 'undefined',
    };
  }, []);

  return {
    showDebugInfo,
    setShowDebugInfo,
    toggleDebugInfo,
    collectDebugInfo
  };
};
