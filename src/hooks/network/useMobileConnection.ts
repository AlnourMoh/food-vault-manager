
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
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
      setErrorTransitionActive(true);
      timeoutId = window.setTimeout(() => {
        setShowErrorScreen(true);
      }, 2000);
    } else if (isOnline && isConnectedToServer && serverCheckDone) {
      timeoutId = window.setTimeout(() => {
        setShowErrorScreen(false);
        setTimeout(() => {
          setErrorTransitionActive(false);
        }, 1000);
      }, 1500);
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
    showErrorScreen,
    errorTransitionActive,
    isInitialLoading,
    initialCheckDone,
    retryCount,
    handleRetry,
    checkServerConnection,
    setIsInitialLoading,
    setInitialCheckDone
  };
};
