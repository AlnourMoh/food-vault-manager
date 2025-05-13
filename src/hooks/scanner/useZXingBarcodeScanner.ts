
import { useState, useCallback, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useCapacitorPermission } from './capacitor/useCapacitorPermission';
import { useCapacitorScanner } from './capacitor/useCapacitorScanner';
import { useCapacitorUI } from './capacitor/useCapacitorUI';
import { useToast } from '@/hooks/use-toast';

export const useZXingBarcodeScanner = (
  autoStart: boolean = false,
  onScan: (code: string) => void,
  onClose: () => void
) => {
  // الحالة الخاصة بالمنصة
  const [isNativePlatform, setIsNativePlatform] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  
  // استخدام الهوك الفرعية
  const permission = useCapacitorPermission();
  const scanner = useCapacitorScanner(onScan);
  const ui = useCapacitorUI();
  
  const { toast } = useToast();
  const mountedRef = useRef<boolean>(true);

  // التهيئة عند التحميل
  useEffect(() => {
    // تحديد نوع المنصة
    const platform = Capacitor.isNativePlatform();
    setIsNativePlatform(platform);
    
    // إذا كنا على منصة أصلية، نتحقق من الأذونات
    if (platform) {
      permission.checkSupportAndPermission().catch(console.error);
    }
    
    // عند إلغاء التحميل
    return () => {
      mountedRef.current = false;
      if (scanner.isScanning) {
        stopScan().catch(console.error);
      }
    };
  }, []);
  
  // بدء المسح تلقائيًا عند منح الإذن
  useEffect(() => {
    if (permission.hasPermission === true && autoStart) {
      startScan().catch(console.error);
    }
  }, [permission.hasPermission, autoStart]);

  /**
   * بدء عملية المسح
   */
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      // التحقق من الإذن
      const hasPermissionGranted = permission.hasPermission || 
        await permission.requestPermission();
      
      if (!hasPermissionGranted) {
        toast({
          title: "فشل في بدء المسح",
          description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
          variant: "destructive"
        });
        return false;
      }
      
      // إعداد واجهة المستخدم
      ui.setupScannerUI();
      setCameraActive(true);
      
      // بدء المسح
      const result = await scanner.startScan();
      return result;
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      
      // استعادة واجهة المستخدم في حالة الخطأ
      ui.restoreUI();
      setCameraActive(false);
      
      toast({
        title: "خطأ في بدء المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح",
        variant: "destructive"
      });
      
      return false;
    }
  }, [permission.hasPermission, permission.requestPermission, scanner.startScan, ui.setupScannerUI, toast]);

  /**
   * إيقاف عملية المسح
   */
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      await scanner.stopScan();
      ui.restoreUI();
      setCameraActive(false);
      return true;
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
      return false;
    }
  }, [scanner.stopScan, ui.restoreUI]);

  /**
   * التحقق من إذن الكاميرا وطلبه إذا لزم الأمر
   */
  const checkAndRequestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermissionAlready = await permission.checkPermission();
      
      if (!hasPermissionAlready) {
        return await permission.requestPermission();
      }
      
      return hasPermissionAlready;
    } catch (error) {
      console.error('خطأ في فحص وطلب الأذونات:', error);
      return false;
    }
  }, [permission.checkPermission, permission.requestPermission]);

  return {
    isNativePlatform,
    hasPermission: permission.hasPermission,
    scanActive: scanner.isScanning,
    cameraActive,
    startScan,
    stopScan,
    checkAndRequestPermissions,
    isLoading: permission.isLoading
  };
};
