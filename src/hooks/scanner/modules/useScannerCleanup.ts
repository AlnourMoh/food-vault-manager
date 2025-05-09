
import { useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

export const useScannerCleanup = (
  isScanningActive: boolean,
  stopScan: () => Promise<boolean>
) => {
  // تنظيف الموارد عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('useScannerCleanup: تنظيف موارد الماسح...');
      
      // إيقاف المسح إذا كان نشطًا
      if (isScanningActive) {
        stopScan().catch(error => {
          console.error('useScannerCleanup: خطأ في إيقاف المسح أثناء التنظيف:', error);
        });
      }
      
      // إزالة جميع المستمعين
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.removeAllListeners().catch(error => {
          console.error('useScannerCleanup: خطأ في إزالة المستمعين:', error);
        });
      }
    };
  }, [isScanningActive, stopScan]);
};
