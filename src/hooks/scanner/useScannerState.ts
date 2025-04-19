
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const { isLoading, hasPermission, requestPermission } = useCameraPermissions();
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  
  const handleSuccessfulScan = (code: string) => {
    console.log('[useScannerState] نجحت عملية المسح برمز:', code);
    setLastScannedCode(code);
    stopScan();
    onScan(code);
  };
  
  const startScan = async () => {
    try {
      console.log('[useScannerState] محاولة بدء المسح، حالة الإذن:', hasPermission);
      
      // دائمًا طلب الإذن عند بدء المسح لضمان أن التطبيق مسجل في قائمة الأذونات
      if (hasPermission === false || hasPermission === null) {
        console.log('[useScannerState] لا يوجد إذن للكاميرا أو الحالة غير معروفة، طلب الإذن مع force=true...');
        const granted = await requestPermission(true);
        console.log('[useScannerState] نتيجة طلب الإذن:', granted);
        
        if (!granted) {
          console.log('[useScannerState] تم رفض الإذن بعد الطلب');
          return false;
        }
      } else {
        // حتى لو كان لدينا إذن، نطلبه مرة أخرى للتأكد من تسجيل التطبيق
        console.log('[useScannerState] لدينا إذن بالفعل، لكن نطلبه مرة أخرى لتحديث التسجيل...');
        await requestPermission(true);
      }
      
      console.log('[useScannerState] الإذن موافق عليه، بدء مسح الجهاز');
      setIsScanningActive(true);
      await startDeviceScan(handleSuccessfulScan);
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في بدء المسح:', error);
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
