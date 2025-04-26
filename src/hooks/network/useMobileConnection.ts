import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useServerConnection } from './useServerConnection';
import { toast } from '../use-toast';

export const useMobileConnection = () => {
  const { isOnline } = useNetworkStatus();
  const { 
    isConnectedToServer, 
    serverCheckDone, 
    errorInfo,
    isChecking,
    checkServerConnection,
    forceReconnect 
  } = useServerConnection();
  
  const [retryCount, setRetryCount] = useState(0);
  // Start with these both as false to prevent loading screens
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(true);
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorTransitionActive, setErrorTransitionActive] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isRestaurantLogin') === 'true';

  useEffect(() => {
    // For authenticated users, never show error screen
    if (isAuthenticated) {
      setShowErrorScreen(false);
      setErrorTransitionActive(false);
      return;
    }

    let timeoutId: number | undefined;
    
    if (!isOnline || (!isConnectedToServer && serverCheckDone)) {
      // Still track connection state but don't show error screen
      timeoutId = window.setTimeout(() => {
        // Always keep showErrorScreen as false for better UX
        setShowErrorScreen(false);
      }, 2000);
    } else if (isOnline && isConnectedToServer && serverCheckDone) {
      timeoutId = window.setTimeout(() => {
        setShowErrorScreen(false);
        setTimeout(() => {
          setErrorTransitionActive(false);
        }, 500);
      }, 500);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOnline, isConnectedToServer, serverCheckDone, isAuthenticated]);

  const handleRetry = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    
    toast({
      title: "إعادة محاولة الاتصال",
      description: "جاري التحقق من الاتصال بالخادم...",
    });
    
    const success = await forceReconnect();
    
    if (success) {
      toast({
        title: "تم الاتصال بنجاح",
        description: "تم استعادة الاتصال بالخادم بنجاح",
      });
    }
  }, [forceReconnect]);

  return {
    isOnline,
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    isChecking,
    showErrorScreen: false, // Always return false to hide error screen
    errorTransitionActive: false, // Always disable transition
    isInitialLoading,
    initialCheckDone,
    retryCount,
    handleRetry,
    checkServerConnection,
    setIsInitialLoading,
    setInitialCheckDone
  };
};
