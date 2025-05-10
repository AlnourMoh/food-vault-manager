
import { useState, useEffect, useCallback } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';

export const useScannerPermission = (
  setIsLoading: (isLoading: boolean) => void,
  setHasPermission: (hasPermission: boolean | null) => void,
  setHasScannerError: (hasScannerError: boolean) => void
) => {
  // فحص الأذونات
  const checkPermissions = useCallback(
    async (
      autoStart: boolean,
      requestCameraCallback: () => Promise<boolean>
    ): Promise<void> => {
      console.log("useScannerPermission: فحص الأذونات، autoStart =", autoStart);
      setIsLoading(true);

      try {
        // التحقق من دعم الماسح الضوئي
        const isSupported = await scannerPermissionService.isSupported();
        console.log("useScannerPermission: دعم الماسح =", isSupported);

        if (!isSupported) {
          console.error("useScannerPermission: الجهاز لا يدعم الماسح الضوئي");
          setHasPermission(false);
          setHasScannerError(true);
          await Toast.show({
            text: 'جهازك لا يدعم الماسح الضوئي',
            duration: 'long'
          });
          setIsLoading(false);
          return;
        }

        // التحقق من وجود إذن الكاميرا
        const hasPermission = await scannerPermissionService.checkPermission();
        console.log("useScannerPermission: إذن الكاميرا =", hasPermission);
        
        setHasPermission(hasPermission);

        // إذا تم منح الإذن وطلب البدء التلقائي، نبدأ تشغيل الكاميرا
        if (hasPermission && autoStart) {
          console.log("useScannerPermission: بدء تشغيل الكاميرا تلقائياً");
          await requestCameraCallback();
        }

        setIsLoading(false);
      } catch (error) {
        console.error("useScannerPermission: خطأ في فحص الأذونات:", error);
        setHasScannerError(true);
        setHasPermission(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setHasPermission, setHasScannerError]
  );

  return { checkPermissions };
};
