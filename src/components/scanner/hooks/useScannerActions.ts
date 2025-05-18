
import { useCallback, useEffect } from 'react';
import { useScannerDevice } from '@/hooks/scanner/useScannerDevice';
import { useToast } from '@/hooks/use-toast';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import '@/types/barcode-scanner-augmentation.d.ts';

interface UseScannerActionsProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
  scannerState: any;
}

export const useScannerActions = ({
  onScan,
  onClose,
  autoStart = false,
  scannerState
}: UseScannerActionsProps) => {
  const { isLoading, setIsLoading, hasError, setHasError, isScanning, setIsScanning } = scannerState;
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  const { toast } = useToast();
  const { hasPermission, requestPermission } = useCameraPermissions();
  
  // تسجيل معلومات التشخيص
  useEffect(() => {
    console.log('ScannerActions: العناصر متوفرة:', {
      isLoading,
      hasError,
      isScanning,
      hasPermission
    });
    
    // محاولة عرض معلومات النظام في بيئة الجوال
    if (Capacitor.isNativePlatform()) {
      Toast.show({
        text: `حالة الماسح: ${hasPermission ? 'مسموح' : 'غير مسموح'}`,
        duration: 'short'
      }).catch(error => {
        console.error('خطأ في عرض Toast:', error);
      });
    }
  }, [isLoading, hasError, isScanning, hasPermission]);
  
  // دالة بدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log('ScannerActions: بدء المسح...');
      setHasError(false);
      setIsLoading(true);
      
      // التحقق من الإذن
      if (hasPermission === false) {
        console.log('ScannerActions: طلب إذن الكاميرا');
        const granted = await requestPermission();
        
        if (!granted) {
          console.log('ScannerActions: رفض الإذن');
          setHasError(true);
          setIsLoading(false);
          
          toast({
            title: "فشل في بدء المسح",
            description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
          
          return;
        }
      }
      
      setIsScanning(true);
      setIsLoading(false);
      
      // معالجة نتيجة المسح
      const handleScanResult = (code: string) => {
        console.log('ScannerActions: تم مسح الكود:', code);
        
        setIsScanning(false);
        onScan(code);
        
        // عرض رسالة تأكيد المسح
        if (Capacitor.isNativePlatform()) {
          Toast.show({
            text: `تم مسح الكود: ${code}`,
            duration: 'short'
          }).catch(error => {
            console.error('خطأ في عرض Toast:', error);
          });
        }
      };
      
      // بدء المسح باستخدام جهاز المسح المتوفر
      const scanResult = await startDeviceScan(handleScanResult);
      
      if (!scanResult) {
        console.log('ScannerActions: فشل في بدء المسح');
        setHasError(true);
        setIsScanning(false);
        
        toast({
          title: "فشل في بدء المسح",
          description: "لم يتمكن التطبيق من بدء الماسح الضوئي",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('ScannerActions: خطأ في بدء المسح:', error);
      setHasError(true);
      setIsScanning(false);
      setIsLoading(false);
      
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء بدء المسح",
        variant: "destructive"
      });
    }
  }, [hasPermission, requestPermission, startDeviceScan, onScan, setHasError, setIsLoading, setIsScanning, toast]);
  
  // دالة إيقاف المسح
  const stopScan = useCallback(async () => {
    try {
      console.log('ScannerActions: إيقاف المسح...');
      await stopDeviceScan().catch(error => {
        console.error('خطأ في إيقاف المسح:', error);
      });
      
      setIsScanning(false);
      return true;
    } catch (error) {
      console.error('ScannerActions: خطأ في إيقاف المسح:', error);
      setIsScanning(false);
      return false;
    }
  }, [stopDeviceScan, setIsScanning]);
  
  // تنظيف الموارد عند إزالة المكون
  useEffect(() => {
    return () => {
      if (isScanning) {
        console.log('ScannerActions: إيقاف المسح عند التنظيف');
        stopDeviceScan().catch(error => {
          console.error('خطأ في إيقاف المسح عند التنظيف:', error);
        });
      }
    };
  }, [isScanning, stopDeviceScan]);
  
  return {
    startScan,
    stopScan
  };
};
