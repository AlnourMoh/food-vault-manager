
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useServerConnection = () => {
  const [isConnectedToServer, setIsConnectedToServer] = useState(true);
  const [serverCheckDone, setServerCheckDone] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [connectionTestInProgress, setConnectionTestInProgress] = useState(false);

  const checkServerConnection = useCallback(async () => {
    // Don't check too frequently (at most once every 5 seconds)
    const now = Date.now();
    if (now - lastCheckTime < 5000 && lastCheckTime !== 0) {
      console.log('Skipping server check - too soon since last check');
      return;
    }
    
    setLastCheckTime(now);
    
    if (!navigator.onLine) {
      console.log('Device is offline, skipping server connection check');
      setIsConnectedToServer(false);
      setServerCheckDone(true);
      return;
    }
    
    if (isChecking || connectionTestInProgress) {
      console.log('Already checking connection, skipping duplicate check');
      return;
    }
    
    setIsChecking(true);
    setConnectionTestInProgress(true);
    console.log('Checking server connection...');
    
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
      console.log(`Server responded in ${responseTime}ms`);
      
      // Wait at least 1.5 seconds to avoid flickering
      await new Promise(resolve => setTimeout(resolve, Math.max(0, 1500 - responseTime)));
      
      // Handle the response
      if ('error' in result && result.error) {
        console.error('Server connection check failed:', result.error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${result.error.message}`);
        setIsConnectedToServer(false);
      } else {
        console.log('Server connection check passed');
        setIsConnectedToServer(true);
        // Clear any previous error
        setErrorInfo('');
      }
    } catch (error) {
      console.error('Server connection check failed with exception:', error);
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
  }, [isChecking, connectionTestInProgress, lastCheckTime]);
  
  // Add a new retry function that returns true if connection is successful
  const retryServerConnection = useCallback(async (): Promise<boolean> => {
    if (isChecking || connectionTestInProgress) {
      console.log('Already checking connection, skipping retry');
      return false;
    }
    
    if (!navigator.onLine) {
      console.log('Device is offline, cannot retry connection');
      return false;
    }
    
    setIsChecking(true);
    setConnectionTestInProgress(true);
    console.log('Retrying server connection...');
    
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
      console.log(`Retry response time: ${responseTime}ms`);
      
      // Wait at least 1 second to avoid flickering
      await new Promise(resolve => setTimeout(resolve, Math.max(0, 1000 - responseTime)));
      
      // Handle the response
      if ('error' in result && result.error) {
        console.error('Retry server connection failed:', result.error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${result.error.message}`);
        setIsConnectedToServer(false);
        return false;
      } else {
        console.log('Server connection retry successful');
        setIsConnectedToServer(true);
        setErrorInfo('');
        return true;
      }
    } catch (error) {
      console.error('Server connection retry failed with exception:', error);
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
    console.log('Force reconnecting to server...');
    return await retryServerConnection();
  }, [retryServerConnection]);

  return {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    isChecking,
    checkServerConnection,
    retryServerConnection,
    forceReconnect
  };
};
