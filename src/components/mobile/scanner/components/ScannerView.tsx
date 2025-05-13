
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
  }, [cameraActive, hasError, onStartScan]);

  return (
    <div className="scanner-view">
      {hasError ? (
        <div className="scanner-error">
          <div className="bg-red-100 text-red-700 p-3 rounded-full">
            <ZapOff className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mt-4">خطأ في المسح الضوئي</h3>
          <p className="text-muted-foreground mb-6">
            تعذر تشغيل الماسح الضوئي. يرجى التحقق من أذونات الكاميرا والمحاولة مرة أخرى.
          </p>
          <div className="flex gap-2">
            <Button onClick={onRetry} variant="default">
              إعادة المحاولة
            </Button>
            {onManualEntry && (
              <Button onClick={onManualEntry} variant="outline">
                إدخال يدوي
              </Button>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDebug(prev => !prev)}
            >
              {showDebug ? "إخفاء معلومات التشخيص" : "عرض معلومات التشخيص"}
            </Button>
            
            {showDebug && <CapacitorTester />}
          </div>
        </div>
      ) : (
        <div className="scanner-active-view">
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
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
              <div className="text-center p-6 bg-white rounded-lg max-w-sm">
                <Smartphone className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                <h3 className="text-lg font-bold mb-2">المسح غير متاح في المتصفح</h3>
                <p className="text-gray-600 mb-4">
                  ميزة المسح الضوئي تعمل فقط في تطبيق الجوال، وليس في المتصفح.
                </p>
                <Button onClick={onClose} className="w-full">فهمت</Button>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDebug(prev => !prev)}
                  >
                    {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
                  </Button>
                  
                  {showDebug && <CapacitorTester />}
                </div>
              </div>
            </div>
          )}
          
          <div className="scanner-active-content">
            {!isActive && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-blue-100 text-blue-700 p-3 rounded-full">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mt-4">جاهز للمسح</h3>
                <p className="text-muted-foreground mb-6">
                  اضغط على بدء المسح وقم بتوجيه الكاميرا نحو الباركود
                </p>
                <Button onClick={() => onStartScan()}>بدء المسح</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
