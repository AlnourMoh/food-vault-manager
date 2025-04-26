
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
  // Always start with initialCheckDone as true to prevent loading screens
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(true);
  
  // These state variables are now always false to never show the error screen
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorTransitionActive, setErrorTransitionActive] = useState(false);

  // Handle the retry functionality without showing error screens
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
    // Always return false for these values to prevent error screen from showing
    showErrorScreen: false,
    errorTransitionActive: false,
    isInitialLoading,
    initialCheckDone,
    retryCount,
    handleRetry,
    checkServerConnection,
    setIsInitialLoading,
    setInitialCheckDone
  };
};
