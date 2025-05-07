
import { useState, useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState(false);

  const startMLKitScan = useCallback(async (onSuccess: (code: string) => void): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] بدء المسح باستخدام MLKit...');
      
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.warn('[useMLKitScanner] MLKit غير متوفر على هذا الجهاز');
        return false;
      }

      setIsScanning(true);

      // عرض معاينة الكاميرا
      try {
        // تهيئة العرض المباشر للكاميرا قبل بدء المسح
        console.log('[useMLKitScanner] تهيئة عرض الكاميرا...');
        
        // إظهار خلفية الكاميرا - ضروري لرؤية الكاميرا
        await BarcodeScanner.showBackground();

        // إعداد المسح باستخدام الكاميرا
        await BarcodeScanner.prepare();
      } catch (e) {
        console.error('[useMLKitScanner] خطأ في تهيئة الكاميرا:', e);
      }

      // بدء المسح الفعلي
      const result = await BarcodeScanner.scan({
        formats: [
          'QR_CODE', 
          'UPC_A', 
          'UPC_E', 
          'EAN_8', 
          'EAN_13', 
          'CODE_39',
          'CODE_128'
        ]
      });
      
      // تنظيف وإخفاء الكاميرا بعد المسح
      try {
        await BarcodeScanner.hideBackground();
        await BarcodeScanner.disableTorch();
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
        await BarcodeScanner.hideBackground();
        await BarcodeScanner.disableTorch();
      } catch (e) {
        console.error('[useMLKitScanner] خطأ في إيقاف الكاميرا بعد خطأ المسح:', e);
      }
      
      return false;
    }
  }, []);

  const stopMLKitScan = useCallback(async (): Promise<void> => {
    try {
      if (!isScanning) return;
      
      console.log('[useMLKitScanner] إيقاف المسح...');
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.disableTorch().catch(() => {});
        await BarcodeScanner.stopScan().catch(() => {});
        await BarcodeScanner.hideBackground().catch(() => {});
      }
      
      setIsScanning(false);
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      setIsScanning(false);
    }
  }, [isScanning]);

  return {
    isScanning,
    startMLKitScan,
    stopMLKitScan
  };
};
