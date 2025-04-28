
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ServerConnectionOptions {
  enableAutoRetry?: boolean;
  maxRetries?: number;
  initialCheckDelay?: number;
}

export const useServerConnection = (options: ServerConnectionOptions = {}) => {
  const {
    enableAutoRetry = true,
    maxRetries = 3,
    initialCheckDelay = 1000
  } = options;

  const [isConnectedToServer, setIsConnectedToServer] = useState(true);
  const [serverCheckDone, setServerCheckDone] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [connectionTestInProgress, setConnectionTestInProgress] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState(0);
  
  // Auto-retry mechanism
  useEffect(() => {
    let retryTimer: number | undefined;
    
    // Only attempt auto-retry if explicitly enabled AND we have a connection problem
    if (enableAutoRetry && !isConnectedToServer && serverCheckDone && !isChecking && navigator.onLine && retryCount < maxRetries) {
      // Calculate exponential backoff delay (1s, 2s, 4s, 8s, etc.)
      const backoffDelay = Math.min(30000, 1000 * Math.pow(2, retryCount));
      
      console.log(`[useServerConnection] Will auto-retry in ${backoffDelay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      
      retryTimer = window.setTimeout(() => {
        console.log(`[useServerConnection] Auto-retry attempt #${retryCount + 1}`);
        retryServerConnection();
      }, backoffDelay);
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [isConnectedToServer, serverCheckDone, isChecking, retryCount, enableAutoRetry, maxRetries]);

  // Initial connection check with delay to ensure app is fully loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!serverCheckDone && navigator.onLine) {
        console.log('[useServerConnection] Performing initial server connection check');
        checkServerConnection();
      }
    }, initialCheckDelay);
    
    return () => clearTimeout(timer);
  }, []);

  const checkServerConnection = useCallback(async () => {
    // Don't check too frequently (at most once every 5 seconds)
    const now = Date.now();
    if (now - lastCheckTime < 5000 && lastCheckTime !== 0) {
      console.log('[useServerConnection] Skipping server check - too soon since last check');
      return;
    }
    
    setLastCheckTime(now);
    
    if (!navigator.onLine) {
      console.log('[useServerConnection] Device is offline, skipping server connection check');
      setIsConnectedToServer(false);
      setServerCheckDone(true);
      return;
    }
    
    if (isChecking || connectionTestInProgress) {
      console.log('[useServerConnection] Already checking connection, skipping duplicate check');
      return;
    }
    
    setIsChecking(true);
    setConnectionTestInProgress(true);
    console.log('[useServerConnection] Checking server connection...');
    
    try {
      // Set up a timeout for the request
      const timeoutDuration = 10000; // 10 seconds
      
      const startTime = Date.now();
      
      // Use Promise.race to implement timeout
      const result = await Promise.race([
        supabase.from('companies').select('count', { count: 'exact', head: true }),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timed out after 10 seconds'));
          }, timeoutDuration);
        })
      ]);
      
      const responseTime = Date.now() - startTime;
      console.log(`[useServerConnection] Server responded in ${responseTime}ms`);
      
      // Wait at least 1.5 seconds to avoid flickering
      await new Promise(resolve => setTimeout(resolve, Math.max(0, 1500 - responseTime)));
      
      // Handle the response
      if ('error' in result && result.error) {
        console.error('[useServerConnection] Server connection check failed:', result.error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${result.error.message}`);
        setIsConnectedToServer(false);
      } else {
        console.log('[useServerConnection] Server connection check passed');
        setIsConnectedToServer(true);
        // Clear any previous error
        setErrorInfo('');
      }
    } catch (error) {
      console.error('[useServerConnection] Server connection check failed with exception:', error);
      setErrorInfo(`استثناء أثناء الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      setIsConnectedToServer(false);
    } finally {
      setIsChecking(false);
      setServerCheckDone(true);
      // Add a small delay before allowing another connection test
      setTimeout(() => {
        setConnectionTestInProgress(false);
      }, 2000);
    }
  }, [isChecking, connectionTestInProgress, lastCheckTime, initialCheckDelay]);
  
  // Retry connection function with improved error handling
  const retryServerConnection = useCallback(async (): Promise<boolean> => {
    if (isChecking || connectionTestInProgress) {
      console.log('[useServerConnection] Already checking connection, skipping retry');
      return false;
    }
    
    if (!navigator.onLine) {
      console.log('[useServerConnection] Device is offline, cannot retry connection');
      toast({
        variant: "destructive",
        title: "أنت غير متصل بالإنترنت",
        description: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى"
      });
      return false;
    }
    
    setIsChecking(true);
    setConnectionTestInProgress(true);
    setRetryCount(prev => prev + 1);
    setLastRetryTime(Date.now());
    console.log('[useServerConnection] Retrying server connection...');
    
    try {
      // Set up a timeout for the request
      const timeoutDuration = 10000; // 10 seconds
      
      // Use a simple and fast query to check connection
      const startTime = Date.now();
      
      // Use Promise.race to implement timeout
      const result = await Promise.race([
        supabase.from('companies').select('count', { count: 'exact', head: true }).limit(1),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timed out after 10 seconds'));
          }, timeoutDuration);
        })
      ]);
      
      const responseTime = Date.now() - startTime;
      console.log(`[useServerConnection] Retry response time: ${responseTime}ms`);
      
      // Wait at least 1 second to avoid flickering
      await new Promise(resolve => setTimeout(resolve, Math.max(0, 1000 - responseTime)));
      
      // Handle the response
      if ('error' in result && result.error) {
        console.error('[useServerConnection] Retry server connection failed:', result.error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${result.error.message}`);
        setIsConnectedToServer(false);
        return false;
      } else {
        console.log('[useServerConnection] Server connection retry successful');
        setIsConnectedToServer(true);
        setErrorInfo('');
        return true;
      }
    } catch (error) {
      console.error('[useServerConnection] Server connection retry failed with exception:', error);
      setErrorInfo(`استثناء أثناء الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      setIsConnectedToServer(false);
      return false;
    } finally {
      setIsChecking(false);
      setServerCheckDone(true);
      setLastCheckTime(Date.now());
      // Add a small delay before allowing another connection test
      setTimeout(() => {
        setConnectionTestInProgress(false);
      }, 2000);
    }
  }, [isChecking, connectionTestInProgress]);

  // Add the forceReconnect method that's being used in MobileApp and MobileInventory
  const forceReconnect = useCallback(async (): Promise<boolean> => {
    console.log('[useServerConnection] Force reconnecting to server...');
    
    try {
      // More granular status updates during reconnection
      toast({
        title: "جاري التحقق من الاتصال",
        description: "محاولة الاتصال بالخادم..."
      });
      
      // Try different endpoints if the default doesn't work
      let connected = await retryServerConnection();
      
      if (!connected) {
        // Try a different endpoint as a fallback
        toast({
          title: "جاري المحاولة مرة أخرى",
          description: "استخدام نقطة وصول بديلة..."
        });
        
        try {
          // Try a direct connection using the Capacitor HTTP plugin if available
          if (window.Capacitor && window.Capacitor.isPluginAvailable('CapacitorHttp')) {
            const { CapacitorHttp } = await import('@capacitor/core');
            const response = await CapacitorHttp.get({ 
              url: 'https://qcztrnwvzzabitndicig.supabase.co/health',
              connectTimeout: 10000
            });
            
            if (response.status === 200) {
              console.log('[useServerConnection] Alternate connection successful');
              connected = true;
              setIsConnectedToServer(true);
              setErrorInfo('');
            }
          }
        } catch (e) {
          console.error('[useServerConnection] Alternative connection method failed:', e);
        }
      }
      
      return connected;
    } catch (error) {
      console.error('[useServerConnection] Force reconnect failed:', error);
      
      toast({
        variant: "destructive",
        title: "فشل الاتصال",
        description: "تعذر الاتصال بالخادم. يرجى المحاولة لاحقًا."
      });
      
      return false;
    }
  }, [retryServerConnection]);

  // Reset retry count when connection is restored
  useEffect(() => {
    if (isConnectedToServer) {
      setRetryCount(0);
    }
  }, [isConnectedToServer]);

  return {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    isChecking,
    checkServerConnection,
    retryServerConnection,
    forceReconnect,
    retryCount
  };
};
