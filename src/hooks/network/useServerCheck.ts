
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ServerCheckReturn {
  isConnectedToServer: boolean;
  serverCheckDone: boolean;
  errorInfo: string;
  checkServerConnection: () => Promise<void>;
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
      const startTime = Date.now();
      const { data, error } = await supabase.from('companies').select('count', { count: 'exact', head: true });
      const responseTime = Date.now() - startTime;
      
      console.log(`Server responded in ${responseTime}ms`);
      
      if (error) {
        console.error('Server connection check failed:', error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${error.message}`);
        setIsConnectedToServer(false);
      } else {
        console.log('Server connection check passed');
        setIsConnectedToServer(true);
      }
    } catch (error) {
      console.error('Server connection check failed with exception:', error);
      setErrorInfo(`استثناء أثناء الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      setIsConnectedToServer(false);
    } finally {
      setServerCheckDone(true);
    }
  };

  return {
    isConnectedToServer,
    serverCheckDone,
    errorInfo,
    checkServerConnection,
  };
};
