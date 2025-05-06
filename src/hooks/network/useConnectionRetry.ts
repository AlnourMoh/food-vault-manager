
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseConnectionRetryProps {
  isChecking: boolean;
  setIsChecking: (value: boolean) => void;
  connectionTestInProgress: boolean;
  setConnectionTestInProgress: (value: boolean) => void;
  incrementRetryCount: () => void;
  updateRetryTime: () => void;
  setIsConnectedToServer: (value: boolean) => void;
  setServerCheckDone: (value: boolean) => void;
  setErrorInfo: (value: string) => void;
  setLastCheckTime: (value: number) => void;
}

export const useConnectionRetry = ({
  isChecking,
  setIsChecking,
  connectionTestInProgress,
  setConnectionTestInProgress,
  incrementRetryCount,
  updateRetryTime,
  setIsConnectedToServer,
  setServerCheckDone,
  setErrorInfo,
  setLastCheckTime
}: UseConnectionRetryProps) => {
  const retryServerConnection = useCallback(async (): Promise<boolean> => {
    if (isChecking || connectionTestInProgress) {
      console.log('[useServerConnection] Already checking connection, skipping retry');
      return false;
    }
    
    if (!navigator.onLine) {
      console.log('[useServerConnection] Device is offline, cannot retry connection');
      return false;
    }
    
    setIsChecking(true);
    setConnectionTestInProgress(true);
    incrementRetryCount();
    updateRetryTime();
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
  }, [
    isChecking, 
    connectionTestInProgress, 
    incrementRetryCount, 
    updateRetryTime,
    setIsChecking,
    setConnectionTestInProgress,
    setIsConnectedToServer,
    setServerCheckDone,
    setErrorInfo,
    setLastCheckTime
  ]);

  return { retryServerConnection };
};
