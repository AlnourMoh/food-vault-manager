
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      // Check if we're running on a device with Capacitor and MLKit is available
      if (window.Capacitor) {
        try {
          const available = await BarcodeScanner.isSupported();
          
          if (available) {
            console.log("[useScannerDevice] MLKit BarcodeScanner is available");
            
            // Request permissions first
            const { camera } = await BarcodeScanner.requestPermissions();
            if (camera !== 'granted') {
              console.log("[useScannerDevice] Camera permission not granted:", camera);
              toast({
                title: "تم رفض الإذن",
                description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
                variant: "destructive"
              });
              throw new Error("Camera permission not granted");
            }
            
            console.log("[useScannerDevice] Starting scan with MLKit");
            const result = await BarcodeScanner.scan();
            
            if (result.barcodes.length > 0) {
              const code = result.barcodes[0].rawValue || '';
              console.log("[useScannerDevice] Scan successful:", code);
              onSuccess(code);
              return;
            } else {
              console.log("[useScannerDevice] No barcodes detected");
              toast({
                title: "لم يتم العثور على باركود",
                description: "حاول إعادة المسح مرة أخرى",
                variant: "default"
              });
            }
          }
        } catch (error) {
          console.error("[useScannerDevice] Error with MLKit scanner:", error);
        }
      }
      
      // Fallback to mock scanner for web or when MLKit is not available
      console.log("[useScannerDevice] Using mock scanner fallback");
      toast({
        title: "وضع المحاكاة",
        description: "يتم استخدام محاكاة للماسح الضوئي في هذه البيئة",
        variant: "default"
      });
      
      setTimeout(() => {
        const mockBarcode = `TEST-${Math.floor(Math.random() * 1000000)}`;
        console.log("[useScannerDevice] باركود محاكاة:", mockBarcode);
        onSuccess(mockBarcode);
      }, 2000);
      
    } catch (error) {
      console.error("[useScannerDevice] خطأ في بدء عملية المسح:", error);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح",
        variant: "destructive"
      });
      
      throw error;
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("[useScannerDevice] إيقاف عملية المسح");
      
      // If we're using the MLKit scanner, we need to stop it
      if (window.Capacitor) {
        try {
          // Check if MLKit is supported before trying to disable torch
          const isSupported = await BarcodeScanner.isSupported();
          if (isSupported) {
            await BarcodeScanner.enableTorch(false);
          }
        } catch (error) {
          console.error("[useScannerDevice] Error disabling torch:", error);
        }
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف عملية المسح:", error);
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
