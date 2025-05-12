
import { useState, useCallback, useEffect } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';

// Import the augmentation to ensure TypeScript recognizes the extended methods
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { setupScannerBackground, restoreUIAfterScanning } = useScannerUI();

  // تحسين الأداء وتقليل التأخير
  const startMLKitScan = useCallback(async (onSuccess: (code: string) => void): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] بدء المسح باستخدام MLKit...');
      
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.warn('[useMLKitScanner] MLKit غير متوفر على هذا الجهاز');
        return false;
      }

      // تعيين حالة المسح إلى نشط قبل أي عملية لتحديث الواجهة فورًا
      setIsScanning(true);
      
      // إعداد واجهة المسح أولاً
      await setupScannerBackground();

      // تهيئة الكاميرا وبدء المسح في وقت واحد
      try {
        console.log('[useMLKitScanner] تهيئة وبدء المسح...');
        
        // استخدام تهيئة أسرع للكاميرا
        await BarcodeScanner.prepare();
        
        // بدء المسح الفعلي فورًا
        const result = await BarcodeScanner.scan({
          formats: [
            BarcodeFormat.QrCode, 
            BarcodeFormat.UpcA, 
            BarcodeFormat.UpcE, 
            BarcodeFormat.Ean8, 
            BarcodeFormat.Ean13, 
            BarcodeFormat.Code39,
            BarcodeFormat.Code128
          ]
        });
        
        // تنظيف وإخفاء الكاميرا بعد المسح
        try {
          // استخدام stopScan لإيقاف الكاميرا
          await BarcodeScanner.stopScan().catch(() => {});
          await BarcodeScanner.enableTorch({ value: false }).catch(() => {});
        } catch (e) {
          console.error('[useMLKitScanner] خطأ في إيقاف الكاميرا:', e);
        }
        
        setIsScanning(false);
        
        // معالجة النتيجة في حالة وجود باركود
        if (result.barcodes && result.barcodes.length > 0) {
          const code = result.barcodes[0].rawValue;
          console.log('[useMLKitScanner] تم العثور على باركود:', code);
          
          if (code) {
            onSuccess(code);
            return true;
          }
        }
        
        // في حالة عدم العثور على باركود
        Toast.show({ text: 'لم يتم العثور على أي باركود. حاول مرة أخرى.' });
        return false;
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في المسح:', error);
        setIsScanning(false);
        
        try {
          // التأكد من إخفاء الكاميرا في حالة الخطأ
          await BarcodeScanner.stopScan().catch(() => {});
          await BarcodeScanner.enableTorch({ value: false }).catch(() => {});
        } catch (e) {
          console.error('[useMLKitScanner] خطأ في إيقاف الكاميرا بعد خطأ المسح:', e);
        }
        
        return false;
      }
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في المسح:', error);
      setIsScanning(false);
      
      try {
        // التأكد من إخفاء الكاميرا في حالة الخطأ
        await BarcodeScanner.stopScan().catch(() => {});
        await BarcodeScanner.enableTorch({ value: false }).catch(() => {});
      } catch (e) {
        console.error('[useMLKitScanner] خطأ في إيقاف الكاميرا بعد خطأ المسح:', e);
      }
      
      return false;
    }
  }, [setupScannerBackground]);

  const stopMLKitScan = useCallback(async (): Promise<void> => {
    try {
      if (!isScanning) return;
      
      console.log('[useMLKitScanner] إيقاف المسح...');
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.enableTorch({ value: false }).catch(() => {});
        await BarcodeScanner.stopScan().catch(() => {});
      }
      
      setIsScanning(false);
      // استعادة الواجهة الأصلية
      await restoreUIAfterScanning();
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      setIsScanning(false);
    }
  }, [isScanning, restoreUIAfterScanning]);

  return {
    isScanning,
    startMLKitScan,
    stopMLKitScan
  };
};
