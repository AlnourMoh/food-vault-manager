
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook لإدارة عملية المسح الوهمية للإدخال اليدوي
 */
export const useMockScanner = () => {
  const [isMockScanActive, setIsMockScanActive] = useState(false);
  const { toast } = useToast();
  const [onSuccessCallback, setOnSuccessCallback] = useState<((code: string) => void) | null>(null);

  /**
   * بدء عملية المسح الوهمية
   */
  const startMockScan = useCallback((onSuccess: (code: string) => void) => {
    console.log('[useMockScanner] بدء المسح الوهمي');
    setIsMockScanActive(true);
    setOnSuccessCallback(() => onSuccess);
  }, []);

  /**
   * معالجة الإدخال اليدوي للكود
   */
  const handleManualInput = useCallback((code: string) => {
    console.log('[useMockScanner] تم إدخال الكود يدوياً:', code);
    
    if (!code || !code.trim()) {
      toast({
        title: "الكود غير صالح",
        description: "يرجى إدخال كود صالح",
        variant: "destructive"
      });
      return;
    }
    
    if (onSuccessCallback) {
      onSuccessCallback(code.trim());
      setIsMockScanActive(false);
      setOnSuccessCallback(null);
    }
  }, [toast, onSuccessCallback]);

  /**
   * إلغاء عملية المسح الوهمية
   */
  const cancelMockScan = useCallback(() => {
    console.log('[useMockScanner] إلغاء المسح الوهمي');
    setIsMockScanActive(false);
    setOnSuccessCallback(null);
  }, []);

  return {
    isMockScanActive,
    startMockScan,
    handleManualInput,
    cancelMockScan
  };
};
