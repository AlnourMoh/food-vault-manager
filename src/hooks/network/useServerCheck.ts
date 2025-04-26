
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ServerCheckReturn {
  isConnectedToServer: boolean;
  serverCheckDone: boolean;
  errorInfo: string;
  checkServerConnection: () => Promise<void>;
  retryServerConnection: () => Promise<boolean>;
}

export const useServerCheck = (): ServerCheckReturn => {
  const [isConnectedToServer, setIsConnectedToServer] = useState(true);
  const [serverCheckDone, setServerCheckDone] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');

  const checkServerConnection = async () => {
    if (!navigator.onLine) {
      console.log('Device is offline, skipping server connection check');
      setIsConnectedToServer(false);
      setServerCheckDone(true);
      return;
    }
    
    console.log('Checking server connection...');
    try {
      // Set up a timeout for the request
      const timeoutDuration = 5000; // 5 seconds
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), timeoutDuration);
      
      const startTime = Date.now();
      const { data, error } = await Promise.race([
        supabase.from('companies').select('count', { count: 'exact', head: true }),
        new Promise<{data: null, error: Error}>((_, reject) => {
          setTimeout(() => {
            reject({ data: null, error: new Error('Request timed out') });
          }, timeoutDuration);
        })
      ]);
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      console.log(`Server responded in ${responseTime}ms`);
      
      if (error) {
        console.error('Server connection check failed:', error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${error.message}`);
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
      setServerCheckDone(true);
    }
  };
  
  // Add a new retry function that returns true if connection is successful
  const retryServerConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) {
      console.log('Device is offline, cannot retry connection');
      return false;
    }
    
    console.log('Retrying server connection...');
    try {
      // Set up a timeout for the request
      const timeoutDuration = 5000; // 5 seconds
      
      // Use a simple and fast query to check connection
      const startTime = Date.now();
      const { data, error } = await Promise.race([
        supabase.from('companies').select('count', { count: 'exact', head: true }).limit(1),
        new Promise<{data: null, error: Error}>((_, reject) => {
          setTimeout(() => {
            reject({ data: null, error: new Error('Request timed out') });
          }, timeoutDuration);
        })
      ]);
      
      const responseTime = Date.now() - startTime;
      console.log(`Retry response time: ${responseTime}ms`);
      
      if (error) {
        console.error('Retry server connection failed:', error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${error.message}`);
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
      setServerCheckDone(true);
    }
  }, []);

  return {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    checkServerConnection,
    retryServerConnection
  };
};
