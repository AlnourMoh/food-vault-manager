
import { useState } from 'react';

interface ConnectionState {
  isConnectedToServer: boolean;
  serverCheckDone: boolean;
  errorInfo: string;
  isChecking: boolean;
  connectionTestInProgress: boolean;
  lastCheckTime: number;
}

export const useConnectionState = () => {
  const [isConnectedToServer, setIsConnectedToServer] = useState(true);
  const [serverCheckDone, setServerCheckDone] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [connectionTestInProgress, setConnectionTestInProgress] = useState(false);

  return {
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
  };
};
