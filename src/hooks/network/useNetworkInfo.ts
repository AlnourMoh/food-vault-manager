
import { useState, useEffect } from 'react';

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState<string>('');
  
  useEffect(() => {
    const gatherNetworkInfo = () => {
      const info = [];
      
      // Basic connection status
      info.push(`حالة الاتصال: ${navigator.onLine ? 'متصل ✓' : 'غير متصل ✗'}`);
      info.push(`وقت الفحص: ${new Date().toLocaleTimeString()}`);
      
      // Page URL information
      info.push(`عنوان URL: ${window.location.href}`);
      info.push(`اسم المضيف: ${window.location.hostname}`);
      
      // Network information if available
      if ('connection' in navigator && navigator.connection) {
        const conn = navigator.connection as any;
        info.push('--- معلومات الشبكة ---');
        
        if (conn.effectiveType) {
          info.push(`نوع الاتصال: ${conn.effectiveType.toUpperCase()}`);
        }
        
        if (conn.downlink) {
          info.push(`سرعة التحميل: ${conn.downlink} Mbps`);
        }
        
        if (conn.rtt) {
          info.push(`وقت الاستجابة: ${conn.rtt} ms`);
        }
        
        if (typeof conn.saveData !== 'undefined') {
          info.push(`وضع توفير البيانات: ${conn.saveData ? 'مفعل' : 'غير مفعل'}`);
        }
        
        if (typeof conn.type !== 'undefined') {
          const connectionTypes: Record<string, string> = {
            'bluetooth': 'بلوتوث',
            'cellular': 'شبكة الجوال',
            'ethernet': 'إيثرنت',
            'wifi': 'واي فاي',
            'wimax': 'واي ماكس',
            'none': 'لا يوجد اتصال',
            'other': 'نوع آخر',
            'unknown': 'غير معروف'
          };
          info.push(`نوع الاتصال: ${connectionTypes[conn.type] || conn.type}`);
        }
      }
      
      // Current API server
      try {
        const apiUrl = localStorage.getItem('apiUrl') || 'الافتراضي';
        info.push(`عنوان API: ${apiUrl}`);
      } catch (e) {
        info.push('تعذر قراءة عنوان API');
      }
      
      // App version if available
      try {
        const appVersion = localStorage.getItem('appVersion') || 'غير معروف';
        info.push(`إصدار التطبيق: ${appVersion}`);
      } catch (e) {
        // Ignore errors
      }
      
      setNetworkInfo(info.join('\n'));
    };
    
    gatherNetworkInfo();
    
    window.addEventListener('online', gatherNetworkInfo);
    window.addEventListener('offline', gatherNetworkInfo);
    
    // Refresh network info every 10 seconds
    const intervalId = setInterval(gatherNetworkInfo, 10000);
    
    return () => {
      window.removeEventListener('online', gatherNetworkInfo);
      window.removeEventListener('offline', gatherNetworkInfo);
      clearInterval(intervalId);
    };
  }, []);

  return networkInfo;
};
