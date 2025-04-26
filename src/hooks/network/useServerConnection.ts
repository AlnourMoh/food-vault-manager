
import { useServerCheck } from './useServerCheck';
import { useServerReconnect } from './useServerReconnect';
import { useCallback } from 'react';

export const useServerConnection = () => {
  const {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    checkServerConnection,
    retryServerConnection
  } = useServerCheck();

  useServerReconnect({ isConnectedToServer, serverCheckDone });

  // Exposed function for force reconnection attempts
  const forceReconnect = useCallback(async () => {
    console.log('Force reconnect attempt initiated');
    const success = await retryServerConnection();
    return success;
  }, [retryServerConnection]);

  return {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    checkServerConnection,
    forceReconnect,
    setServerCheckDone: (value: boolean) => {
      // This is needed for backward compatibility with existing components
      console.log('Setting serverCheckDone:', value);
    },
    setIsConnectedToServer: (value: boolean) => {
      // This is needed for backward compatibility with existing components
      console.log('Setting isConnectedToServer:', value);
    }
  };
};
