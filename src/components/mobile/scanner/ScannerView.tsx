
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerControls } from './components/ScannerControls';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { X, RefreshCw, Loader2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

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
      hasError,
      barcodeScannerAvailable: Capacitor.isPluginAvailable('BarcodeScanner'),
      mlkitAvailable: Capacitor.isPluginAvailable('MLKitBarcodeScanner')
    });
  }, [isActive, cameraActive, hasError]);

  // بدء المسح فورًا بمجرد أن تكون الكاميرا جاهزة
  useEffect(() => {
    if (cameraActive && !isActive && !hasError) {
      console.log('ScannerView: الكاميرا جاهزة، بدء المسح تلقائيًا');
      
      // عرض رسالة للمستخدم
      Toast.show({
        text: 'الكاميرا جاهزة. جاري بدء المسح...',
        duration: 'short'
      }).catch(() => {});
      
      // بدء المسح
      onStartScan().catch(error => {
        console.error('ScannerView: خطأ في بدء المسح التلقائي:', error);
        
        // عرض رسالة خطأ
        Toast.show({
          text: 'حدث خطأ في بدء المسح. حاول مرة أخرى',
          duration: 'short'
        }).catch(() => {});
      });
    }
  }, [cameraActive, isActive, hasError, onStartScan]);

  // إذا كان هناك خطأ في الكاميرا
  if (hasError) {
    return (
      <div className="scanner-view-container relative h-full w-full bg-black/90 flex flex-col items-center justify-center">
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
      <div className="scanner-view-container relative h-full w-full bg-black/90 flex flex-col items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="mb-6 flex flex-col items-center">
            <Spinner size="lg" className="border-white border-t-transparent mb-6" />
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

  // عرض الماسح النشط
  return (
    <div className="scanner-view-container relative h-full w-full">
      {/* إطار الماسح */}
      <ScannerFrame 
        isActive={isActive} 
        cameraActive={cameraActive} 
        hasError={hasError} 
      />
      
      {/* مؤشر حالة الماسح */}
      <ScannerStatusIndicator 
        isActive={isActive} 
        cameraActive={cameraActive}
        hasError={hasError}
      />
      
      {/* عناصر التحكم في الماسح */}
      <ScannerControls 
        isActive={isActive}
        cameraActive={cameraActive}
        hasError={hasError}
        onStartScan={onStartScan}
        onStopScan={onStopScan}
        onRetry={onRetry}
        onClose={onClose}
        onToggleFlash={onToggleFlash}
      />
      
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
    </div>
  );
};
