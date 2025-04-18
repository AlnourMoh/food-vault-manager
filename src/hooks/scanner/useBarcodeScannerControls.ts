
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useScannerDevice } from './useScannerDevice';

interface UseBarcodeScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useBarcodeScannerControls = ({ onScan, onClose }: UseBarcodeScannerControlsProps) => {
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  
  const handleSuccessfulScan = (code: string) => {
    console.log('Successful scan detected:', code);
    setLastScannedCode(code);
    setIsScanningActive(false);
    
    // Process the scanned code
    onScan(code);
  };
  
  const startScan = async () => {
    try {
      console.log('Starting barcode scan...');
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
    startScan,
    stopScan
  };
};
