
import { useState, useEffect } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScannerHook = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  // فحص الأذونات عند تحميل المكون
  useEffect(() => {
    const checkPermission = async () => {
      try {
        console.log("useZXingBarcodeScannerHook: جاري فحص إذن الكاميرا...");
        setIsLoading(true);
        
        let isGranted = false;
        
        // فحص الإذن باستخدام MLKitBarcodeScanner إذا كان متاحًا
        if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const status = await BarcodeScanner.checkPermissions();
          isGranted = status.camera === 'granted';
          console.log("نتيجة فحص إذن MLKitBarcodeScanner:", isGranted);
        } 
        // في بيئة الويب، محاولة طلب الإذن مباشرة
        else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            isGranted = true;
            console.log("تم منح إذن كاميرا المتصفح");
          } catch (err) {
            console.log("تم رفض إذن كاميرا المتصفح");
            isGranted = false;
          }
        }
        
        setHasPermission(isGranted);
        
        // إذا كان لدينا إذن وأردنا البدء تلقائيًا، قم بتفعيل الكاميرا
        if (isGranted && autoStart) {
          activateCamera();
        }
      } catch (error) {
        console.error("خطأ في فحص الأذونات:", error);
        setScannerError("حدث خطأ أثناء فحص أذونات الكاميرا");
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermission();
  }, [autoStart]);
  
  // طلب إذن الكاميرا
  const requestPermission = async () => {
    try {
      console.log("useZXingBarcodeScannerHook: جاري طلب إذن الكاميرا...");
      setIsLoading(true);
      
      let isGranted = false;
      
      // استخدام MLKitBarcodeScanner إذا كان متاحًا
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("useZXingBarcodeScannerHook: محاولة طلب الإذن من MLKitBarcodeScanner...");
        
        const result = await BarcodeScanner.requestPermissions();
        isGranted = result.camera === 'granted';
        
        console.log("نتيجة طلب إذن MLKitBarcodeScanner:", isGranted);
        
        if (isGranted) {
          activateCamera();
        }
      } 
      // في بيئة الويب، محاولة طلب الإذن مباشرة
      else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          isGranted = true;
          console.log("تم منح إذن كاميرا المتصفح");
        } catch (err) {
          console.log("تم رفض إذن كاميرا المتصفح");
          isGranted = false;
        }
      }
      
      setHasPermission(isGranted);
      
      if (isGranted) {
        activateCamera();
      }
      
      return isGranted;
    } catch (error) {
      console.error("خطأ في طلب الإذن:", error);
      setScannerError("حدث خطأ أثناء طلب إذن الكاميرا");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // تفعيل الكاميرا
  const activateCamera = async () => {
    try {
      console.log("useZXingBarcodeScannerHook: جاري تفعيل الكاميرا...");
      setIsLoading(true);
      
      let activated = false;
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // التحقق من دعم جهاز المستخدم للماسح
          const supported = await BarcodeScanner.isSupported();
          console.log("هل الجهاز يدعم المسح:", supported.supported);
          
          if (supported.supported) {
            // تهيئة الماسح
            console.log("إعداد الكاميرا والبدء في المسح...");
            
            // بدء المسح
            await BarcodeScanner.scan({
              formats: [
                BarcodeFormat.QrCode,
                BarcodeFormat.Ean13,
                BarcodeFormat.Ean8,
                BarcodeFormat.Code39,
                BarcodeFormat.Code128
              ]
            });
            
            // استخدام اسم الحدث الصحيح "barcodesScanned"
            const result = await BarcodeScanner.addListener('barcodesScanned', (result) => {
              // استدعاء دالة onScan عندما يتم مسح رمز شريطي
              if (result && result.barcodes && result.barcodes.length > 0) {
                console.log("تم العثور على رمز:", result.barcodes[0].rawValue);
                onScan(result.barcodes[0].rawValue);
              }
            });
            
            activated = true;
            console.log("تم بدء المسح بنجاح");
          } else {
            setScannerError("جهازك لا يدعم مسح الباركود");
          }
        } catch (err) {
          console.error("خطأ في تفعيل الكاميرا:", err);
          setScannerError("تعذر تفعيل الكاميرا");
        }
      } else {
        // في بيئة الويب أو عند عدم توفر الملحق، نقوم بمحاكاة التفعيل للاختبار
        console.log("نحن في بيئة الويب أو الملحق غير متوفر، محاكاة فتح الكاميرا...");
        
        // لأغراض الاختبار، نفترض أن الكاميرا مفعلة
        await new Promise(resolve => setTimeout(resolve, 1000));
        activated = true;
        
        // محاكاة وجود مسح بعد فترة
        setTimeout(() => {
          console.log("محاكاة عملية مسح ناجحة");
          onScan("TEST_QR_CODE_123456");
        }, 5000);
      }
      
      setCameraActive(activated);
      return activated;
    } catch (error) {
      console.error("خطأ في تفعيل الكاميرا:", error);
      setScannerError("حدث خطأ أثناء تفعيل الكاميرا");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // إعادة المحاولة بعد حدوث خطأ
  const handleRetry = () => {
    setScannerError(null);
    activateCamera();
  };

  return {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError,
    requestPermission,
    handleRetry
  };
};
