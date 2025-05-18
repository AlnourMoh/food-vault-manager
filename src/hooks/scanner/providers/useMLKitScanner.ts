
import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { MLKitBarcodeFormatMap } from '@/types/zxing-scanner';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scanCallbackRef = useRef<((value: string) => void) | null>(null);

  // دالة لتسجيل دالة استدعاء للمسح
  const registerScanCallback = useCallback((callback: (value: string) => void) => {
    scanCallbackRef.current = callback;
  }, []);

  // تحقق مما إذا كانت بيئة التطبيق تدعم المسح
  const checkScanningSupport = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log("[useMLKitScanner] ليست منصة أصلية، لا يمكن استخدام MLKit");
        return false;
      }
      
      const isMLKitAvailable = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
      if (!isMLKitAvailable) {
        console.log("[useMLKitScanner] ملحق MLKit غير متوفر");
        return false;
      }
      
      // التحقق من دعم المسح
      const { supported } = await BarcodeScanner.isSupported();
      console.log(`[useMLKitScanner] هل المسح مدعوم بواسطة MLKit؟: ${supported}`);
      
      return supported;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في التحقق من دعم المسح:", error);
      return false;
    }
  }, []);

  // دالة جديدة للتحقق من وضمان الحصول على أذونات الكاميرا
  const ensurePermission = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) return false;
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) return false;
      
      console.log("[useMLKitScanner] التحقق من إذن الكاميرا...");
      
      // تحقق من حالة الإذن
      const status = await BarcodeScanner.checkPermissions();
      console.log(`[useMLKitScanner] حالة إذن الكاميرا: ${status.camera}`);
      
      if (status.camera !== 'granted') {
        console.log("[useMLKitScanner] طلب إذن الكاميرا...");
        
        // محاولة إظهار رسالة توضيحية للمستخدم
        try {
          await Toast.show({
            text: 'يحتاج التطبيق إلى إذن الكاميرا للقيام بمسح الرموز',
            duration: 'short'
          });
        } catch (e) {}
        
        // طلب الإذن
        const requestResult = await BarcodeScanner.requestPermissions();
        console.log(`[useMLKitScanner] نتيجة طلب الإذن: ${requestResult.camera}`);
        
        // إذا لم يتم منح الإذن، محاولة أخرى بتفعيل force
        if (requestResult.camera !== 'granted') {
          console.log("[useMLKitScanner] محاولة طلب الإذن مع تفعيل force...");
          
          // طلب الإذن بتفعيل Force
          const forceResult = await BarcodeScanner.requestPermissions();
          return forceResult.camera === 'granted';
        }
        
        return requestResult.camera === 'granted';
      }
      
      return true;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في التحقق من الإذن:", error);
      return false;
    }
  }, []);

  // تهيئة الكاميرا
  const initializeCamera = useCallback(async () => {
    try {
      console.log("[useMLKitScanner] تهيئة الكاميرا...");
      
      // التحقق من دعم المسح
      const isSupported = await checkScanningSupport();
      if (!isSupported) {
        console.log("[useMLKitScanner] المسح غير مدعوم على هذا الجهاز");
        return false;
      }
      
      // التحقق من وضمان الحصول على أذونات الكاميرا
      const hasPermission = await ensurePermission();
      if (!hasPermission) {
        console.log("[useMLKitScanner] تم رفض إذن الكاميرا");
        
        // محاولة إظهار رسالة توجيهية للمستخدم
        try {
          await Toast.show({
            text: 'يرجى تفعيل إذن الكاميرا من إعدادات التطبيق للاستمرار',
            duration: 'long'
          });
        } catch (e) {}
        
        return false;
      }
      
      console.log("[useMLKitScanner] تحضير الماسح...");
      
      // تحضير الماسح
      await BarcodeScanner.prepare();
      console.log("[useMLKitScanner] تم تحضير الماسح بنجاح");
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في تهيئة الكاميرا:", error);
      
      // محاولة إظهار رسالة خطأ للمستخدم
      try {
        await Toast.show({
          text: `فشل في تهيئة الكاميرا: ${error.message || 'خطأ غير معروف'}`,
          duration: 'short'
        });
      } catch (e) {}
      
      return false;
    }
  }, [checkScanningSupport, ensurePermission]);

  // بدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log("[useMLKitScanner] بدء المسح...");
      
      if (!isInitialized) {
        console.log("[useMLKitScanner] الماسح غير مهيأ، محاولة التهيئة...");
        const initialized = await initializeCamera();
        if (!initialized) {
          console.log("[useMLKitScanner] فشل في تهيئة الكاميرا");
          return false;
        }
      }
      
      setIsScanning(true);
      
      // محاولة إظهار خلفية الكاميرا
      try {
        await BarcodeScanner.hideBackground();
        await BarcodeScanner.showBackground();
        console.log("[useMLKitScanner] تم إظهار خلفية الكاميرا");
      } catch (backgroundError) {
        console.warn("[useMLKitScanner] خطأ في إظهار خلفية الكاميرا:", backgroundError);
      }
      
      // بدء عملية المسح
      console.log("[useMLKitScanner] بدء عملية المسح...");
      
      // استخدام تنسيقات باركود من كائن BarcodeScanner بدلاً من السلاسل النصية
      const scanResult = await BarcodeScanner.startScan();
      setIsScanning(false);
      
      // معالجة نتيجة المسح
      if (scanResult && scanResult.hasContent) {
        console.log("[useMLKitScanner] تم العثور على رمز:", scanResult.content);
        
        // التحقق من وجود دالة استدعاء مسجلة
        if (scanCallbackRef.current && scanResult.content) {
          console.log("[useMLKitScanner] استدعاء دالة الاستدعاء مع الرمز:", scanResult.content);
          scanCallbackRef.current(scanResult.content);
        }
        
        return true;
      } else {
        console.log("[useMLKitScanner] لم يتم العثور على رموز");
        return false;
      }
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في بدء المسح:", error);
      setIsScanning(false);
      
      // محاولة إظهار رسالة خطأ للمستخدم
      try {
        await Toast.show({
          text: `خطأ في المسح: ${error.message || 'خطأ غير معروف'}`,
          duration: 'short'
        });
      } catch (e) {}
      
      return false;
    }
  }, [isInitialized, initializeCamera]);

  // إيقاف المسح
  const stopScan = useCallback(async () => {
    if (!isScanning) return;
    
    console.log("[useMLKitScanner] إيقاف المسح...");
    
    try {
      // إيقاف الفلاش إذا كان مفعلاً
      await BarcodeScanner.enableTorch({ enable: false }).catch(() => {});
      
      // إيقاف المسح
      await BarcodeScanner.stopScan();
      
      setIsScanning(false);
      console.log("[useMLKitScanner] تم إيقاف المسح بنجاح");
      
      return true;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في إيقاف المسح:", error);
      return false;
    }
  }, [isScanning]);

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
    startScan,
    stopScan
  };
};
