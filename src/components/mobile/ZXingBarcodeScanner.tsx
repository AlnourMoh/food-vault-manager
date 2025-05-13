
import React, { useEffect, useState } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { BrowserView } from './scanner/components/BrowserView';
import { PermissionView } from './scanner/components/PermissionView';
import { LoadingView } from './scanner/components/LoadingView';
import { ScannerView } from './scanner/components/ScannerView';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import CapacitorTester from './CapacitorTester';
import { Button } from '../ui/button';
import { ScannerErrorBanner } from './scanner/components/ScannerErrorBanner';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
  onManualEntry?: () => void;
}

const ZXingBarcodeScanner = ({ onScan, onClose, autoStart = true, onManualEntry }: ZXingBarcodeScannerProps) => {
  // التحقق من بيئة التشغيل
  const [isNativePlatform, setIsNativePlatform] = useState(() => Capacitor.isNativePlatform());
  const [isWebView, setIsWebView] = useState(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || userAgent.includes('capacitor');
  });
  
  const [showDebug, setShowDebug] = useState(false);
  const [mountTime] = useState(Date.now());
  const { toast } = useToast();
  
  // Simple mock scanner for testing UI
  const [mockActive, setMockActive] = useState(false);
  const [mockValue, setMockValue] = useState("");
  
  // دالة مخصصة للتعامل مع نتائج المسح لمنع المسح المتكرر
  const handleScan = (code: string) => {
    console.log(`ZXingBarcodeScanner: تم المسح بنجاح [${code}]`);
    toast({
      title: "تم المسح بنجاح",
      description: `تم مسح الباركود: ${code}`,
    });
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
    console.log('ZXingBarcodeScanner: تم تحميل المكون');
    
    // عرض إشعار للمستخدم
    toast({
      title: "جاري تهيئة الماسح",
      description: "يرجى الانتظار..."
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
  
  // معالج المسح المزيف للاختبار
  const handleMockScan = () => {
    if (mockValue) {
      handleScan(mockValue);
    } else {
      // قيمة افتراضية إذا لم يتم إدخال قيمة
      handleScan("MOCK-12345");
    }
  };
  
  // عرض رسالة خطأ إذا كنا في بيئة متصفح ولسنا في بيئة تطبيق
  if (!isNativePlatform && !isWebView) {
    return (
      <div className="scanner-view-container p-4">
        <ScannerErrorBanner 
          message="المسح غير متاح في المتصفح" 
          subMessage="يرجى استخدام تطبيق الجوال للقيام بعمليات المسح"
        />
        <BrowserView onClose={handleClose} />
      </div>
    );
  }
  
  // For testing UI in any environment
  if (mockActive) {
    return (
      <div className="scanner-view-container p-6">
        <h3 className="text-xl text-white mb-4 text-center">وضع المحاكاة - ادخل رمز للمسح</h3>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            value={mockValue} 
            onChange={(e) => setMockValue(e.target.value)}
            placeholder="أدخل الباركود هنا" 
            className="p-2 border rounded"
          />
          <Button onClick={handleMockScan}>مسح</Button>
          <Button variant="outline" onClick={() => setMockActive(false)}>إلغاء</Button>
        </div>
      </div>
    );
  }
  
  // إظهار المحاكاة فقط بعد فشل الطرق الأخرى
  const activateMockScanner = () => {
    toast({
      title: "تفعيل وضع المحاكاة",
      description: "تم تفعيل وضع محاكاة الماسح"
    });
    setMockActive(true);
  };
  
  // أثناء التحقق من الإذن أو عملية المسح النشطة
  if (isLoading || hasPermission === null) {
    return (
      <div className="scanner-view-container">
        <LoadingView hasPermission={hasPermission} scanActive={scanActive} onClose={handleClose} />
        <Button 
          onClick={activateMockScanner}
          variant="default" 
          className="mt-4 mx-auto block"
        >
          استخدام المسح الافتراضي
        </Button>
        
        {showDebug && (
          <div className="mt-4">
            <CapacitorTester />
          </div>
        )}
      </div>
    );
  }
  
  // إذا لم يكن لدينا إذن الكاميرا
  if (hasPermission === false) {
    return (
      <div className="scanner-view-container">
        <PermissionView 
          handleRequestPermission={async () => {
            await checkAndRequestPermissions();
          }} 
          onClose={handleClose}
          onManualEntry={onManualEntry}
        />
        <Button 
          onClick={activateMockScanner}
          variant="default" 
          className="mt-4 mx-auto block"
        >
          استخدام المسح الافتراضي
        </Button>
        
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
    <div className="scanner-view-container">
      <ScannerView 
        isActive={scanActive}
        cameraActive={cameraActive || false}
        hasError={false}
        onStartScan={startScan}
        onStopScan={stopScan}
        onRetry={() => startScan()}
        onClose={handleClose}
      />
      
      <Button 
        onClick={activateMockScanner}
        variant="default" 
        className="mt-4 mx-auto block"
      >
        استخدام المسح الافتراضي
      </Button>
      
      {showDebug && (
        <div className="mt-4 p-4 bg-black text-white rounded">
          <CapacitorTester />
        </div>
      )}
      
      <button 
        className="mt-4 text-sm text-gray-300 underline"
        onClick={() => setShowDebug(prev => !prev)}
      >
        {showDebug ? "إخفاء التشخيص" : "عرض التشخيص"}
      </button>
    </div>
  );
};

export default ZXingBarcodeScanner;
