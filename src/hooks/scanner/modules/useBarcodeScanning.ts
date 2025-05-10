
import { useState, useCallback, useEffect, useRef } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';

interface UseBarcodeScanningOptions {
  onScan: (code: string) => void;
  onScanError?: (error: string) => void;
  onScanComplete?: () => void;
  onPermissionError?: (error: string) => void;
}

export const useBarcodeScanning = ({ 
  onScan, 
  onScanError, 
  onScanComplete,
  onPermissionError
}: UseBarcodeScanningOptions) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isWebRTCReady, setIsWebRTCReady] = useState(false);
  const [webStreamRef, setWebStreamRef] = useState<MediaStream | null>(null);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  
  // مرجع للفاصل الزمني للتشخيص
  const diagIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('[useBarcodeScanning] تنظيف موارد الكاميرا عند إلغاء التحميل');
      if (diagIntervalRef.current) {
        clearInterval(diagIntervalRef.current);
      }
      stopScan().catch(error => {
        console.error('[useBarcodeScanning] خطأ في إيقاف المسح عند التنظيف:', error);
      });
    };
  }, []);
  
  // عند تهيئة المكون، نتحقق من حالة التصاريح
  useEffect(() => {
    const checkPermissionOnInit = async () => {
      try {
        // التحقق من دعم الماسح أولاً
        const isSupported = await scannerPermissionService.isSupported();
        console.log('[useBarcodeScanning] دعم الماسح الضوئي:', isSupported);
        
        if (!isSupported) {
          if (onScanError) {
            onScanError('الماسح الضوئي غير مدعوم على هذا الجهاز');
          }
          setHasScannerError(true);
          return;
        }
        
        // التحقق من وجود تصريح الكاميرا
        const hasPermission = await scannerPermissionService.checkPermission();
        console.log('[useBarcodeScanning] حالة تصريح الكاميرا عند التهيئة:', hasPermission);
        
        // في حالة عدم وجود التصريح، نعين حالة خطأ التصريح
        setHasPermissionError(!hasPermission);
        
        // في حالة تشغيل التطبيق على الويب، نعد واجهة WebRTC
        if (!Capacitor.isNativePlatform()) {
          console.log('[useBarcodeScanning] إعداد WebRTC للمسح في بيئة الويب');
          prepareWebRTC();
        }
      } catch (error) {
        console.error('[useBarcodeScanning] خطأ في التحقق من حالة التصاريح عند التهيئة:', error);
      }
    };
    
    checkPermissionOnInit();
  }, [onScanError, onPermissionError]);

  // وظيفة إعداد WebRTC لبيئة الويب
  const prepareWebRTC = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('[useBarcodeScanning] WebRTC غير مدعوم في هذا المتصفح');
          setHasScannerError(true);
          if (onScanError) onScanError('متصفحك لا يدعم الوصول إلى الكاميرا');
          return;
        }
        
        // التحقق من توفر الكاميرا
        console.log('[useBarcodeScanning] التحقق من توفر الكاميرا');
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        
        if (!hasCamera) {
          console.error('[useBarcodeScanning] لم يتم العثور على كاميرا متصلة');
          setHasScannerError(true);
          if (onScanError) onScanError('لم يتم العثور على كاميرا متصلة بالجهاز');
          return;
        }
        
        setIsWebRTCReady(true);
        console.log('[useBarcodeScanning] WebRTC جاهز للاستخدام');
      }
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في إعداد WebRTC:', error);
      setHasScannerError(true);
    }
  }, [onScanError]);
  
  // وظيفة طلب تصاريح الكاميرا
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useBarcodeScanning] طلب تصريح الكاميرا');
      
      // إعادة تعيين حالة خطأ التصريح
      setHasPermissionError(false);
      
      // استخدام خدمة التصاريح لطلب الإذن
      const granted = await scannerPermissionService.requestPermission();
      console.log('[useBarcodeScanning] نتيجة طلب تصريح الكاميرا:', granted);
      
      if (!granted) {
        console.warn('[useBarcodeScanning] تم رفض تصريح الكاميرا');
        setHasPermissionError(true);
        
        if (onPermissionError) {
          onPermissionError('تم رفض تصريح الكاميرا. الرجاء تمكينه من إعدادات جهازك.');
        }
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في طلب تصريح الكاميرا:', error);
      setHasPermissionError(true);
      
      if (onPermissionError) {
        onPermissionError('حدث خطأ أثناء طلب تصريح الكاميرا.');
      }
      
      return false;
    }
  }, [onPermissionError]);

  // وظيفة بدء المسح
  const startScan = useCallback(async (): Promise<boolean> => {
    console.log('[useBarcodeScanning] محاولة بدء المسح');
    
    try {
      // إعادة تعيين حالات الأخطاء
      setHasScannerError(false);
      
      // التحقق أولاً من وجود تصريح الكاميرا
      const hasPermission = await scannerPermissionService.checkPermission();
      console.log('[useBarcodeScanning] حالة تصريح الكاميرا قبل بدء المسح:', hasPermission);
      
      if (!hasPermission) {
        console.log('[useBarcodeScanning] لا يوجد تصريح للكاميرا، محاولة طلب التصريح');
        const granted = await requestPermission();
        if (!granted) {
          console.warn('[useBarcodeScanning] لم يتم منح تصريح الكاميرا');
          return false;
        }
      }
      
      // في بيئة الويب، نستخدم WebRTC مباشرة
      if (!Capacitor.isNativePlatform()) {
        console.log('[useBarcodeScanning] بدء المسح في بيئة الويب');
        
        // التحقق من جاهزية WebRTC
        if (!isWebRTCReady) {
          console.warn('[useBarcodeScanning] WebRTC غير جاهز بعد، محاولة إعداده');
          await prepareWebRTC();
          
          if (!isWebRTCReady) {
            console.error('[useBarcodeScanning] فشل إعداد WebRTC');
            setHasScannerError(true);
            return false;
          }
        }
        
        try {
          // في حالة وجود مسار كاميرا نشط، نغلقه أولاً
          if (webStreamRef) {
            webStreamRef.getTracks().forEach(track => track.stop());
          }
          
          // إنشاء مسار كاميرا جديد
          console.log('[useBarcodeScanning] طلب الوصول إلى الكاميرا في المتصفح');
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
          
          setCameraActive(true);
          setIsScanningActive(true);
          
          // بدء فاصل زمني للتشخيص للتأكد من أن الكاميرا لا تزال نشطة
          if (diagIntervalRef.current) {
            clearInterval(diagIntervalRef.current);
          }
          
          diagIntervalRef.current = setInterval(() => {
            if (webStreamRef) {
              const activeTracks = webStreamRef.getVideoTracks().filter(t => t.enabled && t.readyState === 'live');
              console.log(`[useBarcodeScanning] فحص دوري للكاميرا: ${activeTracks.length} مسارات نشطة`);
            }
          }, 5000); // كل 5 ثوانٍ
          
          return true;
        } catch (error) {
          console.error('[useBarcodeScanning] خطأ في الوصول إلى الكاميرا في المتصفح:', error);
          setHasScannerError(true);
          
          if (onScanError) {
            onScanError('تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.');
          }
          
          return false;
        }
      }
      
      // في بيئة التطبيق الأصلي مع Capacitor
      console.log('[useBarcodeScanning] بدء المسح باستخدام BarcodeScanner في بيئة التطبيق');
      
      // التحقق من توفر ملحق BarcodeScanner
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.error('[useBarcodeScanning] ملحق MLKitBarcodeScanner غير متوفر');
        setHasScannerError(true);
        
        if (onScanError) {
          onScanError('ملحق المسح الضوئي غير متوفر على هذا الجهاز');
        }
        
        return false;
      }
      
      try {
        // إزالة أي مستمع سابق
        await BarcodeScanner.removeAllListeners();
        
        // إضافة مستمع للأحداث
        await BarcodeScanner.addListener('barcodesScanned', async (result: any) => {
          console.log('[useBarcodeScanning] تم مسح باركود:', result.barcodes);
          
          if (result.barcodes && result.barcodes.length > 0) {
            try {
              // حفظ الكود الممسوح
              const barcode = result.barcodes[0];
              setLastScannedCode(barcode.rawValue);
              
              // عرض إشعار بنجاح المسح
              await Toast.show({
                text: 'تم مسح الباركود بنجاح',
                duration: 'short'
              });
              
              // استدعاء دالة رد الاتصال
              onScan(barcode.rawValue);
              
              // إيقاف المسح تلقائيًا بعد النجاح
              await stopScan();
              
              // استدعاء دالة اكتمال المسح
              if (onScanComplete) {
                onScanComplete();
              }
            } catch (error) {
              console.error('[useBarcodeScanning] خطأ في معالجة الباركود الممسوح:', error);
            }
          }
        });
        
        // بدء المسح - استخدام القيم الحرفية مباشرةً بدلاً من الثوابت
        await BarcodeScanner.startScan({
          formats: [
            "qr_code",    // بدلاً من BarcodeFormat.QrCode
            "ean_13",     // بدلاً من BarcodeFormat.Ean13
            "ean_8",      // بدلاً من BarcodeFormat.Ean8
            "code_128"    // بدلاً من BarcodeFormat.Code128
          ],
          lensFacing: "back", // بدلاً من LensFacing.Back
        });
        
        setCameraActive(true);
        setIsScanningActive(true);
        
        return true;
      } catch (error) {
        console.error('[useBarcodeScanning] خطأ في بدء المسح باستخدام BarcodeScanner:', error);
        setHasScannerError(true);
        
        if (onScanError) {
          if (error instanceof Error) {
            onScanError(`خطأ في بدء المسح: ${error.message}`);
          } else {
            onScanError('حدث خطأ غير معروف في بدء المسح');
          }
        }
        
        return false;
      }
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في بدء المسح:', error);
      setHasScannerError(true);
      
      if (onScanError) {
        if (error instanceof Error) {
          onScanError(error.message);
        } else {
          onScanError('خطأ غير معروف في بدء المسح');
        }
      }
      
      return false;
    }
  }, [
    isWebRTCReady, 
    webStreamRef, 
    onScan, 
    onScanError, 
    onScanComplete, 
    prepareWebRTC, 
    requestPermission
  ]);

  // وظيفة إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    console.log('[useBarcodeScanning] إيقاف المسح');
    
    try {
      // إيقاف فاصل التشخيص
      if (diagIntervalRef.current) {
        clearInterval(diagIntervalRef.current);
        diagIntervalRef.current = null;
      }
      
      // في بيئة الويب
      if (!Capacitor.isNativePlatform()) {
        // تنظيف بث الكاميرا
        if (webStreamRef) {
          console.log('[useBarcodeScanning] إيقاف بث الكاميرا في بيئة الويب');
          webStreamRef.getTracks().forEach(track => {
            try {
              track.stop();
            } catch (e) {
              console.error('[useBarcodeScanning] خطأ في إيقاف مسار الكاميرا:', e);
            }
          });
          setWebStreamRef(null);
        }
        
        // إزالة عنصر الفيديو من الصفحة
        const scannerView = document.getElementById('barcode-scanner-view');
        if (scannerView) {
          scannerView.querySelectorAll('video').forEach(v => v.remove());
        }
        
        setCameraActive(false);
        setIsScanningActive(false);
        return true;
      }
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useBarcodeScanning] إيقاف المسح باستخدام BarcodeScanner في بيئة التطبيق');
        
        try {
          // إزالة المستمع
          await BarcodeScanner.removeAllListeners();
          
          // لإيقاف المسح بالترتيب الصحيح
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
          await BarcodeScanner.showBackground().catch(() => {});
          
          setCameraActive(false);
          setIsScanningActive(false);
          
          return true;
        } catch (error) {
          console.error('[useBarcodeScanning] خطأ في إيقاف المسح:', error);
          return false;
        }
      }
      
      // إعادة تعيين الحالة في كل الحالات
      setCameraActive(false);
      setIsScanningActive(false);
      
      return true;
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في إيقاف المسح:', error);
      
      // إعادة تعيين الحالة في حالة الخطأ أيضًا
      setCameraActive(false);
      setIsScanningActive(false);
      
      return false;
    }
  }, [webStreamRef]);

  // وظيفة لإعادة المحاولة في حالة الأخطاء
  const retryScanning = useCallback(async (): Promise<boolean> => {
    console.log('[useBarcodeScanning] إعادة محاولة المسح');
    
    try {
      // إيقاف المسح القائم أولاً
      await stopScan();
      
      // انتظار لحظة قبل بدء المسح مرة أخرى
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // إعادة تعيين حالات الأخطاء
      setHasScannerError(false);
      
      // بدء المسح مرة أخرى
      return await startScan();
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في إعادة محاولة المسح:', error);
      return false;
    }
  }, [startScan, stopScan]);

  // وظيفة لفتح إعدادات التطبيق
  const openAppSettings = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useBarcodeScanning] محاولة فتح إعدادات التطبيق');
      return await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }, []);

  return {
    cameraActive,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    hasScannerError,
    hasPermissionError,
    retryScanning,
    requestPermission,
    openAppSettings
  };
};
