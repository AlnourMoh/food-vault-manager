
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { useTorchControl } from './useTorchControl';
import { useScannerUI } from './useScannerUI';
import { useMockScanner } from './useMockScanner';
import { StartScanOptions } from '@capacitor-mlkit/barcode-scanning';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { enableTorch, disableTorch } = useTorchControl();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  const { startMockScan } = useMockScanner();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      if (window.Capacitor) {
        try {
          console.log("[useScannerDevice] فحص إذا كان الماسح مدعومًا...");
          const { supported } = await BarcodeScanner.isSupported();
          
          if (supported) {
            console.log("[useScannerDevice] MLKit BarcodeScanner متوفر، جاري بدء المسح");
            
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
            setupScannerBackground();
            
            // Modified scan options to match the API
            const scanOptions: StartScanOptions = {
              formats: [
                BarcodeFormat.QrCode,
                BarcodeFormat.Code128,
                BarcodeFormat.Ean13,
                BarcodeFormat.Ean8,
                BarcodeFormat.Code39
              ]
            };

            // Use scan event listener with the correct event name 'barcodesScanned'
            const listenerPromise = BarcodeScanner.addListener(
              'barcodesScanned',
              async (result) => {
                console.log("[useScannerDevice] تم اكتشاف باركود:", result);
                if (result.barcodes && result.barcodes.length > 0) {
                  const code = result.barcodes[0].rawValue || '';
                  console.log("[useScannerDevice] المسح ناجح:", code);
                  
                  // Get the listener handle and remove it properly
                  try {
                    const listenerHandle = await listenerPromise;
                    await listenerHandle.remove();
                  } catch (removeError) {
                    console.error("[useScannerDevice] خطأ في إزالة المستمع:", removeError);
                  }
                  
                  // Stop the scan
                  try {
                    await BarcodeScanner.stopScan();
                    await disableTorch();
                    cleanupScannerBackground();
                  } catch (stopError) {
                    console.error("[useScannerDevice] خطأ في إيقاف المسح:", stopError);
                  }
                  
                  onSuccess(code);
                  return;
                }
                console.log("[useScannerDevice] لم يتم العثور على باركود");
              }
            );

            // استخدام النمط البسيط لمسح الباركود - أكثر موثوقية
            try {
              console.log("[useScannerDevice] استخدام طريقة المسح البسيطة");
              // محاولة استخدام طريقة scan أولاً (أكثر موثوقية في بعض الأجهزة)
              const result = await BarcodeScanner.scan();
              if (result && result.barcodes && result.barcodes.length > 0) {
                console.log("[useScannerDevice] نجح المسح البسيط!");
                const code = result.barcodes[0].rawValue || '';
                onSuccess(code);
                return;
              }
            } catch (scanError) {
              console.log("[useScannerDevice] فشلت طريقة المسح البسيطة، جاري المحاولة بطريقة startScan");
              await BarcodeScanner.startScan(scanOptions);
            }
            
            return;
          }
          
          console.log("[useScannerDevice] ماسح MLKit غير متوفر على هذا الجهاز");
          toast({
            title: "ماسح الباركود غير متوفر",
            description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
            variant: "default"
          });
          throw new Error("Barcode scanner not supported");
        } catch (error) {
          console.error("[useScannerDevice] خطأ مع ماسح MLKit:", error);
          
          // تجربة الطريقة البديلة - استخدام الكاميرا العادية
          console.log("[useScannerDevice] جاري تجربة الطريقة البديلة...");
          startMockScan(onSuccess);
          return;
        }
      }
      
      // Fallback to mock scanner
      startMockScan(onSuccess);
      
    } catch (error) {
      console.error("[useScannerDevice] خطأ في بدء عملية المسح:", error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح، جاري تشغيل وضع المحاكاة",
        variant: "destructive"
      });
      
      // في حالة أي خطأ، استخدام المحاكاة
      startMockScan(onSuccess);
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("[useScannerDevice] إيقاف عملية المسح");
      
      if (window.Capacitor) {
        try {
          const { supported } = await BarcodeScanner.isSupported();
          if (supported) {
            console.log("[useScannerDevice] إيقاف مسح MLKit");
            await BarcodeScanner.stopScan();
            await disableTorch();
            cleanupScannerBackground();
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
