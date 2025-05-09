
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

// المكون الرئيسي لماسح الباركود
const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({
  onScan,
  onClose,
  autoStart = false
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // تنظيف الموارد عند إغلاق الماسح
  const cleanup = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف المسح لأجهزة الجوال
        BarcodeScanner.stopScan();
      }
      
      setIsInitialized(false);
      setIsScanning(false);
    } catch (e) {
      console.error('خطأ أثناء تنظيف موارد الماسح:', e);
    }
  };
  
  // تهيئة الماسح عند تحميل المكون
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تهيئة الماسح');
    
    const initialize = async () => {
      try {
        // بيئة الجوال
        if (Capacitor.isNativePlatform()) {
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            // التحقق من دعم الماسح
            const { supported } = await BarcodeScanner.isSupported();
            
            if (supported) {
              console.log('ZXingBarcodeScanner: MLKitBarcodeScanner مدعوم');
              
              // التحقق من الإذن
              const permission = await BarcodeScanner.checkPermissions();
              setHasPermission(permission.camera === 'granted');
              
              if (permission.camera === 'granted') {
                setIsInitialized(true);
                
                // بدء المسح تلقائياً إذا كان مطلوباً
                if (autoStart) {
                  setTimeout(() => {
                    startScan();
                  }, 500);
                }
              } else {
                // طلب الإذن
                const result = await BarcodeScanner.requestPermissions();
                setHasPermission(result.camera === 'granted');
                
                if (result.camera === 'granted') {
                  setIsInitialized(true);
                  
                  // بدء المسح تلقائياً بعد منح الإذن
                  if (autoStart) {
                    setTimeout(() => {
                      startScan();
                    }, 500);
                  }
                } else {
                  setError('تم رفض إذن الكاميرا');
                  Toast.show({
                    text: 'لا يمكن استخدام الماسح بدون إذن الكاميرا',
                    duration: 'short'
                  });
                }
              }
            } else {
              setError('الجهاز لا يدعم مسح الباركود');
              Toast.show({
                text: 'الجهاز لا يدعم مسح الباركود',
                duration: 'short'
              });
            }
          } else {
            // محاكاة نجاح التهيئة للتجربة
            setIsInitialized(true);
            setHasPermission(true);
            
            if (autoStart) {
              setTimeout(() => {
                startScan();
              }, 500);
            }
          }
        }
        // بيئة الويب
        else {
          console.log('ZXingBarcodeScanner: نحن في بيئة الويب، استخدام API الويب');
          // في بيئة الويب، نفترض أن الماسح مدعوم دائمًا
          setIsInitialized(true);
          
          // بدء المسح تلقائياً في بيئة الويب إذا كان مطلوباً
          if (autoStart) {
            setTimeout(() => {
              startWebCamera();
            }, 500);
          }
        }
      } catch (e) {
        console.error('خطأ في تهيئة الماسح:', e);
        setError('حدث خطأ أثناء تهيئة الماسح الضوئي');
      }
    };
    
    initialize();
    
    // تنظيف الموارد عند إلغاء تحميل المكون
    return cleanup;
  }, []);
  
  // بدء المسح في بيئة الويب
  const startWebCamera = async () => {
    try {
      console.log('ZXingBarcodeScanner: بدء المسح في بيئة الويب');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('المتصفح لا يدعم الوصول إلى الكاميرا');
        return;
      }
      
      // طلب الوصول إلى الكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (!videoRef.current) return;
      
      // تخزين المسار لاستخدامه لاحقًا عند التنظيف
      streamRef.current = stream;
      
      // تعيين المسار للفيديو
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
      setIsScanning(true);
      setHasPermission(true);
      
      // هنا يمكن إضافة كود لمسح الباركود من الفيديو
      // لكن في هذا المثال، سنستخدم وظيفة محاكاة فقط للتجربة
      simulateBarcodeDetection();
    } catch (error) {
      console.error('خطأ في بدء الكاميرا:', error);
      setError('تعذر الوصول إلى الكاميرا');
      setHasPermission(false);
    }
  };
  
  // وظيفة لمحاكاة اكتشاف الباركود في بيئة الويب
  const simulateBarcodeDetection = () => {
    // عرض رسالة للمستخدم أننا نستخدم محاكاة
    Toast.show({
      text: 'محاكاة مسح الباركود... انقر على الشاشة عندما تكون جاهزًا',
      duration: 'long'
    });
    
    // إضافة مستمع نقرات للصفحة لمحاكاة مسح الباركود
    const handleClick = () => {
      // إنشاء رمز باركود عشوائي للتجربة
      const randomBarcode = `TEST${Math.floor(Math.random() * 1000000)}`;
      console.log('تم اكتشاف باركود (محاكاة):', randomBarcode);
      
      // استدعاء وظيفة المسح مع الرمز المحاكى
      onScan(randomBarcode);
      
      // إزالة المستمع
      document.removeEventListener('click', handleClick);
    };
    
    // إضافة المستمع
    document.addEventListener('click', handleClick);
  };
  
  // بدء المسح على أجهزة الجوال
  const startScan = async () => {
    try {
      console.log('ZXingBarcodeScanner: بدء المسح');
      
      if (!isInitialized) {
        console.error('ZXingBarcodeScanner: لم تتم تهيئة الماسح بعد');
        return;
      }
      
      // في بيئة الجوال
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('ZXingBarcodeScanner: استخدام MLKitBarcodeScanner للمسح');
          
          // تعيين معالج للاستجابة
          const listener = await BarcodeScanner.addListener(
            "barcodesScanned",
            async result => {
              console.log('تم مسح الباركود:', result);
              
              // استدعاء وظيفة المسح مع الرمز المكتشف
              if (result && result.barcodes && result.barcodes.length > 0) {
                onScan(result.barcodes[0].rawValue || '');
              }
              
              // إلغاء المستمع
              listener.remove();
            }
          );
          
          // بدء المسح
          await BarcodeScanner.startScan();
          setIsScanning(true);
        } else {
          console.log('ZXingBarcodeScanner: محاكاة المسح');
          setIsScanning(true);
          simulateBarcodeDetection();
        }
      }
      // في بيئة الويب
      else {
        await startWebCamera();
      }
    } catch (e) {
      console.error('خطأ في بدء المسح:', e);
      setError('حدث خطأ أثناء بدء المسح');
      setIsScanning(false);
    }
  };
  
  // إيقاف المسح
  const stopScan = async () => {
    try {
      console.log('ZXingBarcodeScanner: إيقاف المسح');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.stopScan();
      }
      
      // إيقاف الفيديو في بيئة الويب
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setIsScanning(false);
    } catch (e) {
      console.error('خطأ في إيقاف المسح:', e);
    }
  };
  
  // إعادة المحاولة في حالة الخطأ
  const handleRetry = async () => {
    setError(null);
    
    try {
      if (hasPermission === false) {
        // طلب الإذن مرة أخرى
        if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const result = await BarcodeScanner.requestPermissions();
          setHasPermission(result.camera === 'granted');
          
          if (result.camera === 'granted') {
            setIsInitialized(true);
            startScan();
          } else {
            setError('تم رفض إذن الكاميرا');
          }
        } else {
          // في بيئة الويب، نحاول مرة أخرى
          startWebCamera();
        }
      } else {
        // إعادة تشغيل المسح
        if (isInitialized) {
          startScan();
        } else {
          // إعادة تهيئة الماسح
          setIsInitialized(true);
          setTimeout(() => {
            startScan();
          }, 500);
        }
      }
    } catch (e) {
      console.error('خطأ في إعادة المحاولة:', e);
      setError('حدث خطأ أثناء إعادة المحاولة');
    }
  };
  
  // طلب الإذن
  const requestPermission = async () => {
    try {
      console.log('ZXingBarcodeScanner: طلب إذن الكاميرا');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.requestPermissions();
        setHasPermission(result.camera === 'granted');
        
        if (result.camera === 'granted') {
          setIsInitialized(true);
          startScan();
          return true;
        } else {
          setError('تم رفض إذن الكاميرا');
          return false;
        }
      } else {
        // في بيئة الويب، نطلب الإذن مباشرة عند بدء الكاميرا
        await startWebCamera();
        return true;
      }
    } catch (e) {
      console.error('خطأ في طلب الإذن:', e);
      setError('حدث خطأ أثناء طلب الإذن');
      return false;
    }
  };

  // JSX للعرض
  return (
    <div className="scanner-container fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* رأس الصفحة */}
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-white text-lg font-medium">مسح الباركود</h3>
        <Button 
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* منطقة المسح */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* عنصر الفيديو للويب */}
        {!Capacitor.isNativePlatform() && (
          <div className="w-full relative flex flex-col items-center">
            <video 
              ref={videoRef}
              className="w-full max-h-80 object-cover rounded-lg shadow-lg"
              playsInline
              muted
            />
            {/* إطار المسح */}
            <div className="absolute inset-0 border-2 border-white/25 pointer-events-none rounded-lg">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white rounded-br-lg"></div>
              
              {/* خط المسح المتحرك */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 animate-pulse transform -translate-y-1/2"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                  قم بتوجيه الكاميرا نحو الباركود
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* حالة الخطأ */}
        {error && (
          <div className="bg-red-500/20 p-4 rounded-lg text-white text-center mb-4">
            <p className="font-semibold mb-2">{error}</p>
            <Button 
              onClick={handleRetry}
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        )}
        
        {/* حالة الإذن */}
        {hasPermission === false && (
          <div className="bg-black/80 p-4 rounded-lg text-white text-center">
            <div className="mb-4">
              <Camera className="h-12 w-12 mx-auto mb-2 text-red-500" />
              <p className="font-semibold text-lg">لا يوجد إذن للكاميرا</p>
              <p className="text-sm text-gray-300 mt-1 mb-4">يرجى السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي</p>
            </div>
            
            <Button 
              onClick={requestPermission}
              className="w-full mb-2"
            >
              <Camera className="h-4 w-4 ml-2" />
              طلب إذن الكاميرا
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-white/50 text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 ml-2" />
              إغلاق
            </Button>
          </div>
        )}
      </div>
      
      {/* أزرار التحكم */}
      <div className="p-4 flex justify-center">
        {isScanning ? (
          <Button 
            onClick={stopScan}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <X className="h-4 w-4 ml-2" />
            إيقاف المسح
          </Button>
        ) : (
          <>
            {hasPermission !== false && !error && (
              <Button 
                onClick={startScan}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Camera className="h-4 w-4 ml-2" />
                بدء المسح
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ZXingBarcodeScanner;
