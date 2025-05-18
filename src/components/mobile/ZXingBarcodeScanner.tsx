
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useScannerPermissions } from '@/hooks/mobile/scan/useScannerPermissions';
import { useScannerDevice } from '@/hooks/scanner/useScannerDevice';
import { Toast } from '@capacitor/toast';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan,
  onClose,
  autoStart = false
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(autoStart);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { checkPermission, requestPermission } = useScannerPermissions();
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();

  useEffect(() => {
    // طباعة معلومات عن بيئة التشغيل للتشخيص
    console.log('ZXingBarcodeScanner: التشخيص', {
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform(),
      autoStart,
      mlkitAvailable: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
      cameraPerm: hasPermission
    });
    
    // فحص إذن الكاميرا أولاً
    const checkCameraPermission = async () => {
      try {
        const hasPermission = await checkPermission();
        console.log('ZXingBarcodeScanner: نتيجة فحص إذن الكاميرا:', hasPermission);
        setHasPermission(hasPermission);
        
        if (!hasPermission) {
          console.log('ZXingBarcodeScanner: طلب إذن الكاميرا');
          const permGranted = await requestPermission();
          setHasPermission(permGranted);
          
          if (!permGranted) {
            setError('تم رفض إذن الكاميرا');
            return;
          }
        }
        
        // في حالة autoStart، نبدأ المسح فوراً بعد الحصول على الإذن
        if (autoStart && hasPermission) {
          console.log('ZXingBarcodeScanner: بدء المسح تلقائياً');
          startScan();
        }
      } catch (error) {
        console.error('ZXingBarcodeScanner: خطأ في التحقق من إذن الكاميرا:', error);
        setError('حدث خطأ أثناء التحقق من إذن الكاميرا');
      }
    };
    
    checkCameraPermission();
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log('ZXingBarcodeScanner: تنظيف الموارد');
      stopScan();
    };
  }, []);

  const startScan = async () => {
    try {
      console.log('ZXingBarcodeScanner: بدء المسح');
      setIsScanning(true);
      setError(null);
      
      // عرض رسالة تأكيد للمستخدم
      try {
        await Toast.show({
          text: 'جاري تفعيل الكاميرا...',
          duration: 'short'
        });
      } catch (e) {}
      
      // تفعيل الكاميرا والماسح
      const success = await startDeviceScan((code) => {
        console.log('ZXingBarcodeScanner: تم استلام رمز:', code);
        // معالجة الرمز الممسوح
        onScan(code);
      });
      
      if (success) {
        setCameraActive(true);
        console.log('ZXingBarcodeScanner: تم بدء المسح بنجاح');
      } else {
        setError('فشل في بدء المسح');
        setIsScanning(false);
      }
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في بدء المسح:', error);
      setError(`خطأ في بدء المسح: ${error.message || 'خطأ غير معروف'}`);
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      console.log('ZXingBarcodeScanner: إيقاف المسح');
      setIsScanning(false);
      setCameraActive(false);
      
      await stopDeviceScan();
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح:', error);
    }
  };

  // يتم رسم واجهة المستخدم بالاعتماد على حالة الماسح
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* واجهة مسح الباركود */}
      <div className="scanner-container relative w-full h-full">
        {/* منطقة الكاميرا */}
        <div id="scanner-camera-view" className="w-full h-full overflow-hidden">
          {/* خلفية الماسح هنا */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-center">
            <div className="text-white text-lg font-bold text-center">
              قارئ الباركود
            </div>
          </div>
          
          {!cameraActive && !error && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mb-4"></div>
              <p className="text-white text-center">جاري تفعيل الكاميرا...</p>
            </div>
          )}
          
          {error && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <div className="bg-red-600/80 p-4 rounded-lg max-w-md text-center">
                <p className="text-white mb-4">{error}</p>
                <button 
                  className="bg-white text-red-600 px-4 py-2 rounded-md"
                  onClick={startScan}
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )}
          
          {/* إطار المسح */}
          {cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 aspect-square relative border-2 border-white/70 rounded-lg">
                {/* زوايا الإطار */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white"></div>
                
                {/* خط المسح المتحرك */}
                <div className="absolute left-0 w-full h-0.5 bg-red-500 animate-scanner-line"></div>
              </div>
            </div>
          )}
          
          {/* رسالة توجيهية في الأسفل */}
          <div className="absolute bottom-24 inset-x-0 p-6 flex justify-center">
            <div className="text-white text-center">
              وجه الكاميرا نحو الباركود للمسح
            </div>
          </div>
        </div>
        
        {/* أزرار التحكم */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          <div className="flex justify-center">
            <button 
              className="bg-white text-black w-16 h-16 rounded-full flex items-center justify-center"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZXingBarcodeScanner;
