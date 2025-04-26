
import { useToast } from '@/hooks/use-toast';

export const useMockScanner = () => {
  const { toast } = useToast();

  const startMockScan = (onSuccess: (code: string) => void) => {
    toast({
      title: "وضع المحاكاة",
      description: "يتم استخدام محاكاة للماسح الضوئي في هذه البيئة",
      variant: "default"
    });
    
    setTimeout(() => {
      const mockBarcode = `TEST-${Math.floor(Math.random() * 1000000)}`;
      console.log("[useMockScanner] باركود محاكاة:", mockBarcode);
      onSuccess(mockBarcode);
    }, 2000);
  };

  return {
    startMockScan
  };
};
