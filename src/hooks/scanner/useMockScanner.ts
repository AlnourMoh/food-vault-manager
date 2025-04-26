
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseMockScannerResult {
  startMockScan: (onSuccess: (code: string) => void) => void;
  isMockScanActive: boolean;
  handleManualInput: (code: string) => void;
  cancelMockScan: () => void;
}

export const useMockScanner = (): UseMockScannerResult => {
  const { toast } = useToast();
  const [isMockScanActive, setIsMockScanActive] = useState(false);
  const [currentCallback, setCurrentCallback] = useState<((code: string) => void) | null>(null);

  const startMockScan = (onSuccess: (code: string) => void) => {
    console.log("[useMockScanner] بدء وضع المحاكاة");
    setIsMockScanActive(true);
    setCurrentCallback(() => onSuccess);
    
    toast({
      title: "وضع المحاكاة",
      description: "يتم استخدام محاكاة للماسح الضوئي، يمكنك إدخال الرمز يدويًا",
      variant: "default"
    });
  };

  const handleManualInput = (code: string) => {
    if (!code || code.trim() === "") {
      console.log("[useMockScanner] تم إدخال رمز فارغ");
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء إدخال رمز صحيح",
        variant: "destructive"
      });
      return;
    }

    try {
      const processedCode = code.trim();
      console.log("[useMockScanner] تم إدخال الرمز يدويًا:", processedCode);
      
      if (currentCallback) {
        currentCallback(processedCode);
      }
      
      setIsMockScanActive(false);
      setCurrentCallback(null);
      
    } catch (error) {
      console.error("[useMockScanner] خطأ في معالجة الرمز المدخل:", error);
      toast({
        title: "خطأ في المعالجة",
        description: "حدث خطأ أثناء معالجة الرمز المدخل",
        variant: "destructive"
      });
    }
  };

  const cancelMockScan = () => {
    console.log("[useMockScanner] تم إلغاء المسح المحاكى");
    setIsMockScanActive(false);
    setCurrentCallback(null);
  };

  return {
    startMockScan,
    isMockScanActive,
    handleManualInput,
    cancelMockScan
  };
};
