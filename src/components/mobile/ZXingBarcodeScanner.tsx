
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
  const [mountTime] = useState(Date.now());
  const { toast } = useToast();
  
  // دالة مخصصة للتعامل مع نتائج المسح لمنع المسح المتكرر
  const handleScan = (code: string) => {
    console.log(`ZXingBarcodeScanner: تم المسح بنجاح [${code}]`);
    
    // استخدام تأخير بسيط لمنع مشاكل التأثيرات الجانبية
    setTimeout(() => {
      onScan(code);
    }, 100);
  };
  
  // دالة مخصصة للإغلاق مع تأكيد وتأخير
  const handleClose = () => {
    console.log('ZXingBarcodeScanner: إغلاق الماسح');
    
    // التحقق من الوقت المنقضي منذ تحميل المكون لمنع الإغلاق المبكر
    const timeElapsed = Date.now() - mountTime;
    if (timeElapsed < 1000) {
      console.log('ZXingBarcodeScanner: تجاهل محاولة الإغلاق المبكرة');
      return;
    }
    
    // تأخير الإغلاق قليلاً للسماح بإتمام عمليات أخرى إذا كانت جارية
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
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
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log('ZXingBarcodeScanner: إلغاء تحميل المكون والتنظيف');
    };
  }, [toast]);
  
  const {
    hasPermission,
    scanActive,
    cameraActive,
    isLoading,
    startScan,
    stopScan,
    checkAndRequestPermissions
  } = useZXingBarcodeScanner(autoStart, handleScan, handleClose);
  
  // تسجيل حالة المسح للتشخيص
  useEffect(() => {
    console.log('ZXingBarcodeScanner: حالة المسح -', { 
      hasPermission, 
      scanActive, 
      cameraActive, 
      isLoading 
    });
  }, [hasPermission, scanActive, cameraActive, isLoading]);
  
  // إذا كنا في بيئة المتصفح، نظهر رسالة بدلاً من الماسح
  if (!isNativePlatform) {
    return (
      <div>
        <BrowserView onClose={handleClose} />
        
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
          onClose={handleClose}
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
        <LoadingView hasPermission={hasPermission} scanActive={scanActive} onClose={handleClose} />
        
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
        onClose={handleClose}
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
