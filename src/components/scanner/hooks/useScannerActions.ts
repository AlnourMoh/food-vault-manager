
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { platformService } from '@/services/scanner/PlatformService';

export interface ScannerActionsProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart: boolean;
  scannerState: ReturnType<typeof import('./useScannerState').useScannerState>;
}

export const useScannerActions = ({ 
  onScan, 
  onClose, 
  autoStart, 
  scannerState 
}: ScannerActionsProps) => {
  const { isLoading, setIsLoading, hasError, setHasError, isScanning, setIsScanning } = scannerState;
  const { toast } = useToast();
  
  useEffect(() => {
    if (autoStart) {
      startScan();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      stopScan();
    };
  }, []);

  const startScan = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // تحسين اكتشاف البيئة باستخدام الخدمة المحسنة
      const isNativePlatform = platformService.isNativePlatform();
      const isWebView = platformService.isWebView();
      const isInstalledApp = platformService.isInstalledApp();
      
      // تسجيل تفاصيل التشخيص
      console.log('[useScannerActions] بدء المسح في البيئة:', {
        isNativePlatform,
        isWebView,
        isInstalledApp,
        userAgent: navigator.userAgent
      });
      
      // التحقق من توفر ملحق المسح
      if (!isNativePlatform || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // نتحقق من اكتشاف البيئة الأصلية بطرق متعددة
        if (isNativePlatform || isWebView || isInstalledApp) {
          console.log('[useScannerActions] في بيئة أصلية ولكن ملحق MLKitBarcodeScanner غير متوفر');
          // نستمر للتعامل مع أوضاع الأجهزة المختلفة
        } else {
          // إذا كنا متأكدين أننا في متصفح، نعرض رسالة مناسبة
          setHasError(true);
          setIsLoading(false);
          
          toast({
            title: "المسح غير متاح",
            description: "ميزة المسح غير متاحة في المتصفح، يرجى استخدام تطبيق الهاتف",
            variant: "destructive"
          });
          return;
        }
      }
      
      const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
      
      // التحقق من دعم المسح
      const isSupportResult = await BarcodeScanner.isSupported();
      if (!isSupportResult.supported) {
        console.log('[useScannerActions] جهاز لا يدعم المسح:', isSupportResult);
        setHasError(true);
        setIsLoading(false);
        
        toast({
          title: "خطأ في المسح",
          description: "هذا الجهاز لا يدعم قراءة الباركود",
          variant: "destructive"
        });
        return;
      }
      
      // طلب أذونات الكاميرا
      const { camera } = await BarcodeScanner.requestPermissions();
      
      if (camera !== 'granted') {
        console.log('[useScannerActions] تم رفض إذن الكاميرا:', camera);
        setHasError(true);
        setIsLoading(false);
        
        toast({
          title: "تم رفض الإذن",
          description: "يجب السماح باستخدام الكاميرا للمسح",
          variant: "destructive"
        });
        return;
      }
      
      setIsScanning(true);
      setIsLoading(false);
      
      const result = await BarcodeScanner.scan();
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          onScan(code);
          
          toast({
            title: "تم المسح بنجاح",
            description: `تم مسح الرمز: ${code}`,
          });
        }
      }
      
      stopScan();
      
    } catch (error) {
      console.error('[useScannerActions] خطأ في المسح:', error);
      setHasError(true);
      setIsLoading(false);
      setIsScanning(false);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء عملية المسح",
        variant: "destructive"
      });
    }
  };

  const stopScan = async () => {
    setIsScanning(false);
    
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      try {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        await BarcodeScanner.enableTorch(false);
        // هنا كان الخطأ - يجب استدعاء stopScan بدون وسيطات
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('[useScannerActions] خطأ في إيقاف المسح:', error);
      }
    }
  };
  
  return {
    startScan,
    stopScan
  };
};
