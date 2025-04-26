
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useDeviceDetection = () => {
  const { toast } = useToast();

  const checkDeviceSupport = async () => {
    if (!window.Capacitor) {
      console.log("[useDeviceDetection] ليست بيئة Capacitor");
      return { isSupported: false, isCapacitor: false };
    }

    try {
      console.log("[useDeviceDetection] فحص دعم الماسح...");
      const isPluginAvailable = window.Capacitor.isPluginAvailable('BarcodeScanner');
      
      if (!isPluginAvailable) {
        console.log("[useDeviceDetection] ماسح الباركود غير مدعوم");
        toast({
          title: "ماسح الباركود غير متوفر",
          description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
          variant: "default"
        });
        return { isSupported: false, isCapacitor: true };
      }
      
      return { isSupported: true, isCapacitor: true };
    } catch (error) {
      console.error("[useDeviceDetection] خطأ في فحص دعم الجهاز:", error);
      return { isSupported: false, isCapacitor: true };
    }
  };

  return { checkDeviceSupport };
};
