import { useState, useCallback, useEffect } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

// Ensure we import the type augmentation
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { setupScannerBackground, restoreUIAfterScanning } = useScannerUI();
  const { toast } = useToast();

  // تحسين الأداء وتقليل التأخير
  const startMLKitScan = useCallback(async (onSuccess: (code: string) => void): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] بدء المسح باستخدام MLKit...');
      
      // التحقق من توفر MLKit
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.warn('[useMLKitScanner] MLKit غير متوفر على هذا الجهاز');
        
        // في بيئة الويب، نعرض رسالة بدلاً من محاكاة المسح
        if (!Capacitor.isNativePlatform()) {
          console.log('[useMLKitScanner] عرض رسالة للمستخدم في بيئة الويب');
          
          toast({
            title: "المسح غير متاح في المتصفح",
            description: "يرجى استخدام تطبيق الجوال للقيام بعمليات المسح",
            variant: "destructive"
          });
          
          // إيقاف عملية المسح
          setIsScanning(false);
          return false;
        }
        
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
            setLastScannedCode(code);
            onSuccess(code);
            return true;
          }
        }
        
        // في حالة عدم العثور على باركود
        Toast.show({ text: 'لم يتم العثور على أي با��كود. حاول مرة أخرى.' });
        return false;
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في المسح:', error);
        setIsScanning(false);
        
        try {
          // التأكد من إخفاء الكاميرا في حالة الخطأ
          await BarcodeScanner.stopScan().catch(() => {});
          await BarcodeScanner.disableTorch();
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
        await BarcodeScanner.disableTorch();
      } catch (e) {
        console.error('[useMLKitScanner] خطأ في إيقاف الكاميرا بعد خطأ المسح:', e);
      }
      
      return false;
    }
  }, [setupScannerBackground, restoreUIAfterScanning, toast]);

  const stopMLKitScan = useCallback(async (): Promise<boolean> => {
    try {
      if (!isScanning) return true;
      
      console.log('[useMLKitScanner] إيقاف المسح...');
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.disableTorch().catch(() => {});
        await BarcodeScanner.stopScan();
      }
      
      setIsScanning(false);
      // استعادة الواجهة الأصلية
      await restoreUIAfterScanning();
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      setIsScanning(false);
      return false;
    }
  }, [isScanning, restoreUIAfterScanning]);

  return {
    isScanning,
    lastScannedCode,
    startMLKitScan,
    stopMLKitScan
  };
};
