
import { useState, useEffect } from 'react';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // تبسيط كامل للتهيئة - لا نريد أي تأخير في بدء الماسح
    console.log("[useScannerInitialization] تهيئة فورية للماسح الضوئي");
    
    // نبدأ بدون حالة تحميل لتسريع عملية الفتح
    setIsInitializing(false);
    
    return () => {
      console.log("[useScannerInitialization] تنظيف موارد الماسح عند الإغلاق");
    };
  }, []);
  
  return { isInitializing };
};
