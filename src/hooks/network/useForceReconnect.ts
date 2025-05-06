
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseForceReconnectProps {
  retryServerConnection: () => Promise<boolean>;
  setIsConnectedToServer: (value: boolean) => void;
  setErrorInfo: (value: string) => void;
}

export const useForceReconnect = ({
  retryServerConnection,
  setIsConnectedToServer,
  setErrorInfo
}: UseForceReconnectProps) => {
  const forceReconnect = useCallback(async (): Promise<boolean> => {
    console.log('[useServerConnection] Force reconnecting to server...');
    
    try {
      // More granular status updates during reconnection
      toast({
        title: "جاري التحقق من الاتصال",
        description: "محاولة الاتصال بالخادم..."
      });
      
      // Try different endpoints if the default doesn't work
      let connected = await retryServerConnection();
      
      if (!connected) {
        // Try a different endpoint as a fallback
        toast({
          title: "جاري المحاولة مرة أخرى",
          description: "استخدام نقطة وصول بديلة..."
        });
        
        try {
          // Try a direct connection using the Capacitor HTTP plugin if available
          if (window.Capacitor && window.Capacitor.isPluginAvailable('CapacitorHttp')) {
            const { CapacitorHttp } = await import('@capacitor/core');
            const response = await CapacitorHttp.get({ 
              url: 'https://qcztrnwvzzabitndicig.supabase.co/health',
              connectTimeout: 10000
            });
            
            if (response.status === 200) {
              console.log('[useServerConnection] Alternate connection successful');
              connected = true;
              setIsConnectedToServer(true);
              setErrorInfo('');
            }
          }
        } catch (e) {
          console.error('[useServerConnection] Alternative connection method failed:', e);
        }
      }
      
      return connected;
    } catch (error) {
      console.error('[useServerConnection] Force reconnect failed:', error);
      
      toast({
        variant: "destructive",
        title: "فشل الاتصال",
        description: "تعذر الاتصال بالخادم. يرجى المحاولة لاحقًا."
      });
      
      return false;
    }
  }, [retryServerConnection, setIsConnectedToServer, setErrorInfo]);

  return { forceReconnect };
};
