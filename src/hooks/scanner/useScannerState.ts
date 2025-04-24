
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
      
      // في هذه النسخة المبسطة، نفترض أن الإذن متاح دائمًا للمحاكاة
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
    hasPermission: true, // دائما نعيد true في وضع المحاكاة
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
