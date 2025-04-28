
import { useToast } from '@/hooks/use-toast';
import { useTorchControl } from './useTorchControl';
import { useScannerUI } from './useScannerUI';
import { useMockScanner } from './useMockScanner';
import { useDeviceDetection } from './device/useDeviceDetection';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  const { startMockScan } = useMockScanner();
  const { checkDeviceSupport } = useDeviceDetection();
  
  // وظيفة بدء المسح مع تحسين آلية التعامل مع الأخطاء والتنظيف
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      const { isSupported, isCapacitor } = await checkDeviceSupport();
      
      // استخدام وضع المحاكاة للويب أو الأجهزة غير المدعومة
      if (!isCapacitor || !isSupported) {
        console.log("[useScannerDevice] استخدام وضع المحاكاة للمسح");
        startMockScan(onSuccess);
        return true;
      }
      
      // استخدام MLKit كخيار أول وأفضل
      try {
        console.log("[useScannerDevice] محاولة استخدام MLKit أولاً");
        // تحميل الوحدة ديناميكيًا
        const MLKitModule = await import('@capacitor-mlkit/barcode-scanning');
        const { BarcodeScanner } = MLKitModule;
        
        // التحقق من الدعم أولاً
        const available = await BarcodeScanner.isSupported();
        if (!available) {
          console.log("[useScannerDevice] MLKit غير مدعوم على هذا الجهاز");
          throw new Error("MLKit غير مدعوم");
        }
        
        // التحقق من الأذونات
        const status = await BarcodeScanner.checkPermissions();
        console.log("[useScannerDevice] حالة أذونات MLKit:", status);
        
        if (status.camera !== 'granted') {
          console.log("[useScannerDevice] طلب إذن MLKit");
          const result = await BarcodeScanner.requestPermissions();
          
          if (result.camera !== 'granted') {
            console.log("[useScannerDevice] تم رفض إذن MLKit");
            throw new Error("تم رفض إذن الكاميرا");
          }
        }
        
        // إعداد واجهة المسح
        await setupScannerBackground();
        
        // بدء المسح
        console.log("[useScannerDevice] بدء مسح MLKit");
        const barcode = await BarcodeScanner.scan({
          formats: ["QR_CODE", "CODE_128", "CODE_39", "EAN_13", "EAN_8", "UPC_A", "UPC_E"]
        });
        
        console.log("[useScannerDevice] نتيجة مسح MLKit:", barcode);
        
        // تنظيف الواجهة بعد المسح
        cleanupScannerBackground();
        
        if (barcode && barcode.barcodes.length > 0) {
          // تم العثور على باركود صالح
          onSuccess(barcode.barcodes[0].rawValue);
          return true;
        } else {
          throw new Error("لم يتم العثور على باركود");
        }
      } catch (mlkitError) {
        console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
        
        // تنظيف أي آثار من محاولة MLKit
        cleanupScannerBackground();
        
        // الانتقال إلى الخيار الاحتياطي
        console.log("[useScannerDevice] محاولة استخدام BarcodeScanner التقليدي");
        
        try {
          // تحميل الوحدة ديناميكيًا
          const BSModule = await import('@capacitor-community/barcode-scanner');
          const { BarcodeScanner } = BSModule;
          
          // التحقق من الأذونات
          const permissionStatus = await BarcodeScanner.checkPermission({ force: false });
          
          if (!permissionStatus.granted) {
            console.log("[useScannerDevice] طلب إذن الماسح التقليدي");
            const newStatus = await BarcodeScanner.checkPermission({ force: true });
            
            if (!newStatus.granted) {
              console.log("[useScannerDevice] تم رفض إذن الماسح التقليدي");
              throw new Error("تم رفض إذن الكاميرا");
            }
          }

          // إعداد واجهة المسح
          await setupScannerBackground();
          await BarcodeScanner.hideBackground();
          
          // تجهيز الماسح
          await BarcodeScanner.prepare();
          
          // بدء المسح
          console.log("[useScannerDevice] بدء المسح التقليدي");
          const result = await BarcodeScanner.startScan({ 
            targetedFormats: ['QR_CODE', 'EAN_13', 'CODE_128'] 
          });
          
          // تنظيف الواجهة
          await BarcodeScanner.showBackground().catch(() => {});
          cleanupScannerBackground();
          
          // معالجة النتيجة
          if (result.hasContent) {
            onSuccess(result.content);
            return true;
          } else {
            throw new Error("لم يتم العثور على باركود");
          }
        } catch (bsError) {
          console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
          // تنظيف في حالة الخطأ
          cleanupScannerBackground();
          
          if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
            try {
              const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
              await BarcodeScanner.showBackground().catch(() => {});
              await BarcodeScanner.stopScan().catch(() => {});
            } catch (e) {}
          }
          
          // استخدام المحاكاة كملاذ أخير
          console.log("[useScannerDevice] الانتقال إلى وضع المحاكاة بعد فشل الطرق الأخرى");
          startMockScan(onSuccess);
          return true;
        }
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ غير متوقع في عملية المسح:", error);
      cleanupScannerBackground();
      
      if (window.Capacitor) {
        // محاولة تنظيف الموارد في حالة الخطأ
        if (window.Capacitor.isPluginAvailable('BarcodeScanner')) {
          try {
            const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
            await BarcodeScanner.showBackground().catch(() => {});
            await BarcodeScanner.stopScan().catch(() => {});
          } catch (e) {}
        }
      }
      
      // الانتقال إلى المحاكاة في حالة الخطأ
      startMockScan(onSuccess);
      return true;
    }
  };
  
  // وظيفة إيقاف المسح مع تحسين آلية التنظيف
  const stopDeviceScan = async () => {
    console.log("[useScannerDevice] إيقاف المسح");
    
    try {
      // إلغاء أي مسح MLKit نشط
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log("[useScannerDevice] تنظيف MLKit");
          // لا حاجة لإجراء خاص لإيقاف MLKit - يتم التنظيف تلقائيًا
        } catch (e) {}
      }
      
      // إلغاء أي مسح تقليدي نشط
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          console.log("[useScannerDevice] إيقاف الماسح التقليدي");
          
          await BarcodeScanner.showBackground().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {}
      }
    } catch (error) {
      console.warn("[useScannerDevice] خطأ في إيقاف المسح:", error);
    } finally {
      // تنظيف واجهة المسح في جميع الحالات
      cleanupScannerBackground();
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
