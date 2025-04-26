
import { useState, useEffect } from 'react';

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState<string>('');
  
  useEffect(() => {
    const gatherNetworkInfo = () => {
      const info = [];
      info.push(`متصل بالإنترنت: ${navigator.onLine ? 'نعم' : 'لا'}`);
      info.push(`وقت الفحص: ${new Date().toLocaleTimeString()}`);
      
      if ('connection' in navigator && navigator.connection) {
        const conn = navigator.connection as any;
        if (conn.effectiveType) {
          info.push(`نوع الاتصال: ${conn.effectiveType}`);
        }
        if (conn.downlink) {
          info.push(`سرعة التحميل: ${conn.downlink} Mbps`);
        }
        if (conn.rtt) {
          info.push(`وقت الاستجابة: ${conn.rtt} ms`);
        }
      }
      
      setNetworkInfo(info.join('\n'));
    };
    
    gatherNetworkInfo();
    
    window.addEventListener('online', gatherNetworkInfo);
    window.addEventListener('offline', gatherNetworkInfo);
    
    return () => {
      window.removeEventListener('online', gatherNetworkInfo);
      window.removeEventListener('offline', gatherNetworkInfo);
    };
  }, []);

  return networkInfo;
};
