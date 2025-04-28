
import { useState, useEffect } from 'react';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { setupScannerBackground } = useScannerUI();

  useEffect(() => {
    // تهيئة فورية - تفعيل الكاميرا مباشرة
    console.log("[useScannerInitialization] تهيئة فورية للماسح الضوئي والكاميرا");
    
    // نبدأ بتهيئة الماسح والكاميرا فوراً بدون تأخير
    setupScannerBackground()
      .then(() => {
        console.log("[useScannerInitialization] تم إعداد خلفية الماسح بنجاح");
        setIsInitializing(false);
      })
      .catch(error => {
        console.error("[useScannerInitialization] خطأ في إعداد الماسح:", error);
        setIsInitializing(false);
      });
    
    return () => {
      console.log("[useScannerInitialization] تنظيف موارد الماسح عند الإغلاق");
    };
  }, []);
  
  return { isInitializing: false }; // دائماً false لتسريع العملية
};
