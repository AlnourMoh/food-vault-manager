
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';

export const useTraditionalScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, restoreUIAfterScanning } = useScannerUI();

  const startTraditionalScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useTraditionalScanner] استخدام BarcodeScanner التقليدي");
      
      // التأكد من أن BarcodeScanner متوفر
      if (!window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        console.log("[useTraditionalScanner] ماسح الباركود التقليدي غير متاح");
        throw new Error("ماسح الباركود غير متاح");
      }
      
      const BSModule = await import('@capacitor-community/barcode-scanner');
      const { BarcodeScanner } = BSModule;
      
      // التحقق من الأذونات
      console.log("[useTraditionalScanner] التحقق من إذن الكاميرا");
      const permissionStatus = await BarcodeScanner.checkPermission({ force: false });
      console.log("[useTraditionalScanner] حالة إذن الكاميرا:", permissionStatus);
      
      if (!permissionStatus.granted) {
        console.log("[useTraditionalScanner] طلب إذن الكاميرا");
        const newStatus = await BarcodeScanner.checkPermission({ force: true });
        console.log("[useTraditionalScanner] نتيجة طلب الإذن:", newStatus);
        
        if (!newStatus.granted) {
          throw new Error("تم رفض إذن الكاميرا");
        }
      }

      // إعداد خلفية الماسح وإخفاء الخلفية
      console.log("[useTraditionalScanner] إعداد خلفية الماسح");
      await setupScannerBackground();
      
      // إخفاء خلفية الماسح وإعداده
      console.log("[useTraditionalScanner] إخفاء الخلفية وتجهيز الماسح");
      await BarcodeScanner.hideBackground();
      // تم إزالة المعاملات لأن prepare لا يتوقع أي معاملات
      await BarcodeScanner.prepare();
      
      console.log("[useTraditionalScanner] بدء عملية المسح");
      const result = await BarcodeScanner.startScan({ 
        targetedFormats: ['QR_CODE', 'EAN_13', 'CODE_128'] 
      });
      
      // إظهار الخلفية وتنظيف الموارد بعد المسح
      console.log("[useTraditionalScanner] انتهاء المسح، تنظيف الموارد");
      await BarcodeScanner.showBackground().catch(() => {
        console.log("[useTraditionalScanner] تعذر إظهار الخلفية، تجاهل الخطأ");
      });
      // استخدام restoreUIAfterScanning بدلاً من cleanupScannerBackground
      await restoreUIAfterScanning();
      
      if (result.hasContent) {
        console.log("[useTraditionalScanner] تم العثور على محتوى:", result.content);
        onSuccess(result.content);
        return true;
      }
      
      console.log("[useTraditionalScanner] لم يتم العثور على محتوى");
      throw new Error("لم يتم العثور على باركود");
    } catch (error) {
      console.error("[useTraditionalScanner] خطأ في عملية المسح:", error);
      
      // تنظيف الموارد في حالة الخطأ
      // استخدام restoreUIAfterScanning بدلاً من cleanupScannerBackground
      await restoreUIAfterScanning();
      
      // محاولة إظهار الخلفية وإيقاف المسح في حالة الخطأ
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.showBackground().catch(() => {});
        await BarcodeScanner.stopScan().catch(() => {});
      }
      
      throw error;
    }
  };

  const stopTraditionalScan = async () => {
    console.log("[useTraditionalScanner] إيقاف عملية المسح التقليدية");
    try {
      // محاولة إيقاف المسح فقط إذا كانت الوحدة متاحة
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        
        // إظهار الخلفية وإيقاف المسح
        console.log("[useTraditionalScanner] إظهار الخلفية وإيقاف المسح");
        await BarcodeScanner.showBackground().catch((e) => {
          console.log("[useTraditionalScanner] تعذر إظهار الخلفية:", e);
        });
        await BarcodeScanner.stopScan().catch((e) => {
          console.log("[useTraditionalScanner] تعذر إيقاف المسح:", e);
        });
      }
    } catch (error) {
      console.error('[useTraditionalScanner] خطأ في إيقاف المسح:', error);
    }
  };

  return { startTraditionalScan, stopTraditionalScan };
};
