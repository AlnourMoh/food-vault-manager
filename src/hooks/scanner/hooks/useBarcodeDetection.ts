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
  // استخدام مرجع للتحكم في توقيت المحاكاة - سنزيل المحاكاة
  const cameraCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
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
  
  // إزالة وظيفة محاكاة للكشف عن باركود

  return {
    handleBarcodeDetected
  };
};
