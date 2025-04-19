
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const { isLoading, hasPermission, requestPermission } = useCameraPermissions();
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  const { toast } = useToast();
  
  const handleSuccessfulScan = (code: string) => {
    console.log('[useScannerState] نجحت عملية المسح برمز:', code);
    setLastScannedCode(code);
    stopScan();
    onScan(code);
  };
  
  const startScan = async () => {
    try {
      console.log('[useScannerState] محاولة بدء المسح، حالة الإذن:', hasPermission);
      
      // طلب الإذن صراحةً دائمًا عند بدء المسح للتأكد من أن التطبيق يظهر في قائمة الإعدادات
      console.log('[useScannerState] طلب الإذن بشكل مباشر قبل البدء...');
      const granted = await requestPermission(true);
      console.log('[useScannerState] نتيجة طلب الإذن:', granted);
      
      if (!granted) {
        console.log('[useScannerState] لم يتم منح الإذن، إلغاء عملية المسح');
        toast({
          title: "تم رفض الإذن",
          description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك لتطبيق مخزن الطعام.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log('[useScannerState] الإذن موافق عليه، بدء مسح الجهاز');
      setIsScanningActive(true);
      await startDeviceScan(handleSuccessfulScan);
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في بدء المسح:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح",
        variant: "destructive"
      });
      setIsScanningActive(false);
      return false;
    }
  };
  
  const stopScan = async () => {
    console.log('[useScannerState] إيقاف المسح');
    setIsScanningActive(false);
    await stopDeviceScan();
  };
  
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
