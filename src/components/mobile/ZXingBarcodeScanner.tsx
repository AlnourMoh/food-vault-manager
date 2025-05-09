
import React, { useEffect, useState } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { X, Camera, RefreshCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  
  // فحص الأذونات عند تحميل المكون
  useEffect(() => {
    const checkPermission = async () => {
      try {
        console.log("ZXingBarcodeScanner: جاري فحص إذن الكاميرا...");
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
      console.log("ZXingBarcodeScanner: جاري طلب إذن الكاميرا...");
      setIsLoading(true);
      
      let isGranted = false;
      
      // استخدام MLKitBarcodeScanner إذا كان متاحًا
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("ZXingBarcodeScanner: محاولة طلب الإذن من MLKitBarcodeScanner...");
        
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
      console.log("ZXingBarcodeScanner: جاري تفعيل الكاميرا...");
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
            // استخدام BarcodeFormat الصحيح من الكائن المستورد
            await BarcodeScanner.scan({
              formats: [
                BarcodeFormat.QR_CODE,
                BarcodeFormat.EAN_13,
                BarcodeFormat.EAN_8,
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_128
              ],
              scanMode: "SINGLE", // Scan once and return the result
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

  // عرض شاشة التحميل
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
        <Spinner className="h-12 w-12 text-white" />
        <p className="text-white mt-4">جاري تجهيز الكاميرا...</p>
        <Button variant="ghost" onClick={onClose} className="mt-4 text-white">
          إلغاء
        </Button>
      </div>
    );
  }
  
  // عرض شاشة طلب الإذن
  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
        <div className="bg-background rounded-lg p-6 w-full max-w-md text-center">
          <div className="mx-auto bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Camera className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">يلزم إذن الكاميرا</h2>
          <p className="text-muted-foreground mb-6">
            يرجى السماح باستخدام الكاميرا لمسح الرموز الشريطية
          </p>
          <div className="space-y-2">
            <Button onClick={requestPermission} className="w-full">
              <Camera className="h-4 w-4 ml-2" />
              السماح باستخدام الكاميرا
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              <X className="h-4 w-4 ml-2" />
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // عرض شاشة الخطأ
  if (scannerError) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
        <div className="bg-background rounded-lg p-6 w-full max-w-md text-center">
          <div className="mx-auto bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <RefreshCw className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">حدث خطأ</h2>
          <p className="text-muted-foreground mb-6">{scannerError}</p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              <X className="h-4 w-4 ml-2" />
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // عرض الكاميرا النشطة
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <div 
        className="barcode-scanner-view"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      >
        {cameraActive ? (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-72 h-72 border-4 border-white/80 rounded-lg opacity-80 shadow-inner"></div>
            </div>
            <p className="absolute bottom-32 left-0 right-0 text-center text-white text-lg font-medium">
              وجه الكاميرا نحو الرمز الشريطي
            </p>
          </>
        ) : (
          <div className="text-white text-center">
            <p>جاري تشغيل الكاميرا...</p>
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/20 text-white rounded-full p-2 w-10 h-10"
        size="icon"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ZXingBarcodeScanner;
