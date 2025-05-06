
import { useEffect } from 'react';

interface UseAutoRetryProps {
  enableAutoRetry: boolean;
  isConnectedToServer: boolean;
  serverCheckDone: boolean;
  isChecking: boolean;
  retryCount: number;
  maxRetries: number;
  retryServerConnection: () => Promise<boolean>;
}

export const useAutoRetry = ({
  enableAutoRetry,
  isConnectedToServer,
  serverCheckDone,
  isChecking,
  retryCount,
  maxRetries,
  retryServerConnection
}: UseAutoRetryProps) => {
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
  }, [isConnectedToServer, serverCheckDone, isChecking, retryCount, enableAutoRetry, maxRetries, retryServerConnection]);
};
