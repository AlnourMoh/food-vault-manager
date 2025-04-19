
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useScannerDevice } from './useScannerDevice';
import { useCameraPermissions } from '../useCameraPermissions';

interface UseBarcodeScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useBarcodeScannerControls = ({ onScan, onClose }: UseBarcodeScannerControlsProps) => {
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  const { hasPermission, requestPermission } = useCameraPermissions();
  
  const handleSuccessfulScan = async (code: string) => {
    console.log('Successful scan detected:', code);
    setLastScannedCode(code);
    setIsScanningActive(false);
    
    try {
      // Process the scanned code
      await stopDeviceScan();
      onScan(code);
    } catch (error) {
      console.error('Error processing scan:', error);
      toast({
        title: "خطأ في معالجة المسح",
        description: "حدث خطأ أثناء معالجة الباركود المسح",
        variant: "destructive"
      });
    }
  };
  
  const startScan = async () => {
    try {
      console.log('Starting barcode scan, permission status:', hasPermission);
      
      // If we don't have permission yet, request it again
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          toast({
            title: "لا يمكن بدء المسح",
            description: "لم يتم منح إذن الكاميرا المطلوب للمسح",
            variant: "destructive"
          });
          return;
        }
      }
      
      setIsScanningActive(true);
      await startDeviceScan(handleSuccessfulScan);
    } catch (error) {
      console.error('Scanning error:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة مسح الباركود",
        variant: "destructive"
      });
      stopScan();
    }
  };
  
  const stopScan = async () => {
    console.log('Stopping barcode scan...');
    setIsScanningActive(false);
    await stopDeviceScan();
  };
  
  return {
    isScanningActive,
    lastScannedCode,
    hasPermission,
    startScan,
    stopScan,
    requestPermission
  };
};
