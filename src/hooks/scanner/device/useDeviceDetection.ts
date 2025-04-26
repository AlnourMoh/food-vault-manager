
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useDeviceDetection = () => {
  const { toast } = useToast();

  const checkDeviceSupport = async () => {
    if (!window.Capacitor) {
      console.log("[useDeviceDetection] ليست بيئة Capacitor");
      return { isSupported: false, isCapacitor: false };
    }

    try {
      console.log("[useDeviceDetection] فحص دعم MLKit...");
      const { supported } = await BarcodeScanner.isSupported();
      
      if (!supported) {
        console.log("[useDeviceDetection] ماسح MLKit غير مدعوم");
        toast({
          title: "ماسح الباركود غير متوفر",
          description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
          variant: "default"
        });
      }
      
      return { isSupported: supported, isCapacitor: true };
    } catch (error) {
      console.error("[useDeviceDetection] خطأ في فحص دعم الجهاز:", error);
      return { isSupported: false, isCapacitor: true };
    }
  };

  return { checkDeviceSupport };
};
