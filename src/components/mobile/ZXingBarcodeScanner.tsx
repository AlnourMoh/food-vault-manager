
import React, { useEffect, useState } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { BrowserView } from './scanner/components/BrowserView';
import { PermissionView } from './scanner/components/PermissionView';
import { LoadingView } from './scanner/components/LoadingView';
import { ScannerView } from './scanner/components/ScannerView';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import CapacitorTester from './CapacitorTester';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
  onManualEntry?: () => void;
}

const ZXingBarcodeScanner = ({ onScan, onClose, autoStart = true, onManualEntry }: ZXingBarcodeScannerProps) => {
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // تحقق من بيئة التشغيل عند تحميل المكون
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    
    console.log('ZXingBarcodeScanner: هل نحن في بيئة أصلية؟', isNative);
    console.log('ZXingBarcodeScanner: المنصة الحالية:', platform);
    
    setIsNativePlatform(isNative);
    
    // عرض إشعار للمستخدم
    toast({
      title: isNative ? "بيئة الجوال" : "بيئة المتصفح",
      description: isNative 
        ? "تم اكتشاف بيئة الجوال، يمكنك استخدام الماسح الضوئي" 
        : "أنت في المتصفح، بعض الميزات قد لا تعمل"
    });
  }, [toast]);
  
  const {
    hasPermission,
    scanActive,
    cameraActive,
    isLoading,
    startScan,
    stopScan,
    checkAndRequestPermissions
  } = useZXingBarcodeScanner(autoStart, onScan, onClose);
  
  // إذا كنا في بيئة المتصفح، نظهر رسالة بدلاً من الماسح
  if (!isNativePlatform) {
    return (
      <div>
        <BrowserView onClose={onClose} />
        
        {showDebug && (
          <div className="mt-4">
            <CapacitorTester />
          </div>
        )}
        
        <button 
          className="mt-4 text-sm text-gray-500 underline"
          onClick={() => setShowDebug(prev => !prev)}
        >
          {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
        </button>
      </div>
    );
  }
  
  // إذا لم يكن لدينا إذن الكاميرا
  if (hasPermission === false) {
    return (
      <div>
        <PermissionView 
          handleRequestPermission={async () => {
            await checkAndRequestPermissions();
          }} 
          onClose={onClose}
          onManualEntry={onManualEntry}
        />
        
        {showDebug && (
          <div className="mt-4">
            <CapacitorTester />
          </div>
        )}
        
        <button 
          className="mt-4 text-sm text-gray-500 underline"
          onClick={() => setShowDebug(prev => !prev)}
        >
          {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
        </button>
      </div>
    );
  }
  
  // أثناء التحقق من الإذن أو عملية المسح النشطة
  if (isLoading || hasPermission === null) {
    return (
      <div>
        <LoadingView hasPermission={hasPermission} scanActive={scanActive} onClose={onClose} />
        
        {showDebug && (
          <div className="mt-4">
            <CapacitorTester />
          </div>
        )}
        
        <button 
          className="mt-4 text-sm text-gray-500 underline"
          onClick={() => setShowDebug(prev => !prev)}
        >
          {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
        </button>
      </div>
    );
  }
  
  // واجهة المستخدم الرئيسية للماسح
  return (
    <div>
      <ScannerView 
        isActive={scanActive}
        cameraActive={cameraActive || false}
        hasError={false}
        onStartScan={startScan}
        onStopScan={stopScan}
        onRetry={() => startScan()}
        onClose={onClose}
        onManualEntry={onManualEntry}
      />
      
      {showDebug && (
        <div className="mt-4">
          <CapacitorTester />
        </div>
      )}
      
      <button 
        className="mt-4 text-sm text-gray-500 underline"
        onClick={() => setShowDebug(prev => !prev)}
      >
        {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
      </button>
    </div>
  );
};

export default ZXingBarcodeScanner;
