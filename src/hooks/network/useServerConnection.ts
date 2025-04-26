
import { useServerCheck } from './useServerCheck';
import { useServerReconnect } from './useServerReconnect';

export const useServerConnection = () => {
  const {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    checkServerConnection,
  } = useServerCheck();

  useServerReconnect({ isConnectedToServer, serverCheckDone });

  return {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    checkServerConnection,
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
