
import { useToast } from '@/hooks/use-toast';

export const useMockScanner = () => {
  const { toast } = useToast();

  const startMockScan = (onSuccess: (code: string) => void) => {
    toast({
      title: "وضع المحاكاة",
      description: "يتم استخدام محاكاة للماسح الضوئي، يمكنك إدخال الرمز يدويًا",
      variant: "default"
    });
    
    // إظهار مربع حوار للإدخال اليدوي
    setTimeout(() => {
      try {
        const manualCode = prompt("أدخل رمز الباركود يدويًا:");
        if (manualCode && manualCode.trim() !== "") {
          const mockBarcode = manualCode.trim();
          console.log("[useMockScanner] باركود تم إدخاله يدويًا:", mockBarcode);
          onSuccess(mockBarcode);
        } else {
          console.log("[useMockScanner] تم إلغاء الإدخال اليدوي، استخدام رمز عشوائي");
          const randomCode = `TEST-${Math.floor(Math.random() * 1000000)}`;
          console.log("[useMockScanner] باركود محاكاة:", randomCode);
          onSuccess(randomCode);
        }
      } catch (error) {
        console.error("[useMockScanner] خطأ في وضع المحاكاة:", error);
        const fallbackCode = `TEST-${Math.floor(Math.random() * 1000000)}`;
        onSuccess(fallbackCode);
      }
    }, 500);
  };

  return {
    startMockScan
  };
};
