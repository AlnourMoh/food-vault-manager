
import { useState, useEffect } from 'react';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        console.log("[useScannerInitialization] تهيئة الماسح الضوئي...");
        
        // فحص ما إذا كان يعمل في بيئة Capacitor
        if (window.Capacitor) {
          try {
            // تحقق مما إذا كانت طرق المسح متاحة
            let isPluginAvailable = false;
            
            // فحص MLKit أولاً
            if (window.Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
              console.log("[useScannerInitialization] ماسح MLKit متاح");
              isPluginAvailable = true;
              
              // استدعاء الوحدة للتحضير
              try {
                const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
                console.log("[useScannerInitialization] تم تحميل وحدة ماسح MLKit");
              } catch (mlkitError) {
                console.warn("[useScannerInitialization] خطأ في تحميل ماسح MLKit:", mlkitError);
              }
            }
            
            // فحص BarcodeScanner التقليدي إذا لم يكن MLKit متاحًا
            if (!isPluginAvailable && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
              console.log("[useScannerInitialization] ماسح الباركود التقليدي متاح");
              isPluginAvailable = true;
              
              // تحميل الوحدة للتحضير
              try {
                const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
                console.log("[useScannerInitialization] تم تحميل وحدة الماسح التقليدي");
                
                // التحقق من الإذن مسبقًا
                const permission = await BarcodeScanner.checkPermission({ force: false });
                console.log("[useScannerInitialization] حالة إذن الماسح:", permission);
              } catch (bsError) {
                console.warn("[useScannerInitialization] خطأ في تحميل الماسح التقليدي:", bsError);
              }
            }
            
            if (!isPluginAvailable) {
              console.log("[useScannerInitialization] لا يوجد ماسح متاح على هذا الجهاز");
            }
          } catch (supportError) {
            console.warn("[useScannerInitialization] خطأ في فحص دعم الماسح:", supportError);
          }
        } else {
          console.log("[useScannerInitialization] ليست بيئة Capacitor، سيتم استخدام وضع المحاكاة");
        }
        
        console.log("[useScannerInitialization] اكتملت تهيئة الماسح");
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
      // التنظيف الأساسي فقط هنا، بقية التنظيف في المكونات الأخرى
    };
  }, []);
  
  return { isInitializing };
};
