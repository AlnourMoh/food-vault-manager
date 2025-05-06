
import { useEffect } from 'react';
import { useConnectionState } from './useConnectionState';
import { useRetryState } from './useRetryState';
import { useConnectionCheck } from './useConnectionCheck';
import { useConnectionRetry } from './useConnectionRetry';
import { useAutoRetry } from './useAutoRetry';
import { useForceReconnect } from './useForceReconnect';

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

  // Use our extracted hooks
  const {
    isConnectedToServer,
    setIsConnectedToServer,
    serverCheckDone,
    setServerCheckDone,
    errorInfo,
    setErrorInfo,
    isChecking,
    setIsChecking,
    lastCheckTime,
    setLastCheckTime,
    connectionTestInProgress,
    setConnectionTestInProgress
  } = useConnectionState();

  const {
    retryCount,
    lastRetryTime,
    resetRetryCount,
    incrementRetryCount,
    updateRetryTime
  } = useRetryState();

  const { checkServerConnection } = useConnectionCheck({
    isChecking,
    setIsChecking,
    connectionTestInProgress,
    setConnectionTestInProgress,
    lastCheckTime,
    setLastCheckTime,
    setIsConnectedToServer,
    setServerCheckDone,
    setErrorInfo
  });

  const { retryServerConnection } = useConnectionRetry({
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
  });

  const { forceReconnect } = useForceReconnect({
    retryServerConnection,
    setIsConnectedToServer,
    setErrorInfo
  });

  // Initial connection check with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!serverCheckDone && navigator.onLine) {
        console.log('[useServerConnection] Performing initial server connection check');
        checkServerConnection();
      }
    }, initialCheckDelay);
    
    return () => clearTimeout(timer);
  }, [checkServerConnection, serverCheckDone, initialCheckDelay]);

  // Setup auto-retry mechanism
  useAutoRetry({
    enableAutoRetry,
    isConnectedToServer,
    serverCheckDone,
    isChecking,
    retryCount,
    maxRetries,
    retryServerConnection
  });

  // Reset retry count when connection is restored
  useEffect(() => {
    if (isConnectedToServer) {
      resetRetryCount();
    }
  }, [isConnectedToServer, resetRetryCount]);

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
