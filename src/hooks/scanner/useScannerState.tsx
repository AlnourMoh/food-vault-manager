
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const { isLoading: permissionsLoading, hasPermission, requestPermission } = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  const { toast } = useToast();
  
  // حالة الإلغاء (لتجنب تحديثات الحالة بعد إلغاء المكون)
  const [isCancelled, setIsCancelled] = useState(false);
  
  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      console.log('[useScannerState] تنظيف عند الإزالة');
      setIsCancelled(true);
      stopScan().catch(e => 
        console.error('[useScannerState] خطأ أثناء إيقاف المسح عند الإزالة:', e)
      );
    };
  }, []);
  
  // معالجة المسح الناجح
  const handleSuccessfulScan = (code: string) => {
    if (isCancelled) return;
    
    console.log('[useScannerState] تم المسح بنجاح:', code);
    setLastScannedCode(code);
    setIsScanningActive(false);
    
    // استدعاء وظيفة النجاح مباشرة
    onScan(code);
  };
  
  // بدء عملية المسح - بسيطة ومباشرة
  const startScan = async () => {
    if (isCancelled) return false;
    
    try {
      console.log('[useScannerState] بدء المسح مباشرة');
      
      // تفعيل حالة المسح النشط لواجهة المستخدم
      setIsScanningActive(true);
      
      // بدء عملية المسح الفعلية مباشرة
      console.log('[useScannerState] بدء عملية المسح الفعلية فوراً');
      const success = await startDeviceScan((code) => {
        if (!isCancelled) {
          handleSuccessfulScan(code);
        }
      });
      
      if (!success && !isCancelled) {
        console.log('[useScannerState] فشلت عملية بدء المسح - محاولة مرة أخرى');
        // محاولة ثانية
        return await startDeviceScan((code) => {
          if (!isCancelled) {
            handleSuccessfulScan(code);
          }
        });
      }
      
      return true;
    } catch (error) {
      if (isCancelled) return false;
      
      console.error('[useScannerState] خطأ في بدء المسح:', error);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح. حاول مرة أخرى.",
        variant: "destructive"
      });
      
      setIsScanningActive(false);
      return false;
    }
  };
  
  // إيقاف عملية المسح
  const stopScan = async () => {
    console.log('[useScannerState] إيقاف المسح');
    
    if (!isCancelled) {
      setIsScanningActive(false);
    }
    
    try {
      await stopDeviceScan();
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ أثناء إيقاف المسح:', error);
      return false;
    }
  };
  
  return {
    isLoading: false, // دائماً نعيد false للتحميل لتسريع العملية
    hasPermission: true, // نفترض دائماً وجود الإذن لتسريع العملية
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
