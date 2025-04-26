
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface ServerReconnectProps {
  isConnectedToServer: boolean;
  serverCheckDone: boolean;
}

export const useServerReconnect = ({ isConnectedToServer, serverCheckDone }: ServerReconnectProps): void => {
  useEffect(() => {
    if (isConnectedToServer && serverCheckDone) {
      toast({
        title: "تم استعادة الاتصال",
        description: "تم استعادة الاتصال بالخادم بنجاح",
      });
    }
  }, [isConnectedToServer, serverCheckDone]);
};
