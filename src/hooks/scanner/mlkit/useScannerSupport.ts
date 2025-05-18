
import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * هوك للتحقق من دعم المسح الضوئي
 */
export const useScannerSupport = () => {
  // تحقق مما إذا كانت بيئة التطبيق تدعم المسح
  const checkScanningSupport = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log("[useScannerSupport] ليست منصة أصلية، لا يمكن استخدام MLKit");
        return false;
      }
      
      const isMLKitAvailable = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
      if (!isMLKitAvailable) {
        console.log("[useScannerSupport] ملحق MLKit غير متوفر");
        return false;
      }
      
      // التحقق من دعم المسح
      const { supported } = await BarcodeScanner.isSupported();
      console.log(`[useScannerSupport] هل المسح مدعوم بواسطة MLKit؟: ${supported}`);
      
      return supported;
    } catch (error) {
      console.error("[useScannerSupport] خطأ في التحقق من دعم المسح:", error);
      return false;
    }
  }, []);

  return {
    checkScanningSupport
  };
};
