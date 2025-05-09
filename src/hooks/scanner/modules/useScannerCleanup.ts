
import { useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

export const useScannerCleanup = (
  isScanningActive: boolean, 
  stopScan: () => Promise<boolean>
) => {
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('useScannerCleanup: تنظيف الموارد...');
      
      // إيقاف المسح والكاميرا
      if (isScanningActive) {
        stopScan().catch(e => console.error('خطأ في إيقاف المسح عند التنظيف:', e));
      }
      
      // إزالة أي مستمعين للأحداث
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.removeAllListeners();
      }
    };
  }, [isScanningActive, stopScan]);
};
