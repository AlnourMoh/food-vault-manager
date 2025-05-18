
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Camera } from 'lucide-react';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { ActiveCameraView } from './ActiveCameraView';
import { scannerUIService } from '@/services/scanner/ScannerUIService';

interface ScannerViewProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
  onToggleFlash?: () => void;
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
  onToggleFlash,
  onManualEntry
}) => {
  // تسجيل معلومات للتشخيص
  useEffect(() => {
    console.log('ScannerView: بيئة المسح:', {
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform(),
      isActive,
      cameraActive,
      hasError
    });

    // تأكد من أن عناصر الفيديو مرئية
    if (cameraActive) {
      scannerUIService.updateVideoVisibility(true);
    }
    
    return () => {
      // تنظيف عند إزالة المكون
      scannerUIService.updateVideoVisibility(false);
    };
  }, [isActive, cameraActive, hasError]);

  // بدء المسح فورًا بمجرد أن تكون الكاميرا جاهزة
  useEffect(() => {
    if (cameraActive && !isActive && !hasError) {
      console.log('ScannerView: الكاميرا جاهزة، بدء المسح تلقائيًا');
      
      // بدء المسح
      onStartScan().catch(error => {
        console.error('ScannerView: خطأ في بدء المسح التلقائي:', error);
      });
    }
  }, [cameraActive, isActive, hasError, onStartScan]);

  // إذا كان هناك خطأ في الكاميرا
  if (hasError) {
    return (
      <div className="scanner-view-container relative h-full w-full flex flex-col items-center justify-center bg-black/90">
        <div className="text-white text-center p-4">
          <div className="mb-4">
            <div className="bg-red-500/20 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-2">
              <RefreshCw className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">حدث خطأ في الكاميرا</h3>
            <p className="text-sm text-gray-300 mb-4">تعذر تشغيل الكاميرا. يرجى التحقق من أذونات الكاميرا وإعادة المحاولة.</p>
          </div>
          <Button onClick={onRetry} className="bg-white text-black hover:bg-gray-200 w-full mb-2">
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
          {onManualEntry && (
            <Button onClick={onManualEntry} variant="outline" className="text-white border-white hover:bg-white/20 w-full mb-2">
              إدخال الرمز يدوياً
            </Button>
          )}
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 w-full">
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    );
  }
  
  // انتظار تفعيل الكاميرا
  if (!cameraActive) {
    return (
      <div className="scanner-view-container relative h-full w-full flex flex-col items-center justify-center bg-black/90">
        <div className="text-white text-center p-4">
          <div className="mb-6 flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mb-6"></div>
            <h3 className="text-xl font-semibold mb-3">جاري تفعيل الكاميرا</h3>
            <p className="text-sm text-gray-300 mb-2">يرجى الانتظار بضع لحظات...</p>
            <p className="text-xs text-gray-400">تأكد من منح التطبيق صلاحيات الوصول للكاميرا</p>
          </div>
          <Button onClick={onRetry} className="bg-white text-black hover:bg-gray-200 w-full mb-2">
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 w-full">
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
        </div>
      </div>
    );
  }

  // عرض الماسح النشط - تم تبسيطه لتجنب مشكلة الشاشة السوداء
  return (
    <div className="scanner-container relative h-full w-full bg-black">
      {/* عرض الكاميرا بشكل مباشر */}
      <ActiveCameraView />
      
      {/* إطار المسح */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs aspect-square border-2 border-white rounded-lg overflow-hidden z-10">
        {/* خط المسح المتحرك */}
        <div className="absolute left-0 w-full h-0.5 bg-green-500 animate-scanner-line"></div>
        
        {/* زوايا الإطار */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
      </div>
      
      {/* مؤشر حالة الماسح */}
      <div className="absolute top-8 left-0 right-0 text-center">
        {isActive ? (
          <div className="bg-green-500 text-white px-4 py-1 rounded-full inline-flex items-center">
            <span className="mr-2 size-2 bg-white rounded-full animate-pulse"></span>
            جاري المسح...
          </div>
        ) : (
          <div className="bg-yellow-500 text-white px-4 py-1 rounded-full inline-flex items-center">
            <span className="mr-2 size-2 bg-white rounded-full"></span>
            انتظار بدء المسح
          </div>
        )}
      </div>
      
      {/* زر إغلاق للحالات الطارئة */}
      <Button
        onClick={onClose}
        className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 size-10"
        variant="ghost"
        size="icon"
      >
        <span className="sr-only">إغلاق</span>
        <X className="h-6 w-6" />
      </Button>
      
      {/* نص إرشادي في الأسفل */}
      <div className="absolute bottom-24 left-0 right-0 text-center">
        <p className="text-white text-sm px-4 py-2 bg-black/30 inline-block rounded-full">
          وجّه الكاميرا نحو الباركود للمسح
        </p>
      </div>
      
      {/* شريط التحكم */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50">
        <Button onClick={onClose} variant="ghost" className="text-white">
          إغلاق
        </Button>
        
        <Button 
          onClick={() => {
            if (isActive) {
              onStopScan();
            } else {
              onStartScan();
            }
          }} 
          className={`rounded-full size-14 flex items-center justify-center ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          <Camera className="h-6 w-6 text-white" />
        </Button>
        
        <Button 
          onClick={onRetry} 
          variant="ghost" 
          className="text-white"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
