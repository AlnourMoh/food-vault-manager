
import { useState, useCallback, useEffect } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useScannerCleanup } from './modules/useScannerCleanup';
import { useScannerActivation } from './modules/useScannerActivation';
import { useScannerPermission } from './modules/useScannerPermission';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScanner = ({
  onScan,
  onClose,
  autoStart = true
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  // Declare stopScan early as a function reference that will be defined later
  // This resolves the "used before declaration" error
  const stopScanRef = useCallback(async (): Promise<boolean> => {
    try {
      console.log('useZXingBarcodeScanner: إيقاف المسح...');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // إيقاف المسح وإزالة المستمعين
          await BarcodeScanner.stopScan();
          console.log('تم إيقاف مسح الباركود');
        } catch (e) {
          console.error('خطأ في إيقاف مسح MLKitBarcodeScanner:', e);
        }
      }
      
      setIsScanningActive(false);
      return true;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  const { checkPermissions, requestPermission } = useScannerPermission(setIsLoading, setHasPermission, setHasScannerError);
  const { activateCamera } = useScannerActivation(cameraActive, setCameraActive, hasPermission, requestPermission, startScan, setIsLoading, setHasScannerError);
  
  useEffect(() => {
    const initPermissions = async () => {
      await checkPermissions(autoStart, activateCamera);
    };
    
    initPermissions();
  }, [autoStart, checkPermissions, activateCamera]);
  
  // وظيفة لبدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log('useZXingBarcodeScanner: محاولة بدء المسح...');
      
      // التأكد من تفعيل الكاميرا أولاً
      if (!cameraActive) {
        console.log('useZXingBarcodeScanner: الكاميرا غير نشطة، محاولة تفعيلها أولاً...');
        
        const cameraActivated = await activateCamera();
        if (!cameraActivated) {
          console.error('useZXingBarcodeScanner: فشل في تفعيل الكاميرا، لا يمكن بدء المسح');
          return false;
        }
      }
      
      // بدء المسح الفعلي
      setIsScanningActive(true);
      
      // تهيئة وبدء المسح حسب المنصة
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('بدء استخدام MLKitBarcodeScanner للمسح...');
          
          // تهيئة حدث المسح - تغيير من "barcodeScanned" إلى "barcodesScanned" (الصيغة الجمع)
          const listener = await BarcodeScanner.addListener(
            'barcodesScanned',
            async result => {
              try {
                console.log('تم اكتشاف باركود:', result.barcodes);
                // إيقاف المسح وإرسال النتيجة
                await stopScanRef();
                if (result.barcodes && result.barcodes.length > 0) {
                  onScan(result.barcodes[0].rawValue || '');
                }
              } catch (e) {
                console.error('خطأ في معالجة نتيجة المسح:', e);
              }
            }
          );
          
          // بدء المسح باستخدام واجهة MLKit مباشرة
          // تصحيح الخطأ هنا - BarcodeScanner.startScan() لا يتوقع أي وسائط
          await BarcodeScanner.startScan();
          
          console.log('تم بدء مسح الباركود بنجاح');
          return true;
        } catch (e) {
          console.error('خطأ في بدء مسح MLKitBarcodeScanner:', e);
          setIsScanningActive(false);
          setHasScannerError(true);
          return false;
        }
      } else {
        // في بيئة المحاكاة أو الويب
        console.log('المسح جاهز في بيئة المحاكاة، انتظار تحديد الباركود');
        
        // محاكاة نجاح عملية المسح للاختبار
        // في بيئة حقيقية، سيتم استخدام الكاميرا الفعلية
        setTimeout(() => {
          console.log('محاكاة اكتشاف باركود للاختبار');
          onScan('mock-barcode-123456789');
        }, 5000);
        
        return true;
      }
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      return false;
    }
  }, [cameraActive, activateCamera, onScan, stopScanRef]);
  
  // Use our early reference to avoid the circular reference issue
  const stopScan = stopScanRef;
  
  // وظيفة لإعادة المحاولة بعد حدوث خطأ
  const handleRetry = useCallback(() => {
    console.log('useZXingBarcodeScanner: إعادة المحاولة بعد حدوث خطأ...');
    setHasScannerError(false);
    setCameraActive(false);
    
    // محاولة تفعيل الكاميرا وبدء المسح مجدداً
    setTimeout(() => {
      activateCamera().then(activated => {
        if (activated) {
          startScan();
        }
      });
    }, 500);
  }, [activateCamera, startScan]);
  
  // استخدام hook للتنظيف عند إلغاء تحميل المكون
  useScannerCleanup(isScanningActive, stopScan);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    cameraActive,
    hasScannerError,
    startScan,
    stopScan,
    activateCamera,
    requestPermission,
    handleRetry
  };
};
