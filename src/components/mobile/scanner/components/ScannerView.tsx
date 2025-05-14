
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, ZapOff, Zap, Smartphone } from 'lucide-react';
import CapacitorTester from '../../CapacitorTester';
import { Capacitor } from '@capacitor/core';

interface ScannerViewProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
  onManualEntry?: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isActive,
  cameraActive,
  hasError,
  onStartScan,
  onStopScan,
  onRetry,
  onClose,
  onManualEntry
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const [isNativePlatform, setIsNativePlatform] = useState(false);

  useEffect(() => {
    // تحقق من بيئة التشغيل
    const isNative = Capacitor.isNativePlatform();
    setIsNativePlatform(isNative);
    
    console.log('ScannerView: هل نحن في بيئة أصلية؟', isNative);
    console.log('ScannerView: المنصة الحالية:', Capacitor.getPlatform());
    
    // محاولة بدء المسح تلقائياً إذا كانت الكاميرا نشطة
    if (cameraActive && isNative && !hasError) {
      console.log('ScannerView: محاولة بدء المسح تلقائياً');
      onStartScan();
    }
    
    // تطبيق فئات خاصة بعناصر واجهة المستخدم للماسح
    document.body.classList.add('scanner-active');
    
    return () => {
      // تنظيف عند إلغاء التحميل
      document.body.classList.remove('scanner-active');
    };
  }, [cameraActive, hasError, onStartScan]);

  return (
    <div className="scanner-view-container bg-black text-white min-h-[70vh] flex flex-col items-center justify-center p-6 relative">
      {hasError ? (
        <div className="scanner-error flex flex-col items-center justify-center text-center max-w-xs mx-auto">
          <div className="bg-red-100 text-red-700 p-3 rounded-full mb-4">
            <ZapOff className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mt-4 text-white">خطأ في المسح الضوئي</h3>
          <p className="text-gray-300 mb-6">
            تعذر تشغيل الماسح الضوئي. يرجى التحقق من أذونات الكاميرا والمحاولة مرة أخرى.
          </p>
          <div className="flex gap-2">
            <Button onClick={onRetry} variant="default" className="bg-blue-600 hover:bg-blue-700">
              إعادة المحاولة
            </Button>
            {onManualEntry && (
              <Button onClick={onManualEntry} variant="outline" className="text-white border-white hover:bg-gray-800">
                إدخال يدوي
              </Button>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDebug(prev => !prev)}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              {showDebug ? "إخفاء معلومات التشخيص" : "عرض معلومات التشخيص"}
            </Button>
            
            {showDebug && <CapacitorTester />}
          </div>
        </div>
      ) : (
        <div className="scanner-active-view w-full h-full relative">
          <div className="absolute top-4 right-4 z-20 flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-gray-800/50 text-white hover:bg-gray-800/70"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {!isNativePlatform && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/90">
              <div className="text-center p-6 bg-gray-900 rounded-lg max-w-sm">
                <Smartphone className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                <h3 className="text-lg font-bold mb-2 text-white">المسح غير متاح في المتصفح</h3>
                <p className="text-gray-400 mb-4">
                  ميزة المسح الضوئي تعمل فقط في تطبيق الجوال، وليس في المتصفح.
                </p>
                <Button onClick={onClose} className="w-full">فهمت</Button>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDebug(prev => !prev)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
                  </Button>
                  
                  {showDebug && <CapacitorTester />}
                </div>
              </div>
            </div>
          )}
          
          <div className="scanner-active-content h-full flex flex-col items-center justify-center">
            {!isActive && (
              <div className="flex flex-col items-center justify-center pt-10 pb-20">
                <div className="bg-blue-100 text-blue-700 p-3 rounded-full mb-6">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">جاهز للمسح</h3>
                <p className="text-gray-300 mb-6 text-center max-w-xs">
                  اضغط على بدء المسح وقم بتوجيه الكاميرا نحو الباركود
                </p>
                <Button 
                  onClick={() => onStartScan()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  بدء المسح
                </Button>
              </div>
            )}
            
            {isActive && (
              <div className="scanner-frame-container relative w-full flex-1 flex items-center justify-center">
                <div className="scanner-frame animate-scanner-box-pulse"></div>
                <div className="text-white text-center absolute bottom-10 left-0 right-0">
                  <p className="mb-4 text-sm bg-black/50 py-2 px-4 rounded-full inline-block">
                    قم بتوجيه الكاميرا نحو الباركود
                  </p>
                  <Button 
                    onClick={() => onStopScan()}
                    variant="outline" 
                    className="border-white text-white hover:bg-gray-800"
                  >
                    إلغاء المسح
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
