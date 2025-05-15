
import { useState, useEffect } from 'react';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { setupScannerBackground } = useScannerUI();

  useEffect(() => {
    // محاولة تهيئة الماسح الضوئي مع معالجة أخطاء محسنة
    console.log("[useScannerInitialization] بدء تهيئة الماسح الضوئي");
    
    // وضع الكود في كتلة try-catch لتفادي انهيار التطبيق بسبب أخطاء غير متوقعة
    try {
      setIsInitializing(true);
      
      // تسجيل بيانات تشخيصية
      console.log("[useScannerInitialization] المنصة:", window.Capacitor?.getPlatform());
      console.log("[useScannerInitialization] هل هي بيئة أصلية؟", window.Capacitor?.isNativePlatform());
      
      // نستخدم Promise.resolve().then() لتأخير تنفيذ الكود بشكل طفيف
      // هذا يساعد في تجنب مشاكل التوقيت المحتملة في دورة حياة المكون
      Promise.resolve().then(() => {
        return setupScannerBackground()
          .then(() => {
            console.log("[useScannerInitialization] تم إعداد خلفية الماسح بنجاح");
            setIsInitializing(false);
          })
          .catch(error => {
            console.error("[useScannerInitialization] خطأ في إعداد الماسح:", error);
            // على الرغم من حدوث خطأ، نحدد isInitializing إلى false
            // للسماح للمستخدم بالمتابعة وتجربة الإدخال اليدوي
            setIsInitializing(false);
            
            // يمكن أيضًا إضافة حدث تتبع الخطأ هنا لتسجيل المشكلة
          });
      });
    } catch (error) {
      console.error("[useScannerInitialization] خطأ غير متوقع أثناء تهيئة الماسح:", error);
      setIsInitializing(false);
    }
    
    return () => {
      console.log("[useScannerInitialization] تنظيف موارد الماسح عند الإغلاق");
      // تنظيف الموارد هنا إذا لزم الأمر
    };
  }, []);
  
  // نعيد isInitializing بشكل صحيح
  return { 
    isInitializing 
  };
};
