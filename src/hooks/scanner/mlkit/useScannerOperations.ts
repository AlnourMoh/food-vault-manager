
import { useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { MLKitScanResult } from '@/types/zxing-scanner';

/**
 * هوك للتعامل مع عمليات المسح
 */
export const useScannerOperations = () => {
  // بدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log("[useScannerOperations] بدء المسح...");
      
      try {
        // استخدام startScan بدون معاملات وتخزين النتيجة بشكل صحيح
        const result: MLKitScanResult = await BarcodeScanner.startScan();
        console.log("[useScannerOperations] نتيجة المسح:", result);
        
        // معالجة نتيجة المسح - التحقق من وجود محتوى
        if (result && result.hasContent) {
          if (result.content && typeof result.content === 'string') {
            console.log("[useScannerOperations] تم العثور على رمز:", result.content);
            return { success: true, code: result.content };
          }
        }
        
        console.log("[useScannerOperations] لم يتم العثور على رموز أو نتيجة غير صالحة");
        return { success: false, code: null };
      } catch (scanError) {
        console.error("[useScannerOperations] خطأ في عملية المسح:", scanError);
        return { success: false, code: null };
      }
    } catch (error) {
      console.error("[useScannerOperations] خطأ في بدء المسح:", error);
      
      // محاولة إظهار رسالة خطأ للمستخدم
      try {
        await Toast.show({
          text: `خطأ في المسح: ${error.message || 'خطأ غير معروف'}`,
          duration: 'short'
        });
      } catch (e) {}
      
      return { success: false, code: null };
    }
  }, []);

  // إيقاف المسح
  const stopScan = useCallback(async () => {
    console.log("[useScannerOperations] إيقاف المسح...");
    
    try {
      // إيقاف الفلاش إذا كان مفعلاً
      await BarcodeScanner.enableTorch({ enable: false }).catch(() => {});
      
      // إيقاف المسح
      await BarcodeScanner.stopScan();
      
      console.log("[useScannerOperations] تم إيقاف المسح بنجاح");
      
      return true;
    } catch (error) {
      console.error("[useScannerOperations] خطأ في إيقاف المسح:", error);
      return false;
    }
  }, []);

  // التعامل مع الفلاش
  const toggleTorch = useCallback(async (enable: boolean) => {
    try {
      await BarcodeScanner.enableTorch({ enable });
      return true;
    } catch (error) {
      console.error("[useScannerOperations] خطأ في التحكم بالفلاش:", error);
      return false;
    }
  }, []);

  return {
    startScan,
    stopScan,
    toggleTorch
  };
};
