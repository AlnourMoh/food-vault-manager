
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseConnectionCheckProps {
  isChecking: boolean;
  setIsChecking: (value: boolean) => void;
  connectionTestInProgress: boolean;
  setConnectionTestInProgress: (value: boolean) => void;
  lastCheckTime: number;
  setLastCheckTime: (value: number) => void;
  setIsConnectedToServer: (value: boolean) => void;
  setServerCheckDone: (value: boolean) => void;
  setErrorInfo: (value: string) => void;
}

export const useConnectionCheck = ({
  isChecking,
  setIsChecking,
  connectionTestInProgress,
  setConnectionTestInProgress,
  lastCheckTime,
  setLastCheckTime,
  setIsConnectedToServer,
  setServerCheckDone,
  setErrorInfo
}: UseConnectionCheckProps) => {
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
  }, [isChecking, connectionTestInProgress, lastCheckTime, setIsChecking, setConnectionTestInProgress, setLastCheckTime, setIsConnectedToServer, setServerCheckDone, setErrorInfo]);

  return { checkServerConnection };
};
