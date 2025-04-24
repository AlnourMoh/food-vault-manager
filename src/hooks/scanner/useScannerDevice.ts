
import { useToast } from '@/hooks/use-toast';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح (محاكاة)");
      
      // محاكاة المسح لكل البيئات
      toast({
        title: "وضع المحاكاة",
        description: "يتم استخدام محاكاة للماسح الضوئي في هذه النسخة",
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
      console.log("[useScannerDevice] إيقاف عملية المسح (محاكاة)");
      // No special cleanup needed for mock scanner
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف عملية المسح:", error);
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
