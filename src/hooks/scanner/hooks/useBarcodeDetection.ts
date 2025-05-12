
import { useCallback, useEffect, useRef } from 'react';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

export const useBarcodeDetection = (
  onScan: (code: string) => void,
  stopScan: () => Promise<boolean>,
  isScanningActive: boolean,
  hasScannerError: boolean,
  cameraActive: boolean
) => {
  // استخدام مرجع للتحكم في توقيت المحاكاة
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // مرجع للمؤقت الدوري للتحقق من حالة الكاميرا
  const cameraCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
      if (cameraCheckIntervalRef.current) {
        clearInterval(cameraCheckIntervalRef.current);
      }
    };
  }, []);

  // إجراء عند اكتشاف باركود
  const handleBarcodeDetected = useCallback((code: string) => {
    try {
      console.log('[useBarcodeDetection] تم اكتشاف باركود:', code);
      
      // إظهار إشعار بنجاح المسح
      Toast.show({
        text: 'تم مسح الباركود بنجاح',
        duration: 'short'
      });
      
      // استدعاء وظيفة المسح
      onScan(code);
      
      // نؤخر إيقاف المسح قليلاً للتأكد من معالجة النتيجة
      setTimeout(() => {
        stopScan();
      }, 500);
      
      return true;
    } catch (error) {
      console.error('[useBarcodeDetection] خطأ في معالجة الباركود:', error);
      return false;
    }
  }, [onScan, stopScan]);

  // وظيفة للتحقق من حالة كاميرا الويب (لتشخيص المشاكل)
  useEffect(() => {
    // فقط في بيئة الويب
    if (!Capacitor.isNativePlatform() && isScanningActive && cameraActive) {
      // إذا كان هناك فاصل زمني نشط، نقوم بإلغائه أولاً
      if (cameraCheckIntervalRef.current) {
        clearInterval(cameraCheckIntervalRef.current);
        cameraCheckIntervalRef.current = null;
      }
      
      // بدء فاصل زمني للتحقق من حالة الكاميرا
      cameraCheckIntervalRef.current = setInterval(() => {
        const videoElement = document.getElementById('scanner-video-element') as HTMLVideoElement;
        if (videoElement) {
          const isPlaying = !videoElement.paused && videoElement.readyState > 2;
          console.log('[useBarcodeDetection] فحص حالة كاميرا الويب - تشغيل:', isPlaying);
          
          // التحقق من مصدر الفيديو
          if (!videoElement.srcObject) {
            console.warn('[useBarcodeDetection] لا يوجد مصدر للفيديو!');
          }
        } else {
          console.warn('[useBarcodeDetection] لم يتم العثور على عنصر الفيديو!');
        }
      }, 5000); // كل 5 ثوانٍ
    } else if (cameraCheckIntervalRef.current) {
      clearInterval(cameraCheckIntervalRef.current);
      cameraCheckIntervalRef.current = null;
    }
    
    return () => {
      if (cameraCheckIntervalRef.current) {
        clearInterval(cameraCheckIntervalRef.current);
        cameraCheckIntervalRef.current = null;
      }
    };
  }, [isScanningActive, cameraActive]);
  
  // وظيفة محاكية للكشف عن باركود مع تأخير أطول
  useEffect(() => {
    if (isScanningActive && !hasScannerError && cameraActive) {
      console.log('[useBarcodeDetection] الماسح والكاميرا نشطان، بدء محاكاة الكشف عن باركود...');
      
      // إلغاء أي محاكاة سابقة
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
      
      // محاكاة وقت المسح - تم تعيينه إلى 30 ثانية لسماح وقت كافٍ للمستخدم بالمسح
      simulationTimeoutRef.current = setTimeout(() => {
        // التحقق مرة أخرى أن المسح لا يزال نشطًا
        if (isScanningActive && cameraActive) {
          const simulatedBarcode = `DEMO-${Math.floor(Math.random() * 9000) + 1000}`;
          console.log('[useBarcodeDetection] محاكاة اكتشاف باركود بعد 30 ثانية:', simulatedBarcode);
          handleBarcodeDetected(simulatedBarcode);
        }
      }, 30000);  // 30 ثانية

      return () => {
        if (simulationTimeoutRef.current) {
          clearTimeout(simulationTimeoutRef.current);
        }
      };
    }
  }, [isScanningActive, hasScannerError, cameraActive, handleBarcodeDetected]);

  return {
    handleBarcodeDetected
  };
};
