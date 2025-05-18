
import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

/**
 * هوك للتعامل مع أذونات الماسح الضوئي
 */
export const useScannerPermission = () => {
  // دالة للتحقق من وضمان الحصول على أذونات الكاميرا
  const ensurePermission = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) return false;
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) return false;
      
      console.log("[useScannerPermission] التحقق من إذن الكاميرا...");
      
      // تحقق من حالة الإذن
      const status = await BarcodeScanner.checkPermissions();
      console.log(`[useScannerPermission] حالة إذن الكاميرا: ${status.camera}`);
      
      if (status.camera !== 'granted') {
        console.log("[useScannerPermission] طلب إذن الكاميرا...");
        
        // محاولة إظهار رسالة توضيحية للمستخدم
        try {
          await Toast.show({
            text: 'يحتاج التطبيق إلى إذن الكاميرا للقيام بمسح الرموز',
            duration: 'short'
          });
        } catch (e) {}
        
        // طلب الإذن
        const requestResult = await BarcodeScanner.requestPermissions();
        console.log(`[useScannerPermission] نتيجة طلب الإذن: ${requestResult.camera}`);
        
        // إذا لم يتم منح الإذن، محاولة أخرى بتفعيل force
        if (requestResult.camera !== 'granted') {
          console.log("[useScannerPermission] محاولة طلب الإذن مع تفعيل force...");
          
          // طلب الإذن بتفعيل Force
          const forceResult = await BarcodeScanner.requestPermissions();
          return forceResult.camera === 'granted';
        }
        
        return requestResult.camera === 'granted';
      }
      
      return true;
    } catch (error) {
      console.error("[useScannerPermission] خطأ في التحقق من الإذن:", error);
      return false;
    }
  }, []);

  return {
    ensurePermission
  };
};
