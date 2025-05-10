
import { useState, useCallback, useEffect } from 'react';
import { BarcodeScanner, BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning';
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
  const [webStreamRef, setWebStreamRef] = useState<MediaStream | null>(null);
  
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
            
            // حفظ المسار لاستخدامه وإغلاقه لاحقًا
            setWebStreamRef(stream);
            
            // تهيئة عنصر الفيديو وتعيينه
            const videoElement = document.createElement('video');
            videoElement.id = 'scanner-video-element';
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            
            // إضافة عنصر الفيديو إلى الصفحة
            const scannerView = document.getElementById('barcode-scanner-view');
            if (scannerView) {
              // إزالة أي عنصر فيديو سابق
              scannerView.querySelectorAll('video').forEach(v => v.remove());
              scannerView.appendChild(videoElement);
            }
            
            setIsWebRTCReady(true);
            setCameraActive(true);
            setIsScanningActive(true);
            
            // تأخر محاكاة المسح الناجح لـ 30 ثانية بدلاً من 3 ثواني للسماح بالاختبار الأطول
            console.log('[useBarcodeScanning] الكاميرا ستبقى مفعلة لفترة أطول للمسح');
            
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
        
        // إنشاء بث كاميرا جديد إذا لم يكن موجودًا
        if (!webStreamRef) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
              } 
            });
            
            setWebStreamRef(stream);
            
            // تهيئة عنصر الفيديو
            const videoElement = document.createElement('video');
            videoElement.id = 'scanner-video-element';
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            
            // إضافة عنصر الفيديو إلى الصفحة
            const scannerView = document.getElementById('barcode-scanner-view');
            if (scannerView) {
              scannerView.querySelectorAll('video').forEach(v => v.remove());
              scannerView.appendChild(videoElement);
            }
          } catch (error) {
            console.error('[useBarcodeScanning] خطأ في إنشاء بث كاميرا جديد:', error);
            if (onScanError) onScanError('تعذر إنشاء بث كاميرا جديد');
            return false;
          }
        }
        
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
        formats: [BarcodeFormat.QrCode, BarcodeFormat.Ean13, BarcodeFormat.Ean8, BarcodeFormat.Code128],
        lensFacing: LensFacing.Back,
      });
      
      // إضافة مستمع للأحداث
      BarcodeScanner.addListener('barcodesScanned', async (result: any) => {
        console.log('[useBarcodeScanning] تم مسح باركود:', result.barcodes);
        
        try {
          if (result.barcodes && result.barcodes.length > 0) {
            // حفظ الكود الممسوح
            const barcode = result.barcodes[0];
            setLastScannedCode(barcode.rawValue);
            
            // استدعاء دالة رد الاتصال
            onScan(barcode.rawValue);
            
            // إيقاف المسح تلقائيًا بعد النجاح
            await BarcodeScanner.stopScan();
            setIsScanningActive(false);
            
            // استدعاء دالة اكتمال المسح
            if (onScanComplete) onScanComplete();
          }
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
  }, [onScan, onScanError, onScanComplete, isWebRTCReady, webStreamRef]);

  // وظيفة إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    console.log('[useBarcodeScanning] إيقاف المسح');
    
    try {
      // في بيئة الويب
      if (!Capacitor.isNativePlatform()) {
        // تنظيف بث الكاميرا
        if (webStreamRef) {
          console.log('[useBarcodeScanning] إيقاف بث الكاميرا في بيئة الويب');
          webStreamRef.getTracks().forEach(track => track.stop());
          setWebStreamRef(null);
        }
        
        // إزالة عنصر الفيديو
        const videoElement = document.getElementById('scanner-video-element');
        if (videoElement && videoElement.parentNode) {
          videoElement.parentNode.removeChild(videoElement);
        }
        
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
  }, [isScanningActive, webStreamRef]);

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
