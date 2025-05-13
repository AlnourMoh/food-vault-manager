
import React, { useEffect, useState } from 'react';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Smartphone } from 'lucide-react';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan, 
  onClose,
  autoStart = true // Always auto-start by default
}) => {
  const {
    isManualEntry,
    hasScannerError,
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    requestPermission,
    handleRetry,
    cameraActive,
    setCameraActive
  } = useScannerControls({ onScan, onClose });

  const { toast } = useToast();
  const [isWebEnvironment, setIsWebEnvironment] = useState(false);

  // التحقق مما إذا كنا في بيئة الويب
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      // في بيئة الويب
      setIsWebEnvironment(true);
    }
  }, []);

  // تفعيل الكاميرا فوراً عند تحميل المكون في بيئة الأجهزة
  useEffect(() => {
    if (!isWebEnvironment) {
      console.log('ZXingBarcodeScanner: تفعيل الكاميرا فورًا عند تحميل المكون');
      
      // تفعيل الكاميرا
      setCameraActive(true);
      
      // بدء المسح فوراً
      const timerRef = setTimeout(() => {
        startScan().catch(error => {
          console.error('ZXingBarcodeScanner: خطأ في بدء المسح المباشر:', error);
        });
      }, 500);
      
      return () => {
        clearTimeout(timerRef);
        stopScan().catch(error => {
          console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح عند التنظيف:', error);
        });
      };
    }
  }, [isWebEnvironment]);

  // إظهار رسالة في بيئة الويب
  if (isWebEnvironment) {
    return (
      <Card className="p-6 flex flex-col items-center text-center">
        <Smartphone className="h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">المسح غير متاح في المتصفح</h2>
        <p className="text-gray-500 mb-6">
          عملية مسح الباركود متاحة فقط في تطبيق الهاتف المحمول.
          يرجى استخدام تطبيق الجوال للقيام بعمليات المسح.
        </p>
        <Button 
          onClick={onClose} 
          className="w-full"
          variant="default"
        >
          إغلاق
        </Button>
      </Card>
    );
  }

  // استخدام الماسح الحقيقي في بيئة الأجهزة الجوالة
  return (
    <ScannerContainer
      isManualEntry={isManualEntry}
      hasScannerError={hasScannerError}
      isLoading={isLoading}
      hasPermission={hasPermission}
      isScanningActive={isScanningActive}
      lastScannedCode={lastScannedCode}
      onScan={onScan}
      onClose={onClose}
      startScan={startScan}
      stopScan={stopScan}
      handleManualEntry={handleManualEntry}
      handleManualCancel={handleManualCancel}
      handleRequestPermission={requestPermission}
      handleRetry={handleRetry}
      cameraActive={cameraActive}
    />
  );
};

export default ZXingBarcodeScanner;
