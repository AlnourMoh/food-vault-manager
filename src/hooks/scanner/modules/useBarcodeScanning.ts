
import { useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

interface UseBarcodeScannintProps {
  onScan: (code: string) => void;
  isScanningActive: boolean;
  setIsScanningActive: (active: boolean) => void;
  cameraActive: boolean;
  hasScannerError: boolean;
  setHasScannerError: (error: boolean) => void;
}

export const useBarcodeScanning = ({
  onScan,
  isScanningActive,
  setIsScanningActive,
  cameraActive,
  hasScannerError,
  setHasScannerError
}: UseBarcodeScannintProps) => {

  // تعريف وظيفة إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('useBarcodeScanning: إيقاف المسح...');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // إيقاف المسح وإزالة المستمعين
          await BarcodeScanner.stopScan();
          console.log('تم إيقاف مسح الباركود');
        } catch (e) {
          console.error('خطأ في إيقاف مسح MLKitBarcodeScanner:', e);
        }
      }
      
      setIsScanningActive(false);
      return true;
    } catch (error) {
      console.error('useBarcodeScanning: خطأ في إيقاف المسح:', error);
      return false;
    }
  }, [setIsScanningActive]);

  // تعريف وظيفة بدء المسح
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('useBarcodeScanning: محاولة بدء المسح...');
      
      // التأكد من تفعيل الكاميرا أولاً
      if (!cameraActive) {
        console.error('useBarcodeScanning: الكاميرا غير نشطة، لا يمكن بدء المسح');
        return false;
      }
      
      // بدء المسح الفعلي
      setIsScanningActive(true);
      
      // تهيئة وبدء المسح حسب المنصة
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('بدء استخدام MLKitBarcodeScanner للمسح...');
          
          // تهيئة حدث المسح
          const listener = await BarcodeScanner.addListener(
            'barcodesScanned',
            async result => {
              try {
                console.log('تم اكتشاف باركود:', result.barcodes);
                // إيقاف المسح وإرسال النتيجة
                await stopScan();
                if (result.barcodes && result.barcodes.length > 0) {
                  onScan(result.barcodes[0].rawValue || '');
                }
              } catch (e) {
                console.error('خطأ في معالجة نتيجة المسح:', e);
              }
            }
          );
          
          // بدء المسح باستخدام واجهة MLKit - Fix: don't pass any arguments
          await BarcodeScanner.startScan();
          
          console.log('تم بدء مسح الباركود بنجاح');
          return true;
        } catch (e) {
          console.error('خطأ في بدء مسح MLKitBarcodeScanner:', e);
          setIsScanningActive(false);
          setHasScannerError(true);
          return false;
        }
      } else {
        // في بيئة المحاكاة أو الويب
        console.log('المسح جاهز في بيئة المحاكاة، انتظار تحديد الباركود');
        
        // محاكاة نجاح عملية المسح للاختبار
        // في بيئة حقيقية، سيتم استخدام الكاميرا الفعلية
        setTimeout(() => {
          console.log('محاكاة اكتشاف باركود للاختبار');
          onScan('mock-barcode-123456789');
        }, 5000);
        
        return true;
      }
    } catch (error) {
      console.error('useBarcodeScanning: خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      return false;
    }
  }, [cameraActive, onScan, stopScan, setIsScanningActive, setHasScannerError]);

  return {
    startScan,
    stopScan
  };
};
