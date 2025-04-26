
import { useToast } from '@/hooks/use-toast';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      // Check if we're running on a device with Capacitor and MLKit is available
      if (window.Capacitor) {
        try {
          console.log("[useScannerDevice] فحص إذا كان الماسح مدعومًا...");
          const available = await BarcodeScanner.isSupported();
          
          if (available) {
            console.log("[useScannerDevice] MLKit BarcodeScanner متوفر، جاري بدء المسح");
            
            // Request permissions first
            const { camera } = await BarcodeScanner.requestPermissions();
            if (camera !== 'granted') {
              console.log("[useScannerDevice] إذن الكاميرا غير ممنوح:", camera);
              toast({
                title: "تم رفض الإذن",
                description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
                variant: "destructive"
              });
              throw new Error("Camera permission not granted");
            }
            
            console.log("[useScannerDevice] بدء المسح باستخدام MLKit");
            
            // Important: Set background to transparent to see the camera preview
            document.body.classList.add('scanner-transparent-background');
            document.body.style.background = 'transparent';
            
            // Start the camera stream
            await BarcodeScanner.startScan({
              formats: [
                BarcodeFormat.QRCode,
                BarcodeFormat.Code128,
                BarcodeFormat.Ean13,
                BarcodeFormat.Ean8,
                BarcodeFormat.Code39
              ],
              detectionMode: 'continuous',
              onScanComplete: (result) => {
                console.log("[useScannerDevice] تم اكتشاف باركود:", result);
                if (result.barcodes.length > 0) {
                  const code = result.barcodes[0].rawValue || '';
                  console.log("[useScannerDevice] المسح ناجح:", code);
                  onSuccess(code);
                  return;
                } else {
                  console.log("[useScannerDevice] لم يتم العثور على باركود");
                }
              }
            });
            return;
          } else {
            console.log("[useScannerDevice] ماسح MLKit غير متوفر على هذا الجهاز");
            toast({
              title: "ماسح الباركود غير متوفر",
              description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
              variant: "default"
            });
            throw new Error("Barcode scanner not supported");
          }
        } catch (error) {
          console.error("[useScannerDevice] خطأ مع ماسح MLKit:", error);
          throw error;
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
      
      // If we're using the MLKit scanner, we need to disable torch and stop scan
      if (window.Capacitor) {
        try {
          // Check if MLKit is supported before trying to stop scan
          const available = await BarcodeScanner.isSupported();
          if (available) {
            console.log("[useScannerDevice] إيقاف مسح MLKit");
            // Stop the scan first
            await BarcodeScanner.stopScan();
            
            // Then try to disable torch
            try {
              await BarcodeScanner.enableTorch({ enable: false });
            } catch (e) {
              console.log("[useScannerDevice] خطأ في إيقاف الإضاءة:", e);
              // Non-critical error, can continue
            }
            
            // Cleanup UI changes
            document.body.classList.remove('scanner-transparent-background');
            document.body.style.background = '';
          }
        } catch (error) {
          console.error("[useScannerDevice] خطأ في إيقاف المسح:", error);
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
