
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useMockScanner } from './useMockScanner';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useTraditionalScanner } from './providers/useTraditionalScanner';
import { barcodeScannerService } from '@/services/scanner/BarcodeScannerService';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { checkDeviceSupport } = useDeviceDetection();
  const { startMockScan } = useMockScanner();
  const mlkitScanner = useMLKitScanner(); // Get the full scanner object
  const { startTraditionalScan, stopTraditionalScan } = useTraditionalScanner();

  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح فوراً");
      
      // استخدام خدمة الماسح الضوئي الموحدة أولاً
      try {
        console.log("[useScannerDevice] محاولة استخدام خدمة الماسح الموحدة");
        // عند استدعاء الخدمة، نستخدم معالج منفصل للتعامل مع نتيجة المسح
        const result = await barcodeScannerService.startScan();
        
        // إذا نجح بدء المسح، نقوم بإعداد مستمع للنتيجة
        if (result) {
          // هنا يمكننا إعداد مستمع لنتيجة المسح باستخدام BarcodeScanner.addListener
          // على سبيل المثال (لا يتم تنفيذه هنا):
          // BarcodeScanner.addListener('barcodeScanned', (result) => onSuccess(result.barcode));
        }
        return result;
      } catch (serviceError) {
        console.warn("[useScannerDevice] خطأ في استخدام خدمة الماسح الموحدة:", serviceError);
        
        // محاولة استخدام MLKit كاحتياطي
        try {
          console.log("[useScannerDevice] محاولة استخدام MLKit للمسح");
          // Use the startScan method from the mlkitScanner object
          const mlkitResult = await mlkitScanner.startScan();
          
          // Set up a callback for MLKit scanner results
          if (mlkitResult) {
            onSuccess(mlkitResult.toString());
          }
          
          return mlkitResult;
        } catch (mlkitError) {
          console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
          
          // محاولة استخدام الماسح التقليدي كاحتياطي ثانٍ
          try {
            console.log("[useScannerDevice] محاولة استخدام الماسح التقليدي");
            return await startTraditionalScan(onSuccess);
          } catch (bsError) {
            console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
            
            // في حالة فشل كل المحاولات، نستخدم وضع المحاكاة
            console.log("[useScannerDevice] استخدام وضع المحاكاة كحل نهائي");
            startMockScan(onSuccess);
            return true;
          }
        }
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ غير متوقع في عملية المسح:", error);
      startMockScan(onSuccess);
      return true;
    }
  };

  const stopDeviceScan = async () => {
    console.log("[useScannerDevice] إيقاف المسح");
    try {
      // محاولة إيقاف المسح باستخدام خدمة الماسح الموحدة
      await barcodeScannerService.stopScan();
      
      // Stop the MLKit scanner
      await mlkitScanner.stopScan();
      
      // محاولة إيقاف الماسح التقليدي كإجراء احتياطي
      await stopTraditionalScan();
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف المسح:", error);
    }
  };

  return {
    startDeviceScan,
    stopDeviceScan
  };
};
