
import { useState, useEffect } from 'react';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false); // بدء بـ false لتسريع التحميل

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        console.log("[useScannerInitialization] تهيئة سريعة للماسح الضوئي...");
        
        // تنتهي التهيئة على الفور تقريبًا للوصول إلى الكاميرا بشكل أسرع
        setIsInitializing(false);
      } catch (error) {
        console.error("[useScannerInitialization] خطأ في تهيئة الماسح:", error);
      } finally {
        // تنتهي التهيئة حتى في حالة الخطأ لتجنب التوقف
        setIsInitializing(false);
      }
    };
    
    // بدء عملية التهيئة
    initializeScanner();
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log("[useScannerInitialization] تنظيف موارد الماسح عند إلغاء التحميل");
    };
  }, []);
  
  return { isInitializing };
};
