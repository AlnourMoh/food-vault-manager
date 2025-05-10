
import { useState, useCallback, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

interface UseBarcodeScanningOptions {
  onScan: (code: string) => void;
  onScanError?: (error: string) => void;
  onScanComplete?: () => void;
}

export const useBarcodeScanning = ({ 
  onScan, 
  onScanError, 
  onScanComplete 
}: UseBarcodeScanningOptions) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isWebRTCReady, setIsWebRTCReady] = useState(false);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    // تنظيف موارد الكاميرا عند إلغاء تحميل المكون
    return () => {
      console.log('[useBarcodeScanning] تنظيف موارد الكاميرا عند إلغاء التحميل');
      stopScan().catch(error => {
        console.error('[useBarcodeScanning] خطأ في إيقاف المسح عند التنظيف:', error);
      });
    };
  }, []);

  // إضافة استماع للأحداث في بيئة المتصفح
  useEffect(() => {
    // فقط في بيئة الويب
    if (!Capacitor.isNativePlatform()) {
      console.log('[useBarcodeScanning] إعداد WebRTC للمسح في بيئة الويب');
      
      try {
        // التحقق من دعم WebRTC
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('[useBarcodeScanning] WebRTC غير مدعوم في هذا المتصفح');
          if (onScanError) onScanError('متصفحك لا يدعم الوصول إلى الكاميرا');
          return;
        }
        
        // تهيئة WebRTC
        setTimeout(async () => {
          try {
            // التحقق من توفر الكاميرا
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasCamera = devices.some(device => device.kind === 'videoinput');
            
            if (!hasCamera) {
              console.error('[useBarcodeScanning] لم يتم العثور على كاميرا متصلة');
              if (onScanError) onScanError('لم يتم العثور على كاميرا متصلة بالجهاز');
              return;
            }
            
            setIsWebRTCReady(true);
            console.log('[useBarcodeScanning] WebRTC جاهز للاستخدام');
          } catch (error) {
            console.error('[useBarcodeScanning] خطأ في تهيئة WebRTC:', error);
          }
        }, 500);
      } catch (error) {
        console.error('[useBarcodeScanning] خطأ في إعداد WebRTC:', error);
      }
    }
  }, [onScanError]);

  // وظيفة بدء المسح
  const startScan = useCallback(async (): Promise<boolean> => {
    console.log('[useBarcodeScanning] محاولة بدء المسح');
    
    try {
      // في بيئة الويب، نستخدم WebRTC مباشرة
      if (!Capacitor.isNativePlatform()) {
        console.log('[useBarcodeScanning] بدء المسح في بيئة الويب');
        
        // التحقق من جاهزية WebRTC
        if (!isWebRTCReady) {
          console.warn('[useBarcodeScanning] WebRTC غير جاهز بعد');
          
          // محاولة جديدة لتهيئة WebRTC
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: 'environment',
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 }
              } 
            });
            
            // إيقاف المسار للتحقق من الإذن فقط
            stream.getTracks().forEach(track => track.stop());
            
            setIsWebRTCReady(true);
            setCameraActive(true);
            setIsScanningActive(true);
            
            // محاكاة مسح ناجح بعد 3 ثواني للاختبار فقط
            setTimeout(() => {
              console.log('[useBarcodeScanning] محاكاة مسح ناجح للاختبار');
              const testCode = '1234567890123';
              setLastScannedCode(testCode);
              onScan(testCode);
              
              // إيقاف المسح تلقائيًا بعد النجاح
              setIsScanningActive(false);
              if (onScanComplete) onScanComplete();
            }, 3000);
            
            return true;
          } catch (error) {
            console.error('[useBarcodeScanning] خطأ في الوصول إلى الكاميرا:', error);
            if (onScanError) onScanError('تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.');
            return false;
          }
        }
        
        // في حالة جاهزية WebRTC
        setCameraActive(true);
        setIsScanningActive(true);
        
        // محاكاة مسح ناجح بعد 3 ثواني للاختبار فقط في بيئة الويب
        setTimeout(() => {
          console.log('[useBarcodeScanning] محاكاة مسح ناجح للاختبار في بيئة الويب');
          const testCode = '9780201379624';
          setLastScannedCode(testCode);
          onScan(testCode);
          
          // إيقاف المسح تلقائيًا بعد النجاح
          setIsScanningActive(false);
          if (onScanComplete) onScanComplete();
        }, 3000);
        
        return true;
      }
      
      // في بيئة التطبيق الأصلي مع Capacitor
      console.log('[useBarcodeScanning] بدء المسح باستخدام BarcodeScanner في بيئة التطبيق');
      
      // التحقق من توفر ملحق BarcodeScanner
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.error('[useBarcodeScanning] ملحق MLKitBarcodeScanner غير متوفر');
        if (onScanError) onScanError('ملحق المسح الضوئي غير متوفر على هذا الجهاز');
        return false;
      }
      
      // بدء المسح واستماع للنتائج
      await BarcodeScanner.startScan({
        formats: ['all'],
        lensFacing: 'back',
      });
      
      // إضافة مستمع للأحداث
      BarcodeScanner.addListener('barcodeScanned', async (result: any) => {
        console.log('[useBarcodeScanning] تم مسح باركود:', result.barcode);
        
        try {
          // حفظ الكود الممسوح
          setLastScannedCode(result.barcode.rawValue);
          
          // استدعاء دالة رد الاتصال
          onScan(result.barcode.rawValue);
          
          // إيقاف المسح تلقائيًا بعد النجاح
          await BarcodeScanner.stopScan();
          setIsScanningActive(false);
          
          // استدعاء دالة اكتمال المسح
          if (onScanComplete) onScanComplete();
        } catch (error) {
          console.error('[useBarcodeScanning] خطأ في معالجة الباركود الممسوح:', error);
        }
      });
      
      setCameraActive(true);
      setIsScanningActive(true);
      
      return true;
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في بدء المسح:', error);
      if (onScanError) onScanError(error instanceof Error ? error.message : 'خطأ غير معروف في بدء المسح');
      return false;
    }
  }, [onScan, onScanError, onScanComplete, isWebRTCReady]);

  // وظيفة إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    console.log('[useBarcodeScanning] إيقاف المسح');
    
    try {
      // في بيئة الويب
      if (!Capacitor.isNativePlatform()) {
        setCameraActive(false);
        setIsScanningActive(false);
        return true;
      }
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // التحقق قبل الاستدعاء لتجنب الأخطاء
        if (isScanningActive) {
          await BarcodeScanner.removeAllListeners();
          await BarcodeScanner.stopScan();
        }
        
        setCameraActive(false);
        setIsScanningActive(false);
      }
      
      return true;
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, [isScanningActive]);

  return {
    cameraActive,
    setCameraActive,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    isWebRTCReady
  };
};
