
import { useState, useEffect, useCallback, useRef } from 'react';
import { useScannerSupport } from './useScannerSupport';
import { useScannerPermission } from './useScannerPermission';
import { useScannerInitialization } from './useScannerInitialization';
import { useScannerOperations } from './useScannerOperations';

/**
 * الهوك الرئيسي للماسح الضوئي MLKit
 */
export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scanCallbackRef = useRef<((value: string) => void) | null>(null);

  // استخدام الهوكات المساعدة
  const { checkScanningSupport } = useScannerSupport();
  const { ensurePermission } = useScannerPermission();
  const { initializeCamera } = useScannerInitialization();
  const { startScan, stopScan, toggleTorch } = useScannerOperations();

  // دالة لتسجيل دالة استدعاء للمسح
  const registerScanCallback = useCallback((callback: (value: string) => void) => {
    scanCallbackRef.current = callback;
  }, []);

  // دالة مغلفة لبدء المسح
  const handleStartScan = useCallback(async () => {
    try {
      console.log("[useMLKitScanner] بدء المسح...");
      
      if (!isInitialized) {
        console.log("[useMLKitScanner] الماسح غير مهيأ، محاولة التهيئة...");
        const initialized = await initializeCamera();
        if (!initialized) {
          console.log("[useMLKitScanner] فشل في تهيئة الكاميرا");
          return false;
        }
        setIsInitialized(true);
      }
      
      setIsScanning(true);
      
      const scanResult = await startScan();
      setIsScanning(false);
      
      if (scanResult.success && scanResult.code) {
        // التحقق من وجود دالة استدعاء مسجلة
        if (scanCallbackRef.current) {
          scanCallbackRef.current(scanResult.code);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في بدء المسح:", error);
      setIsScanning(false);
      return false;
    }
  }, [isInitialized, initializeCamera, startScan]);

  // دالة مغلفة لإيقاف المسح
  const handleStopScan = useCallback(async () => {
    if (!isScanning) return;
    
    const result = await stopScan();
    if (result) {
      setIsScanning(false);
    }
    
    return result;
  }, [isScanning, stopScan]);

  // دالة للتحكم بالفلاش
  const handleToggleTorch = useCallback(async (enable: boolean) => {
    return await toggleTorch(enable);
  }, [toggleTorch]);

  // تنظيف الموارد عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScan().catch(error => {
          console.error("[useMLKitScanner] خطأ في تنظيف الموارد:", error);
        });
      }
    };
  }, [isScanning, stopScan]);

  return {
    isScanning,
    isInitialized,
    initializeCamera,
    registerScanCallback,
    startScan: handleStartScan,
    stopScan: handleStopScan,
    toggleTorch: handleToggleTorch,
    checkScanningSupport
  };
};
