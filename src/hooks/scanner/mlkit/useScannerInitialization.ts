
import { useCallback } from 'react';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useScannerSupport } from './useScannerSupport';
import { useScannerPermission } from './useScannerPermission';

/**
 * هوك لتهيئة الماسح الضوئي
 */
export const useScannerInitialization = () => {
  const { checkScanningSupport } = useScannerSupport();
  const { ensurePermission } = useScannerPermission();

  // تهيئة الكاميرا
  const initializeCamera = useCallback(async () => {
    try {
      console.log("[useScannerInitialization] تهيئة الكاميرا...");
      
      // التحقق من دعم المسح
      const isSupported = await checkScanningSupport();
      if (!isSupported) {
        console.log("[useScannerInitialization] المسح غير مدعوم على هذا الجهاز");
        return false;
      }
      
      // التحقق من وضمان الحصول على أذونات الكاميرا
      const hasPermission = await ensurePermission();
      if (!hasPermission) {
        console.log("[useScannerInitialization] تم رفض إذن الكاميرا");
        
        // محاولة إظهار رسالة توجيهية للمستخدم
        try {
          await Toast.show({
            text: 'يرجى تفعيل إذن الكاميرا من إعدادات التطبيق للاستمرار',
            duration: 'long'
          });
        } catch (e) {}
        
        return false;
      }
      
      console.log("[useScannerInitialization] تحضير الماسح...");
      
      // تحضير الماسح
      await BarcodeScanner.prepare();
      console.log("[useScannerInitialization] تم تحضير الماسح بنجاح");
      
      return true;
    } catch (error) {
      console.error("[useScannerInitialization] خطأ في تهيئة الكاميرا:", error);
      
      // محاولة إظهار رسالة خطأ للمستخدم
      try {
        await Toast.show({
          text: `فشل في تهيئة الكاميرا: ${error.message || 'خطأ غير معروف'}`,
          duration: 'short'
        });
      } catch (e) {}
      
      return false;
    }
  }, [checkScanningSupport, ensurePermission]);

  return {
    initializeCamera
  };
};
